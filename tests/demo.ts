import dotenv from "dotenv";
dotenv.config({ path: "./tests/.env" });

import { MongoAdapter } from "../src/adapters/mongodb.adapter";
import { MySQLAdapter } from "../src/adapters/mysql.adapter";
import { FileAdapter } from "../src/adapters/file.adapter";
import { AuditTrail } from "../src/core/AuditTrail";

async function main() {
  AuditTrail.init([
    new FileAdapter({
      path: process.env.AUDIT_FILE_PATH || "./audit.log.json",
    }),
    new MongoAdapter(
      process.env.MONGO_URI || "mongodb://localhost:27017",
      process.env.MONGO_DB || "auditdb"
    ),
    new MySQLAdapter(
      process.env.MYSQL_HOST || "localhost",
      process.env.MYSQL_USER || "root",
      process.env.MYSQL_PASS || "",
      process.env.MYSQL_DB || "auditdb"
    ),
  ]);

  await AuditTrail.log({
    type: "SECURITY",
    category: "auth",
    userId: "456",
    ip: "192.168.1.10",
    endpoint: "/users/update",
    method: "PUT",
    statusCode: 200, 
    responseTime: 120, 
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    action: "USER_UPDATE",
    description: "User updated email address",
    payload: { field: "email", old: "a@x.com", new: "ana@x.com" },
    metadata: { requestId: "req-12345", source: "webapp" },
  });

  console.log("Event logged in File, Mongo and MySQL!");
}

main();
