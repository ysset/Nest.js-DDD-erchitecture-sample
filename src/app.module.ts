import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

@Module({
  exports: [AuthModule, GameModule, UserModule],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    AuthModule,
    GameModule,
    UserModule,
  ],
})
export class AppModule {}
