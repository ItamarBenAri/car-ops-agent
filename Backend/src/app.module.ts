import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { typeOrmConfig } from './config/database.config';
import { CarsModule } from './modules/cars/cars.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { AuthModule } from './modules/auth/auth.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { RemindersModule } from './modules/reminders/reminders.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRoot(typeOrmConfig),

    // Redis / BullMQ
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),

    // Feature modules
    AuthModule,
    CarsModule,
    DocumentsModule,
    TimelineModule,
    JobsModule,
    RemindersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
