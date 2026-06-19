const express = require("express");
const pool = require("../db");
const {
  validateMaintenanceRecord,
  normalizeMaintenanceRecord
} = require("../validation");

const router = express.Router();

const selectColumns = `
  id,
  device_name,
  device_type,
  maintenance_date,
  technician_name,
  cost,
  status,
  notes,
  created_at,
  updated_at
`;

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.get("/", async (req, res, next) => {
  try {
    const requestedPage = Number(req.query.page);
    const requestedLimit = Number(req.query.limit);
    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 10;
    const offset = (page - 1) * limit;
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const searchPattern = `%${search}%`;
    const whereClause = search
      ? `WHERE device_name LIKE ?
         OR device_type LIKE ?
         OR technician_name LIKE ?
         OR status LIKE ?`
      : "";
    const parameters = search
      ? [searchPattern, searchPattern, searchPattern, searchPattern]
      : [];

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM maintenance_records
       ${whereClause}`,
      parameters
    );
    const total = countRows[0].total;

    const [rows] = await pool.execute(
      `SELECT ${selectColumns}
       FROM maintenance_records
       ${whereClause}
       ORDER BY maintenance_date DESC, id DESC`
        + ` LIMIT ${limit} OFFSET ${offset}`,
      parameters
    );

    res.json({
      status: "success",
      message: "Data perawatan perangkat berhasil diambil",
      data: rows,
      items: rows,
      total,
      page,
      limit,
      hasMore: offset + rows.length < total
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "ID harus berupa bilangan bulat positif",
      data: null
    });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT ${selectColumns}
       FROM maintenance_records
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data perawatan perangkat tidak ditemukan",
        data: null
      });
    }

    res.json({
      status: "success",
      message: "Detail perawatan perangkat berhasil diambil",
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const errors = validateMaintenanceRecord(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      message: errors.join("; "),
      data: null
    });
  }

  const record = normalizeMaintenanceRecord(req.body);

  try {
    const [result] = await pool.execute(
      `INSERT INTO maintenance_records
        (device_name, device_type, maintenance_date, technician_name, cost, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        record.device_name,
        record.device_type,
        record.maintenance_date,
        record.technician_name,
        record.cost,
        record.status,
        record.notes
      ]
    );

    const [rows] = await pool.execute(
      `SELECT ${selectColumns}
       FROM maintenance_records
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      status: "success",
      message: "Data perawatan perangkat berhasil ditambahkan",
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "ID harus berupa bilangan bulat positif",
      data: null
    });
  }

  const errors = validateMaintenanceRecord(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      message: errors.join("; "),
      data: null
    });
  }

  const record = normalizeMaintenanceRecord(req.body);

  try {
    const [result] = await pool.execute(
      `UPDATE maintenance_records
       SET device_name = ?,
           device_type = ?,
           maintenance_date = ?,
           technician_name = ?,
           cost = ?,
           status = ?,
           notes = ?
       WHERE id = ?`,
      [
        record.device_name,
        record.device_type,
        record.maintenance_date,
        record.technician_name,
        record.cost,
        record.status,
        record.notes,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data perawatan perangkat tidak ditemukan",
        data: null
      });
    }

    const [rows] = await pool.execute(
      `SELECT ${selectColumns}
       FROM maintenance_records
       WHERE id = ?`,
      [id]
    );

    res.json({
      status: "success",
      message: "Data perawatan perangkat berhasil diperbarui",
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "ID harus berupa bilangan bulat positif",
      data: null
    });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT ${selectColumns}
       FROM maintenance_records
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data perawatan perangkat tidak ditemukan",
        data: null
      });
    }

    await pool.execute("DELETE FROM maintenance_records WHERE id = ?", [id]);

    res.json({
      status: "success",
      message: "Data perawatan perangkat berhasil dihapus",
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
