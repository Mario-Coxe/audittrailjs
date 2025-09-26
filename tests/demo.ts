import { MongoAdapter } from "../src/adapters/mongodb.adapter";
import { MySQLAdapter } from "../src/adapters/mysql.adapter";
import { FileAdapter } from "../src/adapters/file.adapter";
import { AuditTrail } from "../src/core/AuditTrail";

async function main() {
  AuditTrail.init([
    new FileAdapter({ path: "./audit.log.json" }),
    new MongoAdapter("mongodb://localhost:27017", "auditdb"),
    new MySQLAdapter("localhost", "root", "password", "auditdb"),
  ]);

  await AuditTrail.log({
      type: "SECURITY",
      userId: "456",
      ip: "192.168.1.10",
      action: "USER_UPDATE",
      payload: { field: "email", old: "a@x.com", new: "ana@x.com" },
  });

  console.log("Event logged in File, Mongo and MySQL!");
}

main();
