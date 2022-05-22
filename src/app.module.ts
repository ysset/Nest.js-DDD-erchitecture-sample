import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/game/game.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  exports: [AuthModule, GameModule],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    AuthModule,
    GameModule,
  ],
})
export class AppModule {}
