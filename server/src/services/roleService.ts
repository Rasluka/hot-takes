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
}
