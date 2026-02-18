import { IsString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { DocumentType } from '@/database/entities';

export class CreateDocumentDto {
  @IsString()
  carId: string;

  @IsString()
  filename: string;

  @IsString()
  mimeType: string; // application/pdf, image/jpeg, image/png

  @IsInt()
  @Min(1)
  fileSize: number; // bytes

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsString()
  @IsOptional()
  driveFileId?: string; // Google Drive file ID (Phase 2)

  @IsString()
  @IsOptional()
  checksum?: string; // MD5 hash for duplicate detection
}
