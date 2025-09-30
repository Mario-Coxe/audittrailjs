export function sanitizePayload(payload: any, sensitiveFields: string[] = ["password", "token", "secret"]) {
  if (!payload || typeof payload !== "object") return payload;

  
  const clone: any = Array.isArray(payload) ? [...payload] : { ...payload };

  for (const field of sensitiveFields) {
    if (field in clone) {
      clone[field] = "***";
    }
  }

  for (const key in clone) {
    if (typeof clone[key] === "object" && clone[key] !== null) {
      clone[key] = sanitizePayload(clone[key], sensitiveFields);
    }
  }

  return clone;
}
