import { IAuditAdapter } from "../core/Adapters";
import { AuditEvent } from "../core/Event";
import { createPool, Pool } from "mysql2/promise";

export class MySQLAdapter implements IAuditAdapter {
  private pool: Pool;
  private table: string;

  constructor(
    host: string,
    user: string,
    password: string,
    database: string,
    table = "audit_trail"
  ) {
    this.pool = createPool({
      host,
      user,
      password,
      database,
      connectionLimit: 10,
    });
    this.table = table;

    this.ensureTableExists();
  }

  private async ensureTableExists(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.table} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        userId VARCHAR(100) NULL,
        ip VARCHAR(45) NULL,
        action VARCHAR(255) NOT NULL,
        payload JSON NULL,
        createdAt DATETIME NOT NULL,
        INDEX idx_type (type),
        INDEX idx_user (userId),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await this.pool.query(query);
  }

  async save(event: AuditEvent): Promise<void> {
    const query = `
      INSERT INTO ${this.table} 
      (type, userId, ip, action, payload, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await this.pool.execute(query, [
      event.type,
      event.userId || null,
      event.ip || null,
      event.action,
      event.payload ? JSON.stringify(event.payload) : null,
      event.createdAt,
    ]);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
