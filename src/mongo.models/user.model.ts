import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true })
  cardCount: number;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Game' }])
  gameState: [Types.ObjectId];
}

export const UserSchema = SchemaFactory.createForClass(User);
