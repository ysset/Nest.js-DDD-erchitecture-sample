import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({ type: Object })
  card = {
    fields: [[], [], []],
    taskNumber: Number,
  };

  @Prop({ default: false })
  complete: boolean;

  @Prop()
  opened: [[], [], []];

  @Prop()
  win: boolean;
}

export const GameSchema = SchemaFactory.createForClass(Game);
