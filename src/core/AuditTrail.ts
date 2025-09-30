import { AuditEvent } from "./Event";
import { IAuditAdapter } from "./Adapters";

interface AuditTrailOptions {
  sensitiveFields?: string[];
}

export class AuditTrail {
  private static adapters: IAuditAdapter[] = [];
  private static options: AuditTrailOptions = {
    sensitiveFields: ["password", "token", "secret"], // default
  };

  static init(adapters: IAuditAdapter[], options: AuditTrailOptions = {}) {
    this.adapters = adapters;
    this.options = { ...this.options, ...options };
  }

  static getSensitiveFields(): string[] {
    return this.options.sensitiveFields || [];
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
