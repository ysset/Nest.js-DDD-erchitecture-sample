import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import jwtVerify from '../../middleware/auth/auth.jwt.politic';

import { User, UserSchema } from '../../mongo.models/user.model';
import { MongooseModule } from '@nestjs/mongoose';

import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class GameModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(jwtVerify).forRoutes(GameController);
  }
}
