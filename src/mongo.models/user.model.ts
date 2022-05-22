import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ requuired: true })
  balance: number;

  @Prop({ required: true })
  cardCount: number;

  @Prop({ type: Array, ref: 'Game' })
  gameState: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
