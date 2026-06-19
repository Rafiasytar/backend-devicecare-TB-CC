const app = require("./app");
const pool = require("./db");
const { config } = require("./config");

const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`DeviceCare API berjalan pada port ${config.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} diterima, menghentikan server...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
