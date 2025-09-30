# AuditTrailJS

> ⚠️ **Status**: This library is currently in active development and is **not yet available on npm**. It will be released soon. Stay tuned for the official launch!

AuditTrailJS is an open-source library built in **JavaScript/TypeScript** for **Node.js** applications, designed to provide a **centralized and extensible layer for auditing and logging**. Its mission is to make it easy for developers to integrate consistent and reliable audit trails into their applications — whether for **security, compliance, or behavior analysis**.

---

## Features

- **Full auditing**: Capture critical events like logins, authentication failures, data modifications, access to protected resources, etc.
- **Consistency**: Define a unified logging standard across projects.
- **Transparency**: Ensure all relevant system actions are recorded clearly and verifiably.
- **Easy integration**: Plug-and-play middleware for popular frameworks (Express, Fastify), with advanced customization options.
- **Storage adapters**: Save events to different backends:
  - Local files (JSON/NDJSON, rotating logs)
  - MongoDB
  - MySQL
  - More coming soon (PostgreSQL, ElasticSearch, Loki...)
- **Sensitive data masking**: Automatically sanitize fields like `password`, `token`, `secret`, or custom fields.
- **Extensibility**: Support for custom adapters and plugins.

---

## 📦 Installation

```bash
# Coming soon to npm!
npm install audittrailjs
```

For now, you can clone the repository and use it locally:

```bash
git clone https://github.com/Mario-Coxe/audittrailjs.git
cd audittrailjs
npm install
```

---

## Quick Start

### 1. Initialize AuditTrail

```typescript
import { AuditTrail } from "audittrailjs";
import { FileAdapter } from "audittrailjs/adapters/file";

AuditTrail.init([
  new FileAdapter({ path: "./audit.log.json" })
], {
  sensitiveFields: ["password", "token", "ssn"] // optional customization
});
```

---

### 2. Log a custom event

```typescript
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

```typescript
import express from "express";
import { expressAuditMiddleware } from "audittrailjs/middleware/express";
import { AuditTrail } from "audittrailjs";
import { FileAdapter } from "audittrailjs/adapters/file";

// Initialize AuditTrail
AuditTrail.init([
  new FileAdapter({ path: "./audit-express.log.json" })
]);

const app = express();
app.use(express.json());

// Register audit middleware
app.use(expressAuditMiddleware);

app.post("/login", (req, res) => {
  const { username } = req.body;
  if (username === "admin") {
    res.status(200).send({ message: "Login successful" });
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

---

### 4. Use with Fastify

```typescript
import Fastify from "fastify";
import { fastifyAuditMiddleware } from "audittrailjs/middleware/fastify";
import { AuditTrail } from "audittrailjs";
import { FileAdapter } from "audittrailjs/adapters/file";

// Initialize AuditTrail
AuditTrail.init([
  new FileAdapter({ path: "./audit-fastify.log.json" })
]);

const app = Fastify();

// Register audit middleware
await app.register(fastifyAuditMiddleware);

app.post("/login", async (req, reply) => {
  const { username } = req.body as any;
  if (username === "admin") {
    return reply.code(200).send({ message: "Login successful" });
  } else {
    return reply.code(401).send({ message: "Unauthorized" });
  }
});

await app.listen({ port: 3001 });
console.log("Server running on http://localhost:3001");
```

---

## Audit Event Structure

```typescript
export interface AuditEvent {
  id?: string;                     // UUID v4 (auto-generated)
  type: string;                    // Event type, e.g. "HTTP", "SECURITY"
  category?: string;               // Logical grouping, e.g. "auth"
  userId?: string | null;          // User performing the action
  ip?: string;                     // Originating IP address
  endpoint?: string;               // URL/route accessed
  method?: string;                 // HTTP method (GET, POST, etc.)
  statusCode?: number;             // Response status code
  action: string;                  // Short action name/description
  description?: string;            // Detailed description of the event
  payload?: any;                   // Additional structured data (sanitized)
  createdAt: Date;                 // Timestamp (auto-generated)
  responseTime?: number;           // Response time in milliseconds
  userAgent?: string;              // User-Agent header
  metadata?: Record<string, any>;  // Extra information
}
```

---

## Storage Adapters

AuditTrailJS supports multiple storage backends through adapters:

### Available Adapters

- **FileAdapter** → Save events to local files as JSON/NDJSON
- **MongoAdapter** → Save events to MongoDB
- **MySQLAdapter** → Save events to MySQL (with automatic schema creation)

### Using Multiple Adapters

You can use multiple adapters simultaneously:

```typescript
import { AuditTrail } from "audittrailjs";
import { FileAdapter } from "audittrailjs/adapters/file";
import { MongoAdapter } from "audittrailjs/adapters/mongo";

AuditTrail.init([
  new FileAdapter({ path: "./audit.log.json" }),
  new MongoAdapter({ 
    uri: "mongodb://localhost:27017",
    database: "auditdb",
    collection: "audit_logs"
  })
]);
```

### Custom Adapters

Create your own adapter by implementing the `IAuditAdapter` interface:

```typescript
import { IAuditAdapter, AuditEvent } from "audittrailjs";

export class CustomAdapter implements IAuditAdapter {
  async save(event: AuditEvent): Promise<void> {
    // Your custom logic here
    console.log("Saving to custom storage:", event);
  }
}
```

---

## 🔒 Sensitive Data Sanitization

AuditTrailJS automatically masks sensitive fields in the payload to protect confidential information.

### Default Sensitive Fields

By default, these fields are automatically masked:
- `password`
- `token`
- `secret`

### Custom Sensitive Fields

You can customize which fields to sanitize:

```typescript
AuditTrail.init(adapters, {
  sensitiveFields: ["password", "creditCard", "ssn", "apiKey", "privateKey"]
});
```

**Example:**

```typescript
// Input payload
const payload = {
  username: "john",
  password: "secret123",
  email: "john@example.com"
};

// Logged payload (password is masked)
{
  username: "john",
  password: "***REDACTED***",
  email: "john@example.com"
}
```

---

## Roadmap

- [ ] PostgreSQL adapter
- [ ] ElasticSearch adapter
- [ ] Loki/Grafana adapter
- [ ] Advanced masking rules (regex patterns, nested fields)
- [ ] CLI tools for querying and analyzing audit logs
- [ ] Real-time event streaming support
- [ ] Dashboard for visualizing audit trails
- [ ] Support for more frameworks (NestJS, Hapi, Koa)
- [ ] Official npm release 🚀

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please check the [open issues](https://github.com/Mario-Coxe/audittrailjs/issues) or create a new one for discussion before starting work on major changes.

---

## License

MIT © 2025 Mário Coxe

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Mario-Coxe/audittrailjs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Mario-Coxe/audittrailjs/discussions)

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**