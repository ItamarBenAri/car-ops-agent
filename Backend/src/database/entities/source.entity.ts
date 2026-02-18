import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AgentRun } from './agent-run.entity';

export enum SourceType {
  HISTORY = 'history', // From car maintenance history
  WEB = 'web', // From web search
  DOCUMENT = 'document', // From uploaded document
}

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentRunId: string;

  @Column({
    type: 'text',
    enum: SourceType,
  })
  type: SourceType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  snippet: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  confidence: number; // Confidence score (0.0 - 1.0)

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => AgentRun, (run) => run.sources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentRunId' })
  agentRun: AgentRun;
}
