import { Pool, QueryResult } from 'pg';

export class RoleService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createRole(roleName: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'INSERT INTO roles (name) VALUES ($1)',
      [roleName],
    );

    return results;
  }

  async getAllRoles(): Promise<QueryResult> {
    const results = await this.pool.query('SELECT * FROM roles;');

    return results;
  }

  async updateRole(roleId: string, roleName: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'UPDATE roles SET name = ($2) WHERE id = $1',
      [roleId, roleName],
    );

    return results;
  }

  async getRoleById(id: string): Promise<QueryResult> {
    const results = await this.pool.query(
      'SELECT * FROM roles WHERE id = $1;',
      [id],
    );

    return results;
  }

  async deleteRole(id: string): Promise<QueryResult> {
    const results = await this.pool.query('DELETE FROM roles WHERE id = $1;', [
      id,
    ]);

    return results;
  }
}
