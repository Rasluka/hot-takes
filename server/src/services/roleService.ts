import { Pool, QueryResult } from 'pg';

export class RoleService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getAll(): Promise<QueryResult> {
    const results = await this.pool.query('SELECT * FROM user_roles;');

    return results;
  }

  async getById(id: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'SELECT * FROM user_roles WHERE id = $1;',
      [id],
    );

    return results;
  }

  async create(roleName: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'INSERT INTO user_roles (name) VALUES ($1) RETURNING id, name;',
      [roleName],
    );

    return results;
  }

  async updateById(roleId: string, roleName: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'UPDATE user_roles SET name = ($2) WHERE id = $1 RETURNING id, name;',
      [roleId, roleName],
    );

    return results;
  }

  async deleteById(id: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'DELETE FROM user_roles WHERE id = $1 RETURNING id, name;',
      [id],
    );

    return results;
  }
}
