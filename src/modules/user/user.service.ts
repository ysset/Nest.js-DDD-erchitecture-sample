import { Injectable } from '@nestjs/common';
import { UserModelMethods } from '../mongo/methods.service';

interface responseData {
  code: number;
  data: object;
}

@Injectable()
export class UserService {
  constructor(
    // @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userModel: UserModelMethods,
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

    if (!userData) {
      return {
        code: 400,
        data: {
          message: 'User not found',
        },
      };
    }

    return {
      data: { userBalance: userData.balance },
      code: 200,
    };
  }
}
