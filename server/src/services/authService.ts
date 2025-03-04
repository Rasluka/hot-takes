import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/interfaces';

interface SignUpResult {
  user: IUser;
  code: string;
}

interface SignInResult {
  user: IUser;
  token: string;
}

export class AuthService {
  private dbPool: Pool;
  private secretKey: string;

  constructor(dbPool: Pool, secretKey: string) {
    this.dbPool = dbPool;
    this.secretKey = secretKey;
  }

  async signUp(
    nickname: string,
    email: string,
    roleId: number,
  ): Promise<SignUpResult> {
    // Generating and Hashing the new code
    const newCode = nanoid(8).toUpperCase();
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(newCode, saltRounds);

    const results = await this.dbPool.query(
      'INSERT INTO users (email, nickname, hashed_code, role_id) VALUES ($1, $2, $3, $4) RETURNING *;',
      [email, nickname, hashedCode, roleId],
    );

    return { user: results.rows[0], code: newCode };
  }

  async signIn(nickname: string, code: string): Promise<SignInResult> {
    const results = await this.dbPool.query(
      'SELECT * FROM users WHERE nickname = $1',
      [nickname],
    );

    if (results.rows.length === 0) {
      throw new Error('Invalid credentials.');
    }

    const user = results.rows[0];

    const isValidCode = await bcrypt.compare(code, user.hashed_code);

    if (!isValidCode) {
      throw new Error('Invalid nickname or password.');
    }

    const token = jwt.sign({ userId: user.id }, this.secretKey, {
      expiresIn: '1h',
    });

    return { user, token };
  }
}
