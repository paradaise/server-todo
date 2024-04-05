import express from 'express';
import { getAllPosts, getPost, addPost, changePost, deletePost } from '../db/db'

const post = express.Router();

post.get('/', async (req: any, res: any) => {
    const posts = await getAllPosts();
    res.json(posts);
});

post.get('/:id', async (req: any, res: any) => {
    const post = await getPost(req.params.id)
    if (post) {
        res.json(post)
    } else {
        res.status(401).json({ error: 'Поста с таким ID нет' })
    }
});
post.post('/', async (req: any, res: any) => {
    const result = await addPost(req.userId, req.body.title)
    res.json(result);
});
post.put('/:id', async (req: any, res: any) => {
    const post = await getPost(req.params.id);
    console.log(req.userId);
    if (post) {
      console.log(post)
        if (req.userId == post.owner_id) {
            const result = await changePost(req.params.id, req.body)
            if (result) {
                const post = await getPost(req.params.id)
                res.json(post);
            } else {
                res.status(401).json({ error: 'Ошибка' })
            }
        } else {
            res.status(401).json({ error: 'Отказано в доступе' })
        }
    } else {
        res.status(401).json({ error: 'Поста с таким ID нет' })
    }

});
post.delete('/:id', async (req: any, res: any) => {
    const post = await getPost(req.params.id);
    if (post) {
        if (req.userId == post.owner_id) {
            const result = await deletePost(req.params.id)
            res.json(result);
        } else {
            res.status(401).json({ error: 'Отказано в доступе' })
        }
    } else {
        res.status(401).json({ error: 'Поста с таким ID нет' })
    }

});
export { post };