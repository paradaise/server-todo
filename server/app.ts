import express from 'express';
import bodyParser from 'body-parser';
import { user } from './routes/user';
import { auth } from './routes/auth';
import cors from 'cors';
import { authMiddleWare } from './middleware/auth';
import { post } from './routes/posts';


const PORT = 3000 || process.env.PORT;
const app = express();
app.use(
    cors({
      allowedHeaders: ["sessionId", "Content-Type", "token"],
      exposedHeaders: ["sessionId", "token"],
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      preflightContinue: true,
      optionsSuccessStatus: 204
    })
  );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', auth);
app.use('/api/user', authMiddleWare, user);
app.use('/api/post', authMiddleWare, post);
const start = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Сервер на ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
