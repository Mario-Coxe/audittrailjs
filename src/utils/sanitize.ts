import { AuditTrail } from "../core/AuditTrail";

export function sanitizePayload(payload: any): any {
  if (!payload || typeof payload !== "object") return payload;

  const sensitiveFields = AuditTrail.getSensitiveFields();

  const clone: any = Array.isArray(payload) ? [...payload] : { ...payload };

  for (const field of sensitiveFields) {
    if (field in clone) {
      clone[field] = "***";
    }
  }

  for (const key in clone) {
    if (typeof clone[key] === "object" && clone[key] !== null) {
      clone[key] = sanitizePayload(clone[key]);
    }
  }

  return clone;
}
