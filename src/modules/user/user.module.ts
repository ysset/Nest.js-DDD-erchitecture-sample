import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import jwtVerify from '../../middleware/auth/auth.jwt.politic';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongoModule } from '../mongo/methods.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MongoModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(jwtVerify).forRoutes(UserController);
  }
}
