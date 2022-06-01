import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import jwtVerify from '../../middleware/auth/auth.jwt.politic';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { MongoModule } from '../mongo/methods.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [MongoModule],
})
export class GameModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(jwtVerify).forRoutes(GameController);
  }
}
