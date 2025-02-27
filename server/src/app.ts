import 'dotenv/config';
import express from 'express';
import authRouter from './routes/authRoutes';
import usersRouter from './routes/userRoutes';
import roleRouter from './routes/roleRoutes';

const app = express();
app.use(express.json());

// Mounting the routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/roles', roleRouter);

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
