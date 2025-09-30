````markdown
# AuditTrailJS

AuditTrailJS is an open-source library built in **JavaScript/TypeScript** for **Node.js** applications, designed to provide a **centralized and extensible layer for auditing and logging**. Its mission is to make it easy for developers to integrate consistent and reliable audit trails into their applications — whether for **security, compliance, or behavior analysis**.

## Features

- Full auditing: Capture critical events like logins, authentication failures, data modifications, access to protected resources, etc.
- Consistency: Define a unified logging standard across projects.
- Transparency: Ensure all relevant system actions are recorded clearly and verifiably.
- Easy integration: Plug-and-play middleware for popular frameworks, with advanced customization options.
- Storage adapters: Save events to different backends:
  - Local files (JSON/NDJSON, rotating logs)
  - MongoDB
  - MySQL
  - More coming soon (PostgreSQL, ElasticSearch, Loki...)
- Sensitive data masking: Automatically sanitize fields like `password`, `token`, `secret`, or custom fields.
- Extensibility: Support for custom adapters and plugins.

---

## Installation

```bash
npm install audittrailjs
````

---

## Quick Start

### 1. Initialize AuditTrail

```ts
import { AuditTrail } from "audittrailjs";
import { FileAdapter } from "audittrailjs/adapters/file.adapter";

AuditTrail.init([
  new FileAdapter({ path: "./audit.log.json" })
], {
  sensitiveFields: ["password", "token", "ssn"] // optional customization
});
```

---

### 2. Log a custom event

```ts
await AuditTrail.log({
  type: "SECURITY",
  category: "auth",
  userId: "123",
  ip: "192.168.1.10",
  endpoint: "/users/update",
  method: "PUT",
  statusCode: 200,
  responseTime: 123,
  userAgent: "Mozilla/5.0",
  action: "USER_UPDATE",
  description: "User updated email address",
  payload: { old: "a@x.com", new: "b@x.com" },
  metadata: { requestId: "req-12345" },
});
```

---

### 3. Use with Express

```ts
import express from "express";
import { expressAuditMiddleware } from "audittrailjs/middleware/express";

const app = express();
app.use(express.json());
app.use(expressAuditMiddleware);

app.post("/login", (req, res) => {
  res.status(200).send("ok");
});
```

---

### 4. Use with Fastify

```ts
import Fastify from "fastify";
import { fastifyAuditMiddleware } from "audittrailjs/middleware/fastify";

const app = Fastify();
await app.register(fastifyAuditMiddleware);

app.get("/users", async () => {
  return { ok: true };
});
```

---

## Audit Event Structure

```ts
export interface AuditEvent {
  id?: string;                     // UUID v4
  type: string;                    // Event type, e.g. "login", "update"
  category?: string;               // Logical grouping, e.g. "auth", "db-change"
  userId?: string;                 // User performing the action
  ip?: string;                     // Originating IP
  endpoint?: string;               // URL/route accessed
  method?: string;                 // HTTP method
  statusCode?: number;             // Response status code
  action: string;                  // Short action name
  description?: string;            // Detailed description
  payload?: any;                   // Additional structured data
  createdAt: Date;                 // Timestamp
  responseTime?: number;           // Response time (ms)
  userAgent?: string;              // User-Agent header
  metadata?: Record<string, any>;  // Extra information
}
```

---

## Adapters

* FileAdapter → save events in local file as JSON.
* MongoAdapter → save events in MongoDB.
* MySQLAdapter → save events in MySQL (with automatic schema creation).
* Extensible: build your own adapter by implementing `IAuditAdapter`.

---

## Sensitive Data Sanitization

AuditTrailJS automatically masks sensitive fields in the payload.
By default: `password`, `token`, `secret`.

You can customize:

```ts
AuditTrail.init(adapters, {
  sensitiveFields: ["password", "creditCard", "ssn"]
});
```

---

## Roadmap

* [ ] PostgreSQL adapter
* [ ] ElasticSearch adapter
* [ ] Loki/Grafana adapter
* [ ] Advanced masking rules (regex, nested fields)
* [ ] CLI tools for querying audit logs

---

## Contributing

Contributions are welcome!

* Fork the repo
* Create a feature branch
* Submit a PR

Please check open issues or create a new one for discussion.

---

## License

MIT © 2025 [Mário Coxe]
```
