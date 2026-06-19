const dotenv = require("dotenv");

dotenv.config();

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name] || fallback);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} harus berupa angka`);
  }
  return value;
}

const config = {
  port: numberFromEnv("PORT", 8080),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  database: {
    host: process.env.DB_HOST,
    port: numberFromEnv("DB_PORT", 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: numberFromEnv("DB_CONNECTION_LIMIT", 5)
  }
};

function validateDatabaseConfig() {
  const required = ["host", "user", "password", "database"];
  const missing = required.filter((key) => !config.database[key]);

  if (missing.length > 0) {
    throw new Error(
      `Konfigurasi database belum lengkap: ${missing.join(", ")}`
    );
  }
}

module.exports = { config, validateDatabaseConfig };
