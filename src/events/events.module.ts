import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [StatsModule],
  controllers: [EventsController],
})
export class EventsModule {}
