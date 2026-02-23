import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { join } from 'path';
import {
  User,
  Car,
  Expense,
  MaintenanceEvent,
  Issue,
  Document,
  DriveFolders,
  Job,
  Reminder,
  AgentRun,
  ToolCall,
  Source,
  Settings,
} from '../database/entities';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: process.env.DB_PATH || join(__dirname, '../../data/car-ops.db'),
  entities: [
    User,
    Car,
    Expense,
    MaintenanceEvent,
    Issue,
    Document,
    DriveFolders,
    Job,
    Reminder,
    AgentRun,
    ToolCall,
    Source,
    Settings,
  ],
  migrations: [join(__dirname, '../database/migrations/**/*{.ts,.js}')],
  synchronize: true, // Auto-create tables in development
  logging: false,
};

// DataSource for TypeORM CLI (migrations)
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH || join(__dirname, '../../data/car-ops.db'),
  entities: [join(__dirname, '../database/entities/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/**/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
