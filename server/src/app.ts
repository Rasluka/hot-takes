import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './routes/authRoutes';
import usersRouter from './routes/userRoutes';
import roleRouter from './routes/roleRoutes';
import dbPool from './db';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Mounting the routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/roles', roleRouter);

app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to the Hot Takes API!',
  });
});

app.use(errorHandler);

const PORT = process.env.SERVER_PORT;

async function startServer() {
  try {
    await dbPool.query('SELECT 1');

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
