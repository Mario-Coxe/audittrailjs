import { IAuditAdapter } from "../core/Adapters";
import { AuditEvent } from "../core/Event";
import { MongoClient, Collection } from "mongodb";

export class MongoAdapter implements IAuditAdapter {
  private client: MongoClient;
  private collection!: Collection<AuditEvent>;

  constructor(
    private uri: string,
    private dbName: string,
    private collectionName = "audit_logs"
  ) {
    this.client = new MongoClient(this.uri);
  }

  async save(event: AuditEvent): Promise<void> {
    if (!this.collection) {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      this.collection = db.collection<AuditEvent>(this.collectionName);
    }
    await this.collection.insertOne(event);
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
