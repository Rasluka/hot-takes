import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middleware/error-handler.middleware';
import { createAuthRouter } from './routes/auth.route';
import { createUserRouter } from './routes/user.route';
import { createRoleRouter } from './routes/role.route';
import { createTakeRouter } from './routes/take.route';
import { createFavoriteTakeRouter } from './routes/favorite-take.route';
import prisma from './prisma';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000'];

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());

// Current API version
const API_VERSION = '/api/v1';

// Mounting the routes
app.use(`${API_VERSION}/auth`, createAuthRouter(prisma));
app.use(`${API_VERSION}/users`, createUserRouter(prisma));
app.use(`${API_VERSION}/roles`, createRoleRouter(prisma));
app.use(`${API_VERSION}/takes`, createTakeRouter(prisma));
app.use(`${API_VERSION}/favorites/takes`, createFavoriteTakeRouter(prisma));

app.get(`${API_VERSION}/live`, (_, res) => {
  res.json({
    message: 'Welcome to the Hot Takes API!',
  });
});

app.use(errorHandler);

export default app;
