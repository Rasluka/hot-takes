import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middleware/error-handler';
import authRouter from './routes/auth-routes';
import usersRouter from './routes/user-routes';
import roleRouter from './routes/role-routes';
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
app.use(`${API_VERSION}/auth`, authRouter);
app.use(`${API_VERSION}/users`, usersRouter);
app.use(`${API_VERSION}/roles`, roleRouter);

app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to the Hot Takes API!',
  });
});

app.use(errorHandler);

const PORT = process.env.SERVER_PORT;

async function startServer() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log('Connected to the DB!!');
    });
  } catch (error) {
    console.error('Database connection failed!', error);
    process.exit(1);
  }
}

startServer();
