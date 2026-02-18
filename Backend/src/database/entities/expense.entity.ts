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

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  carId: string;

  @Column({ nullable: true })
  documentId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // ILS

  @Column()
  vendor: string;

  @Column()
  category: string; // שמן ומסננים, צמיגים, בלמים, תחזוקה שוטפת, תיקונים, אבחון, בדיקות

  @Column({ type: 'integer', nullable: true })
  odometerKm: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  confidence: number; // AI confidence score (0.0 - 1.0)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Car, (car) => car.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Document, (document) => document.expenses, {
    nullable: true,
  })
  @JoinColumn({ name: 'documentId' })
  document: Document;
}
