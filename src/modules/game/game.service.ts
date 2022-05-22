import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../mongo.models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const countBalance = ({ price, balance }) => {
  if (price > balance) {
    return false;
  }

  return balance - price;
};

const createMatrix = ({ sort, taskNumber }) => {
  const arr = [];
  for (let strokeEl = 0; strokeEl < 3; strokeEl++) {
    arr[strokeEl] = [];
    for (let collEl = 0; collEl < 3; collEl++) {
      sort({ strokeEl, collEl })
        ? arr[strokeEl][collEl].push(taskNumber)
        : Math.round(Math.random());
    }
  }
  return arr;
};

@Injectable()
export class GameService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}
  async state({ req, res }) {
    const { user } = req.body;
    if (!user._id) {
      return res.status(500).send({ error: 'User id is undefined' });
    }
    const userData = await this.model.findById(user._id);
    res.send(JSON.stringify(userData.gameState));
  }

  async buy({ req, res }) {
    const { user, price } = req.body;
    const userData = await this.model.findById(user._id);

    const balance = countBalance({ price, balance: userData.balance });

    if (balance) {
      await this.model.updateOne(
        { _id: user._id },
        {
          balance,
          cardCount: userData.cardCount + 1,
        },
      );

      return res.send({ ok: true });
    }
  }

  async createCard({ req, res }) {
    const { user } = req.body;
    const userData = await this.model.findById(user._id);
    if (!userData.cardCount) {
      return res.status(400).send({ error: 'No more cards' });
    }
    const taskNumber = Math.round(Math.random() * 100);
    const typeMatrix = Math.round(Math.random() * 3);
    // 0 - diagonal
    // 1 - horizontal
    // 2 - vertical
    let matrix;
    switch (typeMatrix) {
      case 0:
        const type = Math.round(Math.random() * 2);
        matrix = createMatrix({
          sort: ({ strokeEl, collEl }) => strokeEl === collEl,
          taskNumber,
        });
        if (type) {
          for (let strokeEl = 0; strokeEl < 3; strokeEl++) {
            matrix[strokeEl].reverse();
          }
        }
        break;
      case 1:
        const stroke = Math.round(Math.random() * 3);
        matrix = createMatrix({
          sort: ({ strokeEl }) => strokeEl === stroke,
          taskNumber,
        });
        break;
      case 2:
        const coll = Math.round(Math.random() * 3);
        matrix = createMatrix({
          sort: ({ collEl }) => collEl === coll,
          taskNumber,
        });
        break;
    }
    return res.send(JSON.stringify(matrix));
  }
}