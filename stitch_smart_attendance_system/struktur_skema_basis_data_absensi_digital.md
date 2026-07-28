# Struktur Aplikasi & Skema Basis Data: Sistem Absensi Digital

## 1. Arsitektur Navigasi
### Admin/HR
- **Dashboard**: Ringkasan kehadiran harian, grafik tren, dan notifikasi pengajuan izin terbaru.
- **Data Karyawan**: Manajemen pengguna (CRUD), pengaturan lokasi kantor (Geofencing).
- **Laporan Absensi**: Tabel rekapitulasi harian/bulanan dengan fitur filter dan ekspor (Excel/PDF).
- **Persetujuan Izin**: Daftar permohonan izin/sakit yang perlu ditinjau.

### Karyawan/Siswa
- **Home**: Tombol Absen Masuk/Pulang (Floating Action Button), status kehadiran hari ini.
- **Riwayat**: Daftar absensi pribadi per bulan.
- **Pengajuan**: Form permohonan izin/sakit.
- **Profil**: Pengaturan akun dan informasi pribadi.

## 2. Skema Basis Data (Database Schema)

### Table: `Users`
- `id`: UUID (Primary Key)
- `username`: String
- `password`: Hash
- `full_name`: String
- `role`: Enum ('admin', 'employee')
- `office_id`: ForeignKey(Offices)
- `created_at`: Timestamp

### Table: `Offices` (Geofencing)
- `id`: UUID
- `name`: String
- `latitude`: Float
- `longitude`: Float
- `radius_meters`: Integer
- `work_start_time`: Time
- `work_end_time`: Time

### Table: `Attendances`
- `id`: UUID
- `user_id`: ForeignKey(Users)
- `check_in_time`: Timestamp
- `check_out_time`: Timestamp
- `check_in_photo`: String (URL)
- `check_in_lat`: Float
- `check_in_long`: Float
- `status`: Enum ('on_time', 'late', 'absent')

### Table: `LeaveRequests`
- `id`: UUID
- `user_id`: ForeignKey(Users)
- `type`: Enum ('sick', 'leave', 'permit')
- `start_date`: Date
- `end_date`: Date
- `reason`: Text
- `attachment_url`: String
- `status`: Enum ('pending', 'approved', 'rejected')
- `processed_by`: ForeignKey(Users)

## 3. Alur Integrasi (Frontend & Backend)
- **Geolocation**: Frontend mengambil koordinat via `navigator.geolocation`, dikirim ke Backend untuk divalidasi terhadap radius `Offices`.
- **Selfie**: Gambar ditangkap via Kamera API, diunggah ke storage, dan URL-nya disimpan di tabel `Attendances`.
- **Real-time**: Menggunakan WebSocket atau pooling untuk update dashboard admin saat ada yang absen.