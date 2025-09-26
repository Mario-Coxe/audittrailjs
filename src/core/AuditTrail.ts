import { AuditEvent } from "./Event";
import { IAuditAdapter } from "./Adapters";

export class AuditTrail {
  private static adapters: IAuditAdapter[] = [];

  static init(adapters: IAuditAdapter[]) {
    this.adapters = adapters;
  }

  static async log(event: Omit<AuditEvent, "createdAt">) {
    const auditEvent: AuditEvent = {
      ...event,
      createdAt: new Date(),
    };

    for (const adapter of this.adapters) {
      await adapter.save(auditEvent);
    }
  }
}
