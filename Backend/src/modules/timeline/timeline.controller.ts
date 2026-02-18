import { Controller, Get, Query, Request } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { QueryTimelineDto } from './dto/query-timeline.dto';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  getTimeline(@Query() query: QueryTimelineDto, @Request() req) {
    const userId = req.headers['x-user-id'] || 'default-owner-id';
    return this.timelineService.getTimeline(query, userId);
  }
}
