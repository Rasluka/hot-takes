import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

export const generateCode = async (): Promise<{
  newCode: string;
  hashedCode: string;
}> => {
  const newCode = nanoid(8).toUpperCase();
  const saltRounds = 10;
  const hashedCode = await bcrypt.hash(newCode, saltRounds);

  return { newCode, hashedCode };
};
