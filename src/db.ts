import { DataSource } from "typeorm";
import CONFIG from "./config";

const db = new DataSource({
  type: "mysql",
  url: CONFIG.DATABASE_URL,
  synchronize: CONFIG.DATABASE_SYNC,
  logging: CONFIG.DATABASE_LOGING,
  poolSize: CONFIG.DATABASE_POOL_SIZE,
  driver:require("mysql2")
});

export default db;