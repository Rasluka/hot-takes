import { Pool, QueryResult } from 'pg';

export class RoleService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async getAll(): Promise<QueryResult> {
    const results = await this.pool.query('SELECT * FROM roles;');

    return results;
  }

  async getById(id: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'SELECT * FROM roles WHERE id = $1;',
      [id],
    );

    return results;
  }

  async create(roleName: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'INSERT INTO roles (name) VALUES ($1) RETURNING id, name;',
      [roleName],
    );

    return results;
  }

  async updateById(roleId: string, roleName: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'UPDATE roles SET name = ($2) WHERE id = $1 RETURNING id, name;',
      [roleId, roleName],
    );

    return results;
  }

  async deleteById(id: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'DELETE FROM roles WHERE id = $1 RETURNING id, name;',
      [id],
    );

    return results;
  }
}
