import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../mongo.models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const saltRounds = parseFloat(process.env.SALT);
const jwtSecret = process.env.JWT_SECRET;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}
  async signUp({ body, res }) {
    const { login, password } = body;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      const user = await this.model.create({
        login,
        password: hash,
        balance: 0,
        gameState: [],
      });

      const jwtData = {
        login,
        _id: user._id,
      };

      jsonwebtoken.sign(JSON.stringify(jwtData), jwtSecret, (err, token) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        res.send({ token });
      });
    });
  }

  async signIn({ body, res }) {
    const { login, password } = body;
    const userData = await this.model.findOne({ login });
    if (!userData) {
      return res.status(400).send({
        message: 'User not found',
      });
    }

    bcrypt.compare(password, userData.password, function (err, result) {
      if (err) {
        return res.status(400).send(err.message);
      }
      if (result) {
        jsonwebtoken.sign(JSON.stringify(userData), jwtSecret, (err, token) => {
          if (err) return res.status(400).send(err.message);
          res.send({ token });
        });
      }
    });
  }

  async checkLogin({ req, res }) {
    const { user } = req.body;
    const userData = await this.model.findById(user._id);
    res.send(userData);
  }
}
