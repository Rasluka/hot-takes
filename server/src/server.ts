import app from './app';
import prisma from './prisma';

const PORT = process.env.SERVER_PORT || 5000;

async function startServer(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const server = app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log('Connected to the DB!!');
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM received: closing server...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Server closed. DB disconnected.');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Database connection failed!', error);
    process.exit(1);
  }
}

startServer();
