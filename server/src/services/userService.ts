import { Pool, QueryResult } from 'pg';
import { IUser } from '../models/interfaces';

export class UserService {
  private dbPool: Pool;

  constructor(pool: Pool) {
    this.dbPool = pool;
  }

  async getAll(): Promise<QueryResult<IUser>> {
    const results = await this.dbPool.query(`
      SELECT u.id, u.nickname, u.email,
      json_build_object('id', r.id, 'name', r.name) AS role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      ORDER BY u.id;
  `);

    return results;
  }

  async getById(userId: string): Promise<QueryResult<IUser>> {
    const results = await this.dbPool.query(
      `
      SELECT u.id, u.nickname, u.email,
      json_build_object('id', r.id, 'name', r.name) AS role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1
      ORDER BY u.id;`,
      [userId],
    );

    return results;
  }

  async updateUserRole(
    userId: string,
    roleId: string,
  ): Promise<QueryResult<IUser>> {
    const results = this.dbPool.query(
      `
          UPDATE users
          SET role_id = $2
          WHERE id = $1
          RETURNING id, nickname, email, role_id;
      `,
      [userId, roleId],
    );

    return results;
  }

  async delete(userId: string): Promise<QueryResult> {
    const results = await this.dbPool.query(
      `
        DELETE FROM users
        WHERE id = $1
        RETURNING id, nickname, email, role_id;
      `,
      [userId],
    );

    return results;
  }
}
