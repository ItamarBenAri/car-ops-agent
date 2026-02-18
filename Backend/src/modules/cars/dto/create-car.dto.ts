import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateCarDto {
  @IsString()
  manufacturer: string; // יצרן (e.g., "מאזדה", "טויוטה")

  @IsString()
  model: string; // דגם (e.g., "3", "קורולה")

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsString()
  @IsOptional()
  engine?: string; // e.g., "2.0L", "1.6L"

  @IsString()
  @IsOptional()
  transmission?: string; // e.g., "אוטומט", "ידני"

  @IsString()
  @IsOptional()
  nickname?: string; // e.g., "הרכב של דנה", "המאזדה שלי"

  @IsInt()
  @Min(0)
  @IsOptional()
  currentOdometerKm?: number; // Initial odometer reading
}
