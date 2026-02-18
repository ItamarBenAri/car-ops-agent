import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Car } from './car.entity';
import { Expense } from './expense.entity';
import { MaintenanceEvent } from './maintenance-event.entity';
import { Issue } from './issue.entity';
import { Job } from './job.entity';

export enum DocumentType {
  RECEIPT = 'receipt',
  ISSUE_PHOTO = 'issue_photo',
  MANUAL = 'manual',
  OTHER = 'other',
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  carId: string;

  @Column()
  filename: string;

  @Column()
  mimeType: string; // application/pdf, image/jpeg, image/png

  @Column({ type: 'integer' })
  fileSize: number; // bytes

  @Column({ nullable: true })
  driveFileId: string; // Google Drive file ID

  @Column({
    type: 'text',
    enum: DocumentType,
    default: DocumentType.OTHER,
  })
  type: DocumentType;

  @Column({
    type: 'text',
    enum: DocumentStatus,
    default: DocumentStatus.UPLOADED,
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  checksum: string; // For duplicate detection

  @Column({ type: 'simple-json', nullable: true })
  extractedData: any; // Parsed data from AI

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Car, (car) => car.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @OneToMany(() => Expense, (expense) => expense.document)
  expenses: Expense[];

  @OneToMany(() => MaintenanceEvent, (event) => event.document)
  maintenanceEvents: MaintenanceEvent[];

  @OneToMany(() => Issue, (issue) => issue.document)
  issues: Issue[];

  @OneToMany(() => Job, (job) => job.document)
  jobs: Job[];
}
