import { Pool, QueryResult } from 'pg';

export class UserService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getAllUser(): Promise<QueryResult> {
    const results = await this.pool.query(`
      SELECT u.id, u.nickname, r.name as role FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON r.id = ur.role_id;
  `);

    return results;
  }

  async getUserById(userId: string): Promise<QueryResult> {
    const results = await this.pool.query(
      `
      SELECT u.id, u.nickname, r.name as role FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1`,
      [userId],
    );

    return results;
  }

  async deleteUser(userId: string): Promise<QueryResult> {
    const results = await this.pool.query(
      `
        DELETE FROM users
        WHERE id = $1
      `,
      [userId],
    );

    return results;
  }
}
