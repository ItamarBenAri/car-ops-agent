import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Job, JobStatus, JobType } from '@/database/entities';
import { DOCUMENT_PROCESSING_QUEUE } from './jobs.module';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectQueue(DOCUMENT_PROCESSING_QUEUE)
    private documentQueue: Queue,
  ) {}

  async createJob(
    type: JobType,
    documentId: string,
    input: any,
  ): Promise<Job> {
    const job = this.jobsRepository.create({
      type,
      documentId,
      input,
      status: JobStatus.PENDING,
    });

    const savedJob = await this.jobsRepository.save(job);

    // Push to BullMQ queue
    await this.documentQueue.add(
      type,
      { jobId: savedJob.id, documentId, input },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return savedJob;
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({ where: { id } });
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async findByDocumentId(documentId: string): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { documentId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    output?: any,
    error?: string,
  ): Promise<Job> {
    const job = await this.findById(id);
    job.status = status;
    if (output) job.output = output;
    if (error) job.error = error;
    if (status === JobStatus.RUNNING) job.startedAt = new Date();
    if (status === JobStatus.DONE || status === JobStatus.FAILED) {
      job.completedAt = new Date();
    }
    return this.jobsRepository.save(job);
  }
}