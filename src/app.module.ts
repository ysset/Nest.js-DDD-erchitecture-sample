import { Module } from '@nestjs/common';
import AuthModule from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  exports: [AuthModule],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    AuthModule,
  ],
})
export class AppModule {}
