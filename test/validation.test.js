const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validateMaintenanceRecord,
  normalizeMaintenanceRecord
} = require("../src/validation");

const validRecord = {
  device_name: "Router Gedung A",
  device_type: "Router",
  maintenance_date: "2026-06-19",
  technician_name: "Muhammad Rafi Asytar",
  cost: 75000,
  status: "Dalam Proses",
  notes: "Pemeriksaan koneksi."
};

test("menerima data perawatan yang valid", () => {
  assert.deepEqual(validateMaintenanceRecord(validRecord), []);
});

test("menolak field wajib, tanggal, biaya, dan status yang tidak valid", () => {
  const errors = validateMaintenanceRecord({
    device_name: "",
    device_type: "",
    maintenance_date: "19-06-2026",
    technician_name: "",
    cost: -1,
    status: "Rusak"
  });

  assert.equal(errors.length, 6);
});

test("menormalisasi teks dan biaya kosong", () => {
  const normalized = normalizeMaintenanceRecord({
    ...validRecord,
    device_name: "  Router Gedung A  ",
    cost: "",
    notes: "  Pemeriksaan koneksi.  "
  });

  assert.equal(normalized.device_name, "Router Gedung A");
  assert.equal(normalized.cost, 0);
  assert.equal(normalized.notes, "Pemeriksaan koneksi.");
});
