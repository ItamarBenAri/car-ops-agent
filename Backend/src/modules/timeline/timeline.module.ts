import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { Expense, MaintenanceEvent, Issue } from '@/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, MaintenanceEvent, Issue])],
  controllers: [TimelineController],
  providers: [TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}
