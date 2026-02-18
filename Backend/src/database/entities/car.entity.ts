import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Expense } from './expense.entity';
import { MaintenanceEvent } from './maintenance-event.entity';
import { Issue } from './issue.entity';
import { Document } from './document.entity';
import { Reminder } from './reminder.entity';
import { DriveFolders } from './drive-folders.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @Column()
  manufacturer: string; // יצרן

  @Column()
  model: string; // דגם

  @Column({ type: 'integer' })
  year: number;

  @Column({ nullable: true })
  engine: string;

  @Column({ nullable: true })
  transmission: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ type: 'integer', default: 0 })
  currentOdometerKm: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.cars)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToOne(() => DriveFolders, (folders) => folders.car, { cascade: true })
  driveFolders: DriveFolders;

  @OneToMany(() => Expense, (expense) => expense.car)
  expenses: Expense[];

  @OneToMany(() => MaintenanceEvent, (event) => event.car)
  maintenanceEvents: MaintenanceEvent[];

  @OneToMany(() => Issue, (issue) => issue.car)
  issues: Issue[];

  @OneToMany(() => Document, (document) => document.car)
  documents: Document[];

  @OneToMany(() => Reminder, (reminder) => reminder.car)
  reminders: Reminder[];
}
