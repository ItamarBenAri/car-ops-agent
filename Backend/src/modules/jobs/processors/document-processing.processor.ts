import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job as BullJob } from 'bull';
import {
  Job,
  JobStatus,
  JobType,
  Document,
  DocumentStatus,
  Expense,
  Issue,
  IssueSeverity,
  Car,
} from '@/database/entities';
import { ParsingService } from '../../parsing/parsing.service';
import { RemindersService } from '../../reminders/reminders.service';
import { DOCUMENT_PROCESSING_QUEUE } from '../jobs.constants';

@Processor(DOCUMENT_PROCESSING_QUEUE)
export class DocumentProcessingProcessor {
  private readonly logger = new Logger(DocumentProcessingProcessor.name);

  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private parsingService: ParsingService,
    private remindersService: RemindersService,
  ) {}

  @Process(JobType.PARSE_RECEIPT)
  async handleParseReceipt(bullJob: BullJob) {
    const { jobId, documentId } = bullJob.data;
    this.logger.log(`Processing receipt for document ${documentId}`);

    const dbJob = await this.jobsRepository.findOne({ where: { id: jobId } });
    if (!dbJob) return;

    try {
      // Mark running
      dbJob.status = JobStatus.RUNNING;
      dbJob.startedAt = new Date();
      dbJob.attempts += 1;
      await this.jobsRepository.save(dbJob);

      // Update document status
      const document = await this.documentsRepository.findOne({
        where: { id: documentId },
      });
      if (!document) throw new Error(`Document ${documentId} not found`);

      document.status = DocumentStatus.PROCESSING;
      await this.documentsRepository.save(document);

      // Parse with Claude AI
      const parsed = await this.parsingService.parseReceipt(
        document.filename,
        document.mimeType,
      );

      // Save extracted data to document
      document.extractedData = parsed;
      document.status = DocumentStatus.PROCESSED;
      await this.documentsRepository.save(document);

      // Create Expense from parsed data
      const expense = this.expensesRepository.create({
        carId: document.carId,
        documentId: document.id,
        date: parsed.date ? new Date(parsed.date) : new Date(),
        amount: parsed.amount || 0,
        vendor: parsed.vendor || 'לא ידוע',
        category: parsed.category || 'תחזוקה שוטפת',
        odometerKm: parsed.odometerKm || null,
        description: parsed.description || null,
        confidence: parsed.confidence || 0.8,
      });
      await this.expensesRepository.save(expense);

      // Auto-calculate reminders after expense saved
      const car = await this.carsRepository.findOne({
        where: { id: document.carId },
      });
      if (car && parsed.category) {
        await this.remindersService.autoCreateFromExpense(
          document.carId,
          parsed.category,
          car.currentOdometerKm,
        );
      }

      // Mark job done
      dbJob.status = JobStatus.DONE;
      dbJob.completedAt = new Date();
      dbJob.output = { expenseId: expense.id, parsed };
      await this.jobsRepository.save(dbJob);

      this.logger.log(`Receipt parsed successfully: expense ${expense.id}`);
    } catch (error) {
      this.logger.error(`Failed to parse receipt: ${error.message}`);
      dbJob.status = JobStatus.FAILED;
      dbJob.completedAt = new Date();
      dbJob.error = error.message;

      // Mark document failed
      const document = await this.documentsRepository.findOne({
        where: { id: documentId },
      });
      if (document) {
        document.status = DocumentStatus.FAILED;
        await this.documentsRepository.save(document);
      }

      await this.jobsRepository.save(dbJob);
      throw error; // Let Bull handle retries
    }
  }

  @Process(JobType.ANALYZE_ISSUE)
  async handleAnalyzeIssue(bullJob: BullJob) {
    const { jobId, documentId } = bullJob.data;
    this.logger.log(`Analyzing issue for document ${documentId}`);

    const dbJob = await this.jobsRepository.findOne({ where: { id: jobId } });
    if (!dbJob) return;

    try {
      dbJob.status = JobStatus.RUNNING;
      dbJob.startedAt = new Date();
      dbJob.attempts += 1;
      await this.jobsRepository.save(dbJob);

      const document = await this.documentsRepository.findOne({
        where: { id: documentId },
      });
      if (!document) throw new Error(`Document ${documentId} not found`);

      document.status = DocumentStatus.PROCESSING;
      await this.documentsRepository.save(document);

      // Analyze with Claude AI
      const analyzed = await this.parsingService.analyzeIssue(
        document.filename,
        document.mimeType,
      );

      document.extractedData = analyzed;
      document.status = DocumentStatus.PROCESSED;
      await this.documentsRepository.save(document);

      // Create Issue from analysis
      const severityMap: Record<string, IssueSeverity> = {
        low: IssueSeverity.LOW,
        medium: IssueSeverity.MEDIUM,
        high: IssueSeverity.HIGH,
        critical: IssueSeverity.CRITICAL,
      };
      const issue = this.issuesRepository.create({
        carId: document.carId,
        documentId: document.id,
        title: analyzed.title || 'תקלה שזוהתה',
        description: analyzed.description || '',
        severity: severityMap[analyzed.severity] || IssueSeverity.MEDIUM,
        reportedDate: new Date(),
        confidence: analyzed.confidence || 0.75,
      });
      await this.issuesRepository.save(issue);

      dbJob.status = JobStatus.DONE;
      dbJob.completedAt = new Date();
      dbJob.output = { issueId: issue.id, analyzed };
      await this.jobsRepository.save(dbJob);

      this.logger.log(`Issue analyzed successfully: issue ${issue.id}`);
    } catch (error) {
      this.logger.error(`Failed to analyze issue: ${error.message}`);
      dbJob.status = JobStatus.FAILED;
      dbJob.completedAt = new Date();
      dbJob.error = error.message;
      await this.jobsRepository.save(dbJob);
      throw error;
    }
  }
}