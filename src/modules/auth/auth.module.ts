import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import jwtVerify from '../../middleware/auth/auth.jwt.politic';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongoModule } from '../mongo/methods.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [MongoModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(jwtVerify)
      .exclude('api/signin', 'api/signup')
      .forRoutes(AuthController);
  }
}
