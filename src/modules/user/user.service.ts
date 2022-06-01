import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../mongo.models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface responseData {
  code: number;
  data: object;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async balance({ user }): Promise<responseData> {
    if (!user._id) {
      return {
        code: 400,
        data: { message: 'User id is undefined' },
      };
    }
    const userData = await this.userModel
      .findById(user._id)
      .populate('gameState');
    return {
      data: { userBalance: userData.balance },
      code: 200,
    };
  }
}
