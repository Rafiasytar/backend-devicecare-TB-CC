const ALLOWED_STATUS = ["Dijadwalkan", "Dalam Proses", "Selesai"];

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function validateMaintenanceRecord(body) {
  const errors = [];
  const requiredTextFields = [
    ["device_name", "Nama perangkat"],
    ["device_type", "Jenis perangkat"],
    ["technician_name", "Nama teknisi"],
    ["status", "Status"]
  ];

  for (const [field, label] of requiredTextFields) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      errors.push(`${label} wajib diisi`);
    }
  }

  if (
    typeof body.maintenance_date !== "string" ||
    !isValidDate(body.maintenance_date)
  ) {
    errors.push("Tanggal perawatan harus berformat YYYY-MM-DD");
  }

  if (body.status && !ALLOWED_STATUS.includes(body.status)) {
    errors.push(`Status harus salah satu dari: ${ALLOWED_STATUS.join(", ")}`);
  }

  if (
    body.cost !== undefined &&
    body.cost !== null &&
    body.cost !== "" &&
    (!Number.isFinite(Number(body.cost)) || Number(body.cost) < 0)
  ) {
    errors.push("Biaya harus berupa angka nol atau lebih");
  }

  if (
    body.notes !== undefined &&
    body.notes !== null &&
    typeof body.notes !== "string"
  ) {
    errors.push("Catatan harus berupa teks");
  }

  return errors;
}

function normalizeMaintenanceRecord(body) {
  return {
    device_name: body.device_name.trim(),
    device_type: body.device_type.trim(),
    maintenance_date: body.maintenance_date,
    technician_name: body.technician_name.trim(),
    cost:
      body.cost === undefined || body.cost === null || body.cost === ""
        ? 0
        : Number(body.cost),
    status: body.status.trim(),
    notes: body.notes ? body.notes.trim() : null
  };
}

module.exports = {
  validateMaintenanceRecord,
  normalizeMaintenanceRecord
};
