import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../mongo.models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async balance({ req, res }) {
    const { user } = req.body;
    if (!user._id) {
      return res.status(500).send({ error: 'User id is undefined' });
    }
    const userData = await this.userModel
      .findById(user._id)
      .populate('gameState');
    console.log(userData);
    return res.send(JSON.stringify({ userBalance: userData.balance }));
  }
}
