import express from "express";
import bodyParser from "body-parser";
import { expressAuditMiddleware } from "../src/middleware/express.middleware";
import { AuditTrail } from "../src/core/AuditTrail";
import { FileAdapter } from "../src/adapters/file.adapter";

AuditTrail.init([
  new FileAdapter({ path: "./tests/audit.log.json" })
]);

const app = express();
app.use(bodyParser.json());
app.use(expressAuditMiddleware);

app.post("/login", (req, res) => {
  if (req.body.username === "admin") {
    res.status(200).send({ message: "Login success" });
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
});

app.listen(3000, () => {
  console.log("Test server running at http://localhost:3000");
});
