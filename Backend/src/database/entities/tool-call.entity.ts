import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AgentRun } from './agent-run.entity';

export enum ToolCallStatus {
  PENDING = 'pending',
  DONE = 'done',
  FAILED = 'failed',
}

@Entity('tool_calls')
export class ToolCall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentRunId: string;

  @Column()
  toolName: string;

  @Column({ type: 'text' })
  input: string; // JSON stringified

  @Column({ type: 'text', nullable: true })
  output: string; // JSON stringified

  @Column({
    type: 'text',
    enum: ToolCallStatus,
    default: ToolCallStatus.PENDING,
  })
  status: ToolCallStatus;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'integer', default: 0 })
  durationMs: number;

  @CreateDateColumn()
  calledAt: Date;

  // Relations
  @ManyToOne(() => AgentRun, (run) => run.toolCalls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agentRunId' })
  agentRun: AgentRun;
}
