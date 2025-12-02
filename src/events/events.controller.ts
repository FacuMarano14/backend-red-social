import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatsService } from '../stats/stats.service';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly statsService: StatsService) {}

  @Post('register')
  async registerEvent(@Request() req: any, @Body() body: any) {
    const userId = req.user?.userId;

    const { type, targetId, metadata } = body;

    await this.statsService.register(type, userId, targetId, metadata || {});

    return { success: true };
  }
}
