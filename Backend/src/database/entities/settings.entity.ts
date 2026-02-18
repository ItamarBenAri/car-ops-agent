import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ type: 'simple-json', nullable: true })
  toolPermissions: {
    webSearch: boolean;
    emailNotifications: boolean;
    autoReminders: boolean;
    dataExport: boolean;
  };

  @Column({ type: 'simple-json', nullable: true })
  safetyPolicies: {
    requireConfirmation: boolean;
    restrictWebSearch: boolean;
    enableAutoReminders: boolean;
  };

  @Column({ type: 'text', nullable: true })
  encryptedSecrets: string; // JSON with encrypted API keys

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
