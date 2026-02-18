import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car, Expense, Issue, DriveFolders } from '@/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Expense, Issue, DriveFolders])],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
