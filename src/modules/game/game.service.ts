import { Injectable } from '@nestjs/common';
import { UserInterface } from '../../interface/user.interface';
import { GameModelMethods, UserModelMethods } from '../mongo/methods.service';

const countBalance = ({ count, balance }) => {
  const price = 100;
  if (price > balance * count) {
    return false;
  }
  return balance - price * count;
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

interface responseData {
  data: object;
  code: number;
}

@Injectable()
export class GameService {
  constructor(
    private readonly userModel: UserModelMethods,
    private readonly gameModel: GameModelMethods,
  ) {}

  private async getUser({ user }): Promise<UserInterface> {
    if (!user._id) {
      throw {
        message: 'User id is undefined',
        code: 500,
      };
    }
    return this.userModel.findById(user._id).populate('gameState');
  }

  async state({ user }): Promise<responseData> {
    const userData = await this.getUser({ user });
    const gameState = {
      game: userData.gameState,
      balance: userData.balance,
      cards: userData.cardCount,
    };

    return {
      code: 200,
      data: { gameState },
    };
  }

  async buy({ user, count }): Promise<responseData> {
    const userData = await this.getUser({ user });

    const balance = countBalance({ count, balance: userData.balance });
    if (balance) {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          balance,
          cardCount: userData.cardCount + 1,
        },
      );
      return {
        code: 200,
        data: { ok: true },
      };
    }
    return {
      code: 400,
      data: { message: 'Balance over' },
    };
  }

  async cell({ id, cell: { str, coll }, user }) {
    const userData = await this.getUser({ user });
    const cardData = userData.gameState.find((el) => el._id.toString() === id);

    if (!cardData) {
      return {
        data: { message: 'Card not fined' },
        code: 400,
      };
    }

    const opened = cardData.opened;

    if (opened[str] && opened[str][coll]) {
      return {
        data: { message: 'Cell has already opened' },
        code: 400,
      };
    }
    if (opened[str]) {
      opened[str][coll] = cardData.card.fields[str][coll];
      await this.gameModel.updateOne({ _id: id }, { opened });
      return {
        data: { opened },
        code: 200,
      };
    }
    opened[str] = [];
    opened[str][coll] = cardData.card.fields[str][coll];
    await this.gameModel.updateOne({ _id: id }, { opened });
    return {
      data: { opened },
      code: 200,
    };
  }

  async createCard({ user }) {
    const userData = await this.getUser({ user });
    let matrix;

    if (!userData.cardCount) {
      return {
        code: 400,
        data: { error: 'No more cards' },
      };
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

    return {
      data: { matrix },
      code: 200,
    };
  }

  async completeGame({ id, user }) {
    let money = 0;
    const userData = await this.getUser({ user });
    const cardData = userData.gameState.find((el) => el._id.toString() === id);

    if (!cardData) {
      return {
        data: { message: 'Card not fined' },
        code: 400,
      };
    }

    if (cardData.complete) {
      return {
        data: { messaqe: 'Game has already complete ' },
        code: 400,
      };
    }

    cardData.opened.flat().forEach((el) => (money += el));

    await this.userModel.updateOne(
      { _id: user._id },
      { balance: (userData.balance += money) },
    );

    return {
      data: { ok: true },
      code: 200,
    };
  }
}
