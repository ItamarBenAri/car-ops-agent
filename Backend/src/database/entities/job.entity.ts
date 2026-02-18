import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Document } from './document.entity';

export enum JobType {
  PARSE_RECEIPT = 'parse_receipt',
  ANALYZE_ISSUE = 'analyze_issue',
  CALCULATE_REMINDERS = 'calculate_reminders',
  SCAN_DRIVE = 'scan_drive',
}

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  DONE = 'done',
  FAILED = 'failed',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  documentId: string;

  @Column({
    type: 'text',
    enum: JobType,
  })
  type: JobType;

  @Column({
    type: 'text',
    enum: JobStatus,
    default: JobStatus.PENDING,
  })
  status: JobStatus;

  @Column({ type: 'simple-json', nullable: true })
  input: any; // Job input parameters

  @Column({ type: 'simple-json', nullable: true })
  output: any; // Job result

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'integer', default: 0 })
  attempts: number;

  @Column({ type: 'integer', default: 3 })
  maxAttempts: number;

  @Column({ type: 'datetime', nullable: true })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Document, (document) => document.jobs, { nullable: true })
  @JoinColumn({ name: 'documentId' })
  document: Document;
}
