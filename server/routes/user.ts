import express from 'express';
import { getUser, deleteUser, changeUser, getPostsByUser} from '../db/db'
const user = express.Router();


user.get('/posts', async (req: any, res: any) => {
    const posts = await getPostsByUser(req.userId);
    if (posts) {
        res.json(posts);
    } else {
        res.json({ error: 'Нет статей' })
    }
})
user.get('/:id', async (req: any, res: any) => {
    const result = await getUser(req.params.id);
    if (result) {
        res.json(result);
    } else {
        res.status(401).json({ error: 'Пользователя с таким ID нет' })
    }
})
user.put('/:id', async (req: any, res: any) => {
    if (req.userId == req.params.id) {
        const result = await changeUser(req.params.id, req.body);
        if (result) {
            const user = await getUser(req.params.id)
            res.json(user);
        } else {
            res.status(401).json({ error: 'Ошибка' })
        }
    } else {
        res.status(401).json({ error: 'Отказано в доступе' })
    }
})
user.delete('/:id', async (req: any, res: any) => {
    if (req.userId == req.params.id) {
        const result = await deleteUser(req.params.id);
        res.json(result);
    } else {
        res.status(401).json({ error: 'Отказано в доступе' })
    }
})
export { user }