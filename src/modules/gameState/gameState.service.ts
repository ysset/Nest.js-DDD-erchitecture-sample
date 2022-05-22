import { Injectable } from '@nestjs/common';
import { user, UserDocument } from '../../mongo.models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GameStateService {
  constructor(
    @InjectModel(user.name) private readonly model: Model<UserDocument>,
  ) {}
  async state({ req, res }) {
    const { user } = req.body;
    if (!user._id) {
      return res.status(500).send({ error: 'User id is undefined' });
    }
    const userData = await this.model.findById(user._id);
    res.send(JSON.stringify(userData.gameState));
  }
}
