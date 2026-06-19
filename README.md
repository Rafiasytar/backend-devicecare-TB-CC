# DeviceCare Backend

Backend REST API untuk Tugas Besar Komputasi Awan 2026.

## Identitas

- Nama: Muhammad Rafi Asytar
- NIM: 2311522030
- Kelas: Komputasi Awan A
- Tema: Pencatatan Perawatan Perangkat Elektronik

## Teknologi

- Node.js 20
- Express
- MariaDB
- Google Cloud Run

Frontend harus ditempatkan pada layanan GCP yang berbeda, misalnya App
Engine atau Compute Engine, dengan nama layanan `fe-2311522030`. Backend ini
direkomendasikan memakai Cloud Run dengan nama `be-2311522030`.

## Menyiapkan Database

1. Buka MariaDB menggunakan akun yang diberikan asisten.
2. Jalankan isi `database/init.sql`.
3. Ganti placeholder password sebelum menjalankan perintah `CREATE USER`.
4. Jangan menyimpan password database di repository.

Jika database dan user sudah dibuat, cukup jalankan bagian `USE`,
`CREATE TABLE`, dan data contoh.

## Menjalankan Backend

```bash
npm install
copy .env.example .env
npm start
```

Isi `.env` dengan host, user, password, dan nama database yang benar.
Backend berjalan pada `http://localhost:8080`.

## Endpoint

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/health` | Memeriksa backend dan koneksi database |
| GET | `/schema` | Memberikan metadata resource kepada frontend |
| GET | `/maintenance-records` | Mengambil semua data |
| GET | `/maintenance-records/:id` | Mengambil satu data |
| POST | `/maintenance-records` | Menambahkan data |
| PUT | `/maintenance-records/:id` | Memperbarui data |
| DELETE | `/maintenance-records/:id` | Menghapus data |

Contoh body untuk POST dan PUT:

```json
{
  "device_name": "Router Gedung A",
  "device_type": "Router",
  "maintenance_date": "2026-06-19",
  "technician_name": "Muhammad Rafi Asytar",
  "cost": 75000,
  "status": "Dalam Proses",
  "notes": "Pemeriksaan koneksi dan pembaruan firmware."
}
```

Nilai status yang diperbolehkan:

- `Dijadwalkan`
- `Dalam Proses`
- `Selesai`

## Deploy ke Cloud Run

Aktifkan Cloud Build dan Cloud Run, lalu jalankan dari folder proyek:

```bash
gcloud run deploy be-2311522030 \
  --source . \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars DB_HOST=HOST_DB,DB_PORT=3306,DB_USER=user_2311522030,DB_NAME=db_2311522030,CORS_ORIGIN=*
```

Masukkan `DB_PASSWORD` secara terpisah melalui Google Cloud Console atau
Secret Manager. Pastikan firewall VM MariaDB mengizinkan koneksi dari
backend sesuai arahan asisten.

## Checklist Pengujian

1. Buka `/health` dan pastikan backend serta database `connected`.
2. Buka `/schema` dan periksa identitas serta endpoint.
3. Uji tambah, tampil, edit, dan hapus data melalui frontend.
4. Pastikan data benar-benar berubah pada MariaDB.
5. Simpan screenshot setiap tahap untuk laporan.
