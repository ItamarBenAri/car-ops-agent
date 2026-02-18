import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Car } from './car.entity';

@Entity('drive_folders')
export class DriveFolders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  carId: string;

  @Column({ nullable: true })
  rootFolderId: string; // Main car folder ID

  @Column({ nullable: true })
  receiptsFolderId: string; // Receipts subfolder ID

  @Column({ nullable: true })
  issuesFolderId: string; // Issues subfolder ID

  @Column({ default: false })
  isSetup: boolean; // Whether folder structure is created

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Car, (car) => car.driveFolders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car: Car;
}
