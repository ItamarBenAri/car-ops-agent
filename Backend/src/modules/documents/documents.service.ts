import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus, DocumentType, JobType } from '@/database/entities';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    private jobsService: JobsService,
  ) {}

  async uploadAndProcess(
    file: Express.Multer.File,
    carId: string,
    type: DocumentType,
    _userId: string,
  ): Promise<{ document: Document; jobId: string }> {
    const document = this.documentsRepository.create({
      carId,
      filename: file.filename,
      mimeType: file.mimetype,
      fileSize: file.size,
      type,
      status: DocumentStatus.UPLOADED,
    });

    const savedDocument = await this.documentsRepository.save(document);

    const jobType =
      type === DocumentType.ISSUE_PHOTO ? JobType.ANALYZE_ISSUE : JobType.PARSE_RECEIPT;

    const job = await this.jobsService.createJob(jobType, savedDocument.id, {
      filename: file.filename,
      mimeType: file.mimetype,
      carId,
    });

    this.logger.log(`Document ${savedDocument.id} uploaded, job ${job.id} queued`);
    return { document: savedDocument, jobId: job.id };
  }

  async create(createDocumentDto: CreateDocumentDto, _ownerId: string): Promise<Document> {
    // TODO: Verify car belongs to owner
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      status: DocumentStatus.UPLOADED,
    });

    return await this.documentsRepository.save(document);
  }

  async findByCarId(carId: string, _ownerId: string): Promise<Document[]> {
    // TODO: Verify car belongs to owner
    return await this.documentsRepository.find({
      where: { carId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async findOne(id: string, _ownerId: string): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: ['car'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // TODO: Verify document.car.ownerId === ownerId

    return document;
  }

  async updateStatus(
    id: string,
    status: DocumentStatus,
    extractedData?: any,
  ): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    document.status = status;
    if (extractedData) {
      document.extractedData = extractedData;
    }

    return await this.documentsRepository.save(document);
  }

  async remove(id: string, _ownerId: string): Promise<void> {
    const document = await this.findOne(id, _ownerId);
    await this.documentsRepository.remove(document);
  }
}
