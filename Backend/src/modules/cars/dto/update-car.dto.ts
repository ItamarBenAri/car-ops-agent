import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdateCarDto {
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  engine?: string;

  @IsString()
  @IsOptional()
  transmission?: string;

  @IsString()
  @IsOptional()
  nickname?: string;
}

export class UpdateOdometerDto {
  @IsInt()
  @Min(0)
  currentOdometerKm: number;
}
