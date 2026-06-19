CREATE DATABASE IF NOT EXISTS db_2311522030
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'user_2311522030'@'%'
  IDENTIFIED BY 'GANTI_DENGAN_PASSWORD_YANG_AMAN';

GRANT ALL PRIVILEGES ON db_2311522030.*
  TO 'user_2311522030'@'%';

FLUSH PRIVILEGES;

USE db_2311522030;

CREATE TABLE IF NOT EXISTS maintenance_records (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  device_name VARCHAR(120) NOT NULL,
  device_type VARCHAR(80) NOT NULL,
  maintenance_date DATE NOT NULL,
  technician_name VARCHAR(120) NOT NULL,
  cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status ENUM('Dijadwalkan', 'Dalam Proses', 'Selesai') NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_maintenance_date (maintenance_date),
  INDEX idx_status (status)
);

INSERT INTO maintenance_records (
  device_name,
  device_type,
  maintenance_date,
  technician_name,
  cost,
  status,
  notes
) VALUES
  (
    'Laptop Laboratorium 01',
    'Laptop',
    '2026-06-18',
    'Muhammad Rafi Asytar',
    150000,
    'Selesai',
    'Pembersihan kipas dan penggantian thermal paste.'
  ),
  (
    'Printer Administrasi',
    'Printer',
    '2026-06-20',
    'Teknisi Kampus',
    0,
    'Dijadwalkan',
    'Pemeriksaan hasil cetak bergaris.'
  );
