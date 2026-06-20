const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { config } = require("./config");
const schema = require("./schema");
const maintenanceRecordsRouter = require("./routes/maintenanceRecords");

const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin:
      config.corsOrigin === "*"
        ? true
        : config.corsOrigin.split(",").map((origin) => origin.trim())
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "DeviceCare API aktif",
    data: {
      health: "/health",
      schema: "/schema",
      resource: "/maintenance-records"
    }
  });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "success",
      message: "Backend is running",
      database: "connected",
      student: schema.student
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "Backend is running, but database is not connected",
      database: "disconnected",
      student: schema.student
    });
  }
});

app.get("/schema", (req, res) => {
  res.json(schema);
});

app.use("/maintenance-records", maintenanceRecordsRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      status: "error",
      message: "Format JSON tidak valid",
      data: null
    });
  }

  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
    data: null
  });
});

module.exports = app;
