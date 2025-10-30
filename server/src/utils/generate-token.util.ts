import jwt from 'jsonwebtoken';

export const generateJwtToken = (
  userId: number,
  role: 'Admin' | 'User',
): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRATION || '5h',
    } as jwt.SignOptions,
  );
};
