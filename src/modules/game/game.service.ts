import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../mongo.models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../../mongo.models/gameState.model';

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
        ? arr[strokeEl].push(taskNumber)
        : arr[strokeEl].push(Math.round(Math.random() * 10));
    }
  }
  return arr;
};

@Injectable()
export class GameService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
  ) {}

  private async getUser({ req, res }) {
    const { user } = req.body;
    if (!user._id) {
      return res.status(500).send({ error: 'User id is undefined' });
    }
    return this.userModel.findById(user._id).populate('gameState');
  }

  async state({ req, res }) {
    const userData = await this.getUser({ req, res });
    console.log(userData.gameState);
    const gameState = {
      game: userData.gameState,
      balance: userData.balance,
      cards: userData.cardCount,
    };

    res.send(JSON.stringify(gameState));
  }

  async buy({ req, res }) {
    const { user, price } = req.body;
    const userData = await this.getUser({ req, res });

    const balance = countBalance({ price, balance: userData.balance });

    if (balance) {
      await this.userModel.updateOne(
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
    const userData = await this.getUser({ req, res });
    let matrix;

    if (!userData.cardCount) {
      return res.status(400).send({ error: 'No more cards' });
    }

    const taskNumber = Math.round(Math.random() * 100);
    const typeMatrix = Math.round(Math.random() * 2);
    // 0 - diagonal
    // 1 - horizontal
    // 2 - vertical

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
        const stroke = Math.round(Math.random() * 2);
        matrix = createMatrix({
          sort: ({ strokeEl }) => strokeEl === stroke,
          taskNumber,
        });
        break;
      case 2:
        const coll = Math.round(Math.random() * 2);
        matrix = createMatrix({
          sort: ({ collEl }) => collEl === coll,
          taskNumber,
        });
        break;
    }

    const card = await this.gameModel.create({
      card: {
        fields: matrix,
        taskNumber,
      },
      opened: [],
      win: false,
    });

    await this.userModel.updateOne(
      { _id: userData._id },
      {
        cardCount: userData.cardCount - 1,
        $push: {
          gameState: card.id,
        },
      },
    );

    return res.send(JSON.stringify(matrix));
  }

  async cell({ req, res }) {
    const {
      id,
      cell: { str, coll },
    } = req.body;
    const userData = await this.getUser({ req, res });
    const cardData = userData.gameState;

    if (!cardData) {
      return res.status(400).send(JSON.stringify({ error: 'Card not fined' }));
    }

    const opened = cardData.opened;

    if (opened[str] && opened[str][coll]) {
      return res.status(400).send({ error: 'Cell has already opened' });
    }
    if (opened[str]) {
      opened[str][coll] = cardData.card.fields[str][coll];
      await this.gameModel.updateOne({ _id: id }, { opened });
      return res.send(opened);
    }
    opened[str] = [];
    opened[str][coll] = cardData.card.fields[str][coll];
    await this.gameModel.updateOne({ _id: id }, { opened });
    return res.send(opened);
  }
}
