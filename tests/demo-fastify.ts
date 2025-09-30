import Fastify from "fastify";
import { fastifyAuditMiddleware } from "../src/middleware/fastify.middleware";
import { AuditTrail } from "../src/core/AuditTrail";
import { FileAdapter } from "../src/adapters/file.adapter";

AuditTrail.init([new FileAdapter({ path: "./tests/audit-fastify.log.json" })]);

async function main() {
  const app = Fastify();
  await app.register(fastifyAuditMiddleware);

  app.post("/login", async (req, reply) => {
    const body: any = req.body;
    if (body.username === "admin") {
      return reply.code(200).send({ message: "Login success" });
    } else {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  });

  await app.listen({ port: 3001 });
  console.log("Fastify server running at http://localhost:3001");
}

main();
