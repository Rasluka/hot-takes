import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middleware/error-handler.middleware';
import { createAuthRouter } from './routes/auth.route';
import { createUserRouter } from './routes/user.route';
import { createRoleRouter } from './routes/role.route';
import { createTakeRouter } from './routes/take.route';
import prisma from './prisma';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_APP_URL_HOST,
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

app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to the Hot Takes API!',
  });
});

app.use(errorHandler);

export default app;
