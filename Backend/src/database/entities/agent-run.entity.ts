import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ToolCall } from './tool-call.entity';
import { Source } from './source.entity';

export enum AgentRunType {
  CHAT = 'chat',
  UPLOAD = 'upload',
  ANALYSIS = 'analysis',
}

export enum AgentRunStatus {
  RUNNING = 'running',
  DONE = 'done',
  FAILED = 'failed',
}

export enum AgentMode {
  QUICK = 'quick',
  INVESTIGATE = 'investigate',
  PLAN = 'plan',
}

@Entity('agent_runs')
export class AgentRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  correlationId: string; // UUID for distributed tracing

  @Column({
    type: 'text',
    enum: AgentRunType,
  })
  type: AgentRunType;

  @Column({
    type: 'text',
    enum: AgentMode,
    nullable: true,
  })
  mode: AgentMode;

  @Column({
    type: 'text',
    enum: AgentRunStatus,
    default: AgentRunStatus.RUNNING,
  })
  status: AgentRunStatus;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  carId: string;

  @Column({ type: 'text', nullable: true })
  userInput: string;

  @Column({ type: 'text', nullable: true })
  aiOutput: string;

  @Column({ type: 'simple-json', nullable: true })
  error: any;

  @Column({ type: 'integer', nullable: true })
  inputTokens: number;

  @Column({ type: 'integer', nullable: true })
  outputTokens: number;

  @Column({ type: 'integer', nullable: true })
  totalTokens: number;

  @Column({ type: 'datetime' })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => ToolCall, (toolCall) => toolCall.agentRun)
  toolCalls: ToolCall[];

  @OneToMany(() => Source, (source) => source.agentRun)
  sources: Source[];
}
