import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import jwtVerify from '../../middleware/auth/auth.jwt.politic';

import { user, UserSchema } from '../../mongo.models/user.model';
import { MongooseModule } from '@nestjs/mongoose';

import { GameStateService } from './gameState.service';
import { GameStateController } from './gameState.controller';

@Module({
  controllers: [GameStateController],
  providers: [GameStateService],
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: UserSchema }]),
  ],
})
export class GameStateModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(jwtVerify).forRoutes('game/state');
  }
}
