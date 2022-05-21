import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import 'dotenv/config';
import * as jsonwebtoken from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const jwt = req.headers.Authorisation
        jsonwebtoken.verify(jwt, jwtSecret, (err, decoded) => {
            if (err)
                res.status(405).send(err);
            console.log(decoded)
            next();
        });
    }
}
