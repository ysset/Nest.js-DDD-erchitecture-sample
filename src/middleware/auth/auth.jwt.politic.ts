import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import * as jsonwebtoken from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const jwt = req.headers.authorisation;
    jsonwebtoken.verify(jwt, jwtSecret, (err, decoded) => {
      if (err) return res.status(401).send({ error: err.message });
      req.body.user = decoded;
      next();
    });
  }
}
