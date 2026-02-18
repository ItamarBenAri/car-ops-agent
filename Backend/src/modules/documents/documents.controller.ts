import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Headers,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentType } from '@/database/entities';

const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          const ext = path.extname(file.originalname);
          cb(null, `${unique}${ext}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`Unsupported file type: ${file.mimetype}`), false);
        }
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('carId') carId: string,
    @Body('type') type: string,
    @Headers('x-user-id') userId: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!carId) throw new BadRequestException('carId is required');

    const resolvedUserId = userId || 'default-owner-id';
    const docType =
      type === 'issue_photo' ? DocumentType.ISSUE_PHOTO : DocumentType.RECEIPT;

    return this.documentsService.uploadAndProcess(file, carId, docType, resolvedUserId);
  }

  @Post()
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.documentsService.create(createDocumentDto, userId || 'default-owner-id');
  }

  @Get()
  findByCarId(
    @Query('carId') carId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.documentsService.findByCarId(carId, userId || 'default-owner-id');
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.documentsService.findOne(id, userId || 'default-owner-id');
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.documentsService.remove(id, userId || 'default-owner-id');
  }
}
