import { Controller, Get, Param, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Get()
  findByDocument(@Query('documentId') documentId: string) {
    return this.jobsService.findByDocumentId(documentId);
  }
}