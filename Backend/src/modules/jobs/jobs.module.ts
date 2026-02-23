import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job, Document, Expense, Issue, Car, Reminder } from '@/database/entities';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { DocumentProcessingProcessor } from './processors/document-processing.processor';
import { ParsingModule } from '../parsing/parsing.module';
import { RemindersModule } from '../reminders/reminders.module';
import { DOCUMENT_PROCESSING_QUEUE } from './jobs.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Document, Expense, Issue, Car, Reminder]),
    BullModule.registerQueue({
      name: DOCUMENT_PROCESSING_QUEUE,
    }),
    ParsingModule,
    RemindersModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, DocumentProcessingProcessor],
  exports: [JobsService, BullModule],
})
export class JobsModule {}