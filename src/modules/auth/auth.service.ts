import {Injectable} from '@nestjs/common';
import jsonwebtoken from 'jsonwebtoken';
import {mongoModels} from "../../mongo.models";
import bcrypt from 'bcrypt';

const saltRounds = process.env.salt;
const jwtSecret = process.env.JWT_SECRET;

@Injectable()
export class AuthService {
    signUp({body: {username, email, password}, res}) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                res.status(400).send(err)
            }
            const user = new mongoModels.User({
                username,
                password: hash,
                email,
                balance: 0,
                gameState: 0
            })
            jsonwebtoken.sign(user, jwtSecret, (err, token) => {
                if (err)
                    res.status(400).send(err);
                res.send({token});
            })
        });
    }

    signIn({body: {username, email, password}}): String {
        return ''
    }

    signOut({headers: Authorisation}): Object {
        return {}
    }
}