import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../mongo.models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const saltRounds = parseFloat(process.env.SALT);
const jwtSecret = process.env.JWT_SECRET;

interface promiseResponse {
  data: object;
  code: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * @param login
   * @param password
   */

  async signUp({ login, password }) {
    if (!login || login.length < 3 || login.length > 15) {
      return {
        data: { message: 'invalid login' },
        code: 400,
      };
    }

    if (!password || password.length < 6 || password.length > 20) {
      return {
        data: { message: 'invalid password' },
        code: 400,
      };
    }

    return await new Promise<promiseResponse>((resolve) => {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          resolve({
            data: { message: err.message },
            code: 400,
          });
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
            resolve({
              data: { message: err.message },
              code: 400,
            });
          }
          resolve({
            data: { token },
            code: 200,
          });
        });
      });
    });
  }

  async signIn({ login, password }) {
    const userData = await this.userModel.findOne({ login });

    if (!userData) {
      return {
        data: { message: 'User not found' },
        code: 400,
      };
    }

    return await new Promise<promiseResponse>((resolve) => {
      bcrypt.compare(password, userData.password, function (err, result) {
        if (err) {
          resolve({
            data: { message: err.message },
            code: 400,
          });
        }
        if (result) {
          jsonwebtoken.sign(
            JSON.stringify(userData),
            jwtSecret,
            (err, token) => {
              if (err) {
                return resolve({
                  data: { message: err.message },
                  code: 400,
                });
              }
              resolve({
                data: { token },
                code: 400,
              });
            },
          );
        }
      });
    });
  }

  async checkLogin({ user }) {
    const userData = await this.userModel.findById(user._id);
    return {
      code: 200,
      data: userData,
    };
  }
}
