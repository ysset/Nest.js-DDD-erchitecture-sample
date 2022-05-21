import { User } from "../interface/user.interface";
import { Schema, model } from 'mongoose';

const userSchema = new Schema<User>({
    username: { type: "string", required: true },
    email: { type: "string", required: true },
    password: { type: "string", required: true },
    balance: { type: "number", required: true },
    gameState: [{
        card: { type: "array", required: false },
        opened: { type: "array", required: false },
        win: { type: "boolean", required: false },
    }],
});

export default model('user', userSchema);