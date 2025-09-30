import type { Request, Response, NextFunction } from "express";
import { AuditTrail } from "../../src/core/AuditTrail";
import {  sanitizePayload } from "../utils/sanitize";

export function expressAuditMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", async () => {
    await AuditTrail.log({
      type: "HTTP",
      category: "request",
      userId: (req as any).user?.id || null,
      ip: req.ip,
      endpoint: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      responseTime: Date.now() - start,
      userAgent: req.headers["user-agent"],
      action: `${req.method} ${req.originalUrl}`,
      description: `Request handled with status ${res.statusCode}`,
      payload: sanitizePayload(req.body),
      metadata: {
        headers: req.headers,
      },
    });
  });

  next();
}
