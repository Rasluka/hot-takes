import prisma from '../../prisma';

export const seedRoles = async () => {
  await prisma.userRole.createMany({
    data: [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'User' },
    ],
    skipDuplicates: true,
  });
};

export const seedUsers = async () => {
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
};

export const seedTakes = async () => {
  await prisma.take.createMany({
    data: [
      { id: 1, content: 'Coffee is better cold.', createdBy: 1 },
      { id: 2, content: 'Tabs > Spaces.', createdBy: 2 },
    ],
    skipDuplicates: true,
  });
};

export const seedFavoriteTakes = async () => {
  await prisma.favoriteTake.create({
    data: { id: 1, userId: 1, takeId: 1 },
  });
};

export const clearTestDb = async () => {
  await prisma.favoriteTake.deleteMany();
  await prisma.take.deleteMany();
  await prisma.user.deleteMany();
  await prisma.userRole.deleteMany();
};
