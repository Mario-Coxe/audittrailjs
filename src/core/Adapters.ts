import { AuditEvent } from "./Event";

export interface IAuditAdapter {
  save(event: AuditEvent): Promise<void>;
}
