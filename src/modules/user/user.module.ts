import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import jwtVerify from '../../middleware/auth/auth.jwt.politic';

import { User, UserSchema } from '../../mongo.models/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(jwtVerify).forRoutes(UserController);
  }
}
