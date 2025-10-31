import prisma from '../../prisma';

export const seedStaticData = async (): Promise<void> => {
  await prisma.userRole.createMany({
    data: [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'User' },
    ],
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        nickname: 'john_doe',
        hashedCode: 'hashed_password',
        email: 'john@example.com',
        roleId: 2,
      },
      {
        id: 2,
        nickname: 'admin',
        hashedCode: 'hashed_password',
        email: 'admin@example.com',
        roleId: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.take.createMany({
    data: [
      { id: 1, content: 'Coffee is better cold.', createdBy: 1 },
      { id: 2, content: 'Tabs > Spaces.', createdBy: 2 },
    ],
    skipDuplicates: true,
  });
};

export const seedFavoriteTakes = async (): Promise<void> => {
  await prisma.favoriteTake.create({
    data: { id: 1, userId: 1, takeId: 1 },
  });
};

export const clearFavoriteTakes = async (): Promise<void> => {
  await prisma.favoriteTake.deleteMany();
};

export const clearTestDb = async (): Promise<void> => {
  await prisma.$transaction([
    prisma.favoriteTake.deleteMany(),
    prisma.take.deleteMany(),
    prisma.user.deleteMany(),
    prisma.userRole.deleteMany(),
  ]);
  await resetSequences();
};

export const resetSequences = async (): Promise<void> => {
  const sequences = await prisma.$queryRaw<
    { sequence_name: string }[]
  >`SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema='public';`;

  for (const seq of sequences) {
    await prisma.$executeRawUnsafe(
      `ALTER SEQUENCE "${seq.sequence_name}" RESTART WITH 1`,
    );
  }
};
