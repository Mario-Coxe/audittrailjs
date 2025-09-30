import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { AuditTrail } from "../../src/core/AuditTrail";
import { sanitizePayload } from "../utils/sanitize";

async function fastifyAuditMiddlewarePlugin(app: FastifyInstance) {
  console.log("Fastify audit middleware initialized.");

  app.addHook("onRequest", async (req: FastifyRequest) => {
    (req as any).startTime = Date.now();
  });

  app.addHook(
    "onResponse",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const responseTime = (req as any).startTime
        ? Date.now() - (req as any).startTime
        : undefined;

      await AuditTrail.log({
        type: "HTTP",
        category: "request",
        userId: (req as any).user?.id || null,
        ip: req.ip,
        endpoint: req.url,
        method: req.method,
        statusCode: reply.statusCode,
        responseTime,
        userAgent: req.headers["user-agent"],
        action: `${req.method} ${req.url}`,
        description: `Request handled with status ${reply.statusCode}`,
        payload: sanitizePayload(req.body),
        metadata: {
          headers: req.headers,
        },
      });
    }
  );
}

export const fastifyAuditMiddleware = fp(fastifyAuditMiddlewarePlugin, {
  name: "fastify-audit-middleware",
  fastify: "5.x" 
});