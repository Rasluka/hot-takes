// import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  id: number;
  email: string;
  nickname: string;
  hashed_code: string;
  // Add other fields if necessary
}

interface SignUpResult {
  user: User;
  code: string;
}

interface SignInResult {
  user: User;
  token: string;
}

export class AuthService {
  private dbPool: Pool;
  private secretKey: string;

  constructor(dbPool: Pool, secretKey: string) {
    this.dbPool = dbPool;
    this.secretKey = secretKey;
  }

  async signUp(nickname: string, email: string): Promise<SignUpResult> {
    // Generating and Hashing the new code
    const newCode = nanoid(8).toUpperCase();
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(newCode, saltRounds);

    try {
      await this.dbPool.query('BEGIN');

      const results = await this.dbPool.query(
        'INSERT INTO users (email, nickname, hashed_code) VALUES ($1, $2, $3) RETURNING *;',
        [email, nickname, hashedCode],
      );

      // We get the id of the newly created user to later assign the 'taker' role.
      const user = results.rows[0];
      const newUserId = user.id;

      await this.dbPool.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
        [newUserId, 1],
      );

      await this.dbPool.query('COMMIT');

      return { user, code: newCode };
    } catch (err) {
      this.dbPool.query('ROLLBACK');
      throw err;
    }
  }

  async signIn(nickname: string, code: string): Promise<SignInResult> {
    const results = await this.dbPool.query(
      'SELECT * FROM users WHERE nickname = $1',
      [nickname],
    );

    if (results.rows.length === 0) {
      throw new Error('Invalid nickname or password.');
    }

    const user = results.rows[0];

    const isValidCode = bcrypt.compare(code, user.hashed_code);

    if (!isValidCode) {
      throw new Error('Invalid nickname or password.');
    }

    const token = jwt.sign({ userId: user.id }, this.secretKey, {
      expiresIn: '1h',
    });

    return { user, token };
  }
}
