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

@Entity('maintenance_events')
export class MaintenanceEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  carId: string;

  @Column({ nullable: true })
  documentId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  title: string;

  @Column()
  category: string; // שמן, בלמים, צמיגים, סינון אוויר, etc.

  @Column({ type: 'integer', nullable: true })
  odometerKm: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  vendor: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Car, (car) => car.maintenanceEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @ManyToOne(() => Document, (document) => document.maintenanceEvents, {
    nullable: true,
  })
  @JoinColumn({ name: 'documentId' })
  document: Document;
}
