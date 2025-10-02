import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/interfaces';
import { ConflictError } from '../errors/ConflictError';

interface SignUpResult {
  user: IUser;
  code: string;
}

interface SignInResult {
  user: IUser;
  token: string;
}

interface CodeRegenResult {
  user: IUser;
  newCode: string;
}

export class AuthService {
  private dbPool: Pool;
  private secretKey: string;

  constructor(dbPool: Pool, secretKey: string) {
    this.dbPool = dbPool;
    this.secretKey = secretKey;
  }

  private async generateCode(): Promise<{
    newCode: string;
    hashedCode: string;
  }> {
    // Generating and Hashing the new code
    const newCode = nanoid(8).toUpperCase();
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(newCode, saltRounds);

    return { newCode, hashedCode };
  }

  async signUp(
    nickname: string,
    email: string,
    roleId: number,
  ): Promise<SignUpResult> {
    const { newCode, hashedCode } = await this.generateCode();

    try {
      const results = await this.dbPool.query(
        'INSERT INTO users (email, nickname, hashed_code, role_id) VALUES ($1, $2, $3, $4) RETURNING *;',
        [email, nickname, hashedCode, roleId],
      );

      return { user: results.rows[0], code: newCode };
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictError('Nickname or email already in use.');
      }

      throw err;
    }
  }

  async signIn(nickname: string, code: string): Promise<SignInResult> {
    const results = await this.dbPool.query(
      `
      SELECT u.id, u.nickname, u.email, u.hashed_code,
      json_build_object('id', r.id, 'name', r.name) AS role
      FROM users u
      JOIN user_roles r ON r.id = u.role_id
      WHERE u.nickname = $1
      ORDER BY u.id;`,
      [nickname],
    );

    if (results.rows.length === 0) {
      throw new Error('Invalid credentials.');
    }

    const user = results.rows[0];

    const isValidCode = await bcrypt.compare(code, user.hashed_code);

    if (!isValidCode) {
      throw new Error('Invalid credentials.');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      this.secretKey,
      {
        expiresIn: '5h',
      },
    );

    delete user.hashed_code;

    return { user, token };
  }

  async regenerateCode(userId: string): Promise<CodeRegenResult> {
    const { newCode, hashedCode } = await this.generateCode();

    await this.dbPool.query(
      'UPDATE users SET hashed_code = $2 WHERE id = $1;',
      [userId, hashedCode],
    );

    const userResult = await this.dbPool.query(
      `
      SELECT u.id, u.nickname, u.email,
      json_build_object('id', r.id, 'name', r.name) AS role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1;
      `,
      [userId],
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found.');
    }

    const user: IUser = userResult.rows[0];
    return { user, newCode };
  }
}
