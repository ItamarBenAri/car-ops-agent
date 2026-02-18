import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Car } from './car.entity';
import { Document } from './document.entity';

export enum IssueSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  carId: string;

  @Column({ nullable: true })
  documentId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'text',
    enum: IssueSeverity,
    default: IssueSeverity.MEDIUM,
  })
  severity: IssueSeverity;

  @Column({
    type: 'text',
    enum: IssueStatus,
    default: IssueStatus.OPEN,
  })
  status: IssueStatus;

  @Column({ type: 'date' })
  reportedDate: Date;

  @Column({ type: 'integer', nullable: true })
  odometerKm: number;

  @Column({ type: 'date', nullable: true })
  resolvedDate: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  confidence: number; // AI confidence score

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Car, (car) => car.issues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Document, (document) => document.issues, { nullable: true })
  @JoinColumn({ name: 'documentId' })
  document: Document;
}
