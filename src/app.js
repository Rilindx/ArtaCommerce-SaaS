import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();
const allowedOrigins = [env.clientUrl, 'http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Arta Ceramics API' });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
