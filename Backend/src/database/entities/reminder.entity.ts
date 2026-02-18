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

export enum ReminderType {
  TIME_BASED = 'time_based', // Based on date (e.g., annual inspection)
  ODOMETER_BASED = 'odometer_based', // Based on mileage (e.g., oil change every 10k km)
  CUSTOM = 'custom',
}

export enum ReminderStatus {
  PENDING = 'pending',
  DUE_SOON = 'due_soon', // Within alert threshold
  OVERDUE = 'overdue',
  COMPLETED = 'completed',
}

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  carId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'text',
    enum: ReminderType,
  })
  type: ReminderType;

  @Column({
    type: 'text',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING,
  })
  status: ReminderStatus;

  // Time-based fields
  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'integer', nullable: true })
  intervalDays: number; // Repeat every X days

  // Odometer-based fields
  @Column({ type: 'integer', nullable: true })
  dueOdometerKm: number;

  @Column({ type: 'integer', nullable: true })
  intervalKm: number; // Repeat every X km

  // Alert threshold
  @Column({ type: 'integer', default: 500 })
  alertThresholdKm: number; // Alert when within X km of due

  @Column({ type: 'integer', default: 7 })
  alertThresholdDays: number; // Alert when within X days of due

  @Column({ type: 'date', nullable: true })
  lastCompletedDate: Date;

  @Column({ type: 'integer', nullable: true })
  lastCompletedOdometerKm: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Car, (car) => car.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car: Car;
}
