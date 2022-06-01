import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../mongo.models/user.model';
import { UserModelMethods, GameModelMethods } from './methods.service';
import { Game, GameSchema } from '../../mongo.models/gameState.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [UserModelMethods, GameModelMethods],
  exports: [UserModelMethods, GameModelMethods],
})
export class MongoModule {}
