import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

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
