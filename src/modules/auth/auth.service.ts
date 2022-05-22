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
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async signUp({ body, res }) {
    const { login, password } = body;
    if (!login || login.length < 3 || login.length > 15) {
      return res.status(400).send({ error: 'invalid login' });
    }

    if (!password || password.length < 6 || password.length > 20) {
      return res.status(400).send({ error: 'invalid password' });
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      const user = await this.userModel.create({
        login,
        password: hash,
        cardCount: 0,
        balance: 0,
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
    const userData = await this.userModel.findOne({ login });
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
    const userData = await this.userModel.findById(user._id);
    res.send(userData);
  }
}
