import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import jwtVerify from '../../middleware/auth/auth.jwt.politic';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User, UserSchema } from '../../mongo.models/user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(jwtVerify)
      .exclude('auth/signin', 'auth/signup')
      .forRoutes(AuthController);
  }
}
