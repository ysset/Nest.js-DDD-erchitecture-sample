import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = user & Document;

@Schema()
export class user {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ requuired: true })
  balance: number;

  @Prop({ type: Array, required: true })
  gameState = [
    {
      card: Array,
      opened: Array,
      win: Boolean,
    },
  ];
}

export const UserSchema = SchemaFactory.createForClass(user);
