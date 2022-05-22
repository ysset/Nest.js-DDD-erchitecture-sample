import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { user, UserDocument } from '../../mongo.models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const saltRounds = parseFloat(process.env.SALT);
const jwtSecret = process.env.JWT_SECRET;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(user.name) private readonly model: Model<UserDocument>,
  ) {}
  signUp({ body, res }) {
    const { username, email, password } = body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      const user = this.model.create({
        username,
        password: hash,
        email,
        balance: 0,
        gameState: [],
      });
      jsonwebtoken.sign(JSON.stringify(user), jwtSecret, (err, token) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        res.send({ token });
      });
    });
  }

  async signIn({ body, res }) {
    const { username, email, password } = body;
    const userData = await this.model.findOne({
      $or: [
        {
          email,
        },
        {
          username,
        },
      ],
    });
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
}
