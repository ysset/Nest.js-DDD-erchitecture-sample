import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { GameStateModule } from './modules/gameState/gameState.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  exports: [AuthModule, GameStateModule],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    AuthModule,
    GameStateModule,
  ],
})
export class AppModule {}
