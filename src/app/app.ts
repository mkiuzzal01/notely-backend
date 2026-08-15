import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './router';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './utils/NotFound';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({ origin: ['localhost:3000'] }));
app.use(cookieParser());
app.use(express.text());

// Home route:
app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Welcome to the Notely API',
        version: '1.0.0',
        date: new Date().toDateString(),
        author: 'MKI_UZZAL',
    });
});

// All application routes:
app.use('/api/v1/', router);

// This is just test:
app.get('/test', (req: Request, res: Response) => {
    Promise.reject();
    res.send(req);
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;