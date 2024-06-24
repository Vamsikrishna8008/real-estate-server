
export default {
  PORT: process.env.PORT || 5001,
  DATABASE_URL:
    process.env.DB_URL || "mysql://root:root@localhost:3306/real_estate",
  DATABASE_LOGING: process.env.DATABASE_LOGING === "true" || true, // false for production
  DATABASE_POOL_SIZE: Number(process.env.DATABASE_POOL_SIZE) || 10,
  JWT_SECRET_KEY: process.env.JWT_SECREY_KEY || "realestate",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  JWT_ISSUER: process.env.JWT_ISSUER || "realestate",
  DATABASE_SEEDING: false as boolean,
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  DATABASE_SYNC: process.env.DB_SYNC === "true" || true,
};
