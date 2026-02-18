import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  findByCarId(@Query('carId') carId: string) {
    return this.remindersService.findByCarId(carId);
  }

  @Get('due-soon')
  findDueSoon(
    @Query('carId') carId: string,
    @Query('odometerKm') odometerKm?: string,
  ) {
    return this.remindersService.findDueSoon(
      carId,
      odometerKm ? parseInt(odometerKm) : undefined,
    );
  }

  @Patch(':id/complete')
  markCompleted(
    @Param('id') id: string,
    @Body('odometerKm') odometerKm?: number,
  ) {
    return this.remindersService.markCompleted(id, odometerKm);
  }
}
