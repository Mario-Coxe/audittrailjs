import { IAuditAdapter } from "../core/Adapters";
import { AuditEvent } from "../core/Event";
import { createPool, Pool } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

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
        id CHAR(36) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        action VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL,
        userId VARCHAR(100) NULL,
        ip VARCHAR(45) NULL,
        endpoint VARCHAR(255) NULL,
        method VARCHAR(10) NULL,
        statusCode INT NULL,
        responseTime INT NULL,
        userAgent VARCHAR(255) NULL,
        description TEXT NULL,
        payload JSON NULL,
        metadata JSON NULL,
        INDEX idx_type (type),
        INDEX idx_user (userId),
        INDEX idx_createdAt (createdAt),
        INDEX idx_status (statusCode)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await this.pool.query(query);
  }

  async save(event: AuditEvent): Promise<void> {
    const query = `
      INSERT INTO ${this.table} 
      (id, type, action, createdAt, userId, ip, endpoint, method, statusCode, responseTime, userAgent, description, payload, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.pool.execute(query, [
      event.id ?? uuidv4(),
      event.type,
      event.action,
      event.createdAt,
      event.userId || null,
      event.ip || null,
      event.endpoint || null,
      event.method || null,
      event.statusCode || null,
      event.responseTime || null,
      event.userAgent || null,
      event.description || null,
      event.payload ? JSON.stringify(event.payload) : null,
      event.metadata ? JSON.stringify(event.metadata) : null,
    ]);
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
