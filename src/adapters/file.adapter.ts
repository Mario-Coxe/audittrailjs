import fs from "fs";
import { AuditEvent } from "../core/Event";
import { IAuditAdapter } from "../core/Adapters";

export class FileAdapter implements IAuditAdapter {
  private filePath: string;

  constructor(options: { path: string }) {
    this.filePath = options.path;
  }

  async save(event: AuditEvent): Promise<void> {
    const line = JSON.stringify(event) + "\n";
    await fs.promises.appendFile(this.filePath, line, "utf-8");
  }
}
