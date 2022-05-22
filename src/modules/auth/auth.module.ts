import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import jwtVerify from '../../middleware/auth/auth.jwt.politic';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { user, UserSchema } from '../../mongo.models/user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: UserSchema }]),
  ],
})
export default class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(jwtVerify)
      .exclude('signin', 'signup')
      .forRoutes(AuthService);
  }
}
