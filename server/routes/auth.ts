import express from 'express';
import { login, register, availableLogin } from '../db/db';
const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt')
const salt = bCrypt.genSaltSync(10);
const { secret } = require('../config/secret')

const auth = express.Router();

auth.post('/register', async (req: any, res: any) => {
    console.log(req);
    const type = 0;
    const available = await availableLogin(req.body.login);
    if (available) {
        const user = await register(req.body.login, bCrypt.hashSync(req.body.password, salt), req.body.name);
        const token = jwt.sign({ id: user.id.toString() }, secret)
        res.json({ token, userId: user.id.toString() })
    } else {
        res.status(401).json({ error: 'Логин занят' })
    }
})
auth.post('/login', async (req: any, res: any) => {
    console.log(req);
    const user = await login(req.body.login)
    console.log(user);
    if (!user) {
        res.status(401).json({ Error: "Пользователя с таким логином нет" })
    } else {
        const isVlid = bCrypt.compareSync(req.body.password, user.password);
        if (isVlid) {
            const token = jwt.sign({ id: user.id.toString() }, secret)
            res.json({ token, userId : user.id.toString() })
        } else {
            res.status(401).json({ error: "Не верный пароль" })
        }
    }
})
export { auth }