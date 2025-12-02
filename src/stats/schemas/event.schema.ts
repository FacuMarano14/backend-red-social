import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  type: 'login' | 'profile_visit' | 'like';

  @Prop({ type: Object })
  metadata: any;

  @Prop({ required: true })
  userId: string;

  @Prop()
  targetId?: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
