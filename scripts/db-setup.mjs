import { readFileSync } from "node:fs";
import { Client } from "pg";

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
await client.end();
console.log("Şema uygulandı.");
