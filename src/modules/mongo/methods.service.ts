import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../mongo.models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Game, GameDocument } from '../../mongo.models/gameState.model';

@Injectable()
export class UserModelMethods {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  findById(filter) {
    return this.userModel.findById(filter);
  }
  create(data) {
    return this.userModel.create(data);
  }
  findOne(filter) {
    return this.userModel.findOne(filter);
  }
  updateOne(filter, update) {
    return this.userModel.updateOne(filter, update);
  }
}

@Injectable()
export class GameModelMethods {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
  ) {}
  create(data) {
    return this.gameModel.create(data);
  }
  updateOne(filter, update) {
    return this.gameModel.updateOne(filter, update);
  }
}
