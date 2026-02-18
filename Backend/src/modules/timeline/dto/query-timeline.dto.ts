import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export enum TimelineEventType {
  RECEIPT = 'receipt',
  ISSUE = 'issue',
  MAINTENANCE = 'maintenance',
}

export class QueryTimelineDto {
  @IsOptional()
  @IsString()
  carId?: string; // Filter by car ("all" for all cars)

  @IsOptional()
  @IsDateString()
  fromDate?: string; // ISO date format

  @IsOptional()
  @IsDateString()
  toDate?: string; // ISO date format

  @IsOptional()
  @IsString()
  category?: string; // שמן ומסננים, צמיגים, בלמים, etc.

  @IsOptional()
  @IsEnum(TimelineEventType)
  type?: TimelineEventType; // receipt, issue, maintenance
}
