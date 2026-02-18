import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto, UpdateOdometerDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto, @Request() req) {
    // TODO: Phase 1.3 - Add JWT auth guard and extract userId from req.user
    const userId = req.headers['x-user-id'] || 'default-owner-id'; // Temporary hack
    return this.carsService.create(createCarDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.headers['x-user-id'] || 'default-owner-id';
    return this.carsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.headers['x-user-id'] || 'default-owner-id';
    return this.carsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @Request() req,
  ) {
    const userId = req.headers['x-user-id'] || 'default-owner-id';
    return this.carsService.update(id, updateCarDto, userId);
  }

  @Patch(':id/odometer')
  updateOdometer(
    @Param('id') id: string,
    @Body() updateOdometerDto: UpdateOdometerDto,
    @Request() req,
  ) {
    const userId = req.headers['x-user-id'] || 'default-owner-id';
    return this.carsService.updateOdometer(id, updateOdometerDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.headers['x-user-id'] || 'default-owner-id';
    return this.carsService.remove(id, userId);
  }
}
