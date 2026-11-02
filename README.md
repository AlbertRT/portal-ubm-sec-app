# Portal UBM

Portal UBM adalah proyek tugas pengujian keamanan aplikasi web (*Web Application Security Testing*) dengan fokus pada identifikasi kerentanan **SQL Injection**, **Command Injection**, **Insecure Direct Object Reference (IDOR)**, dan **Broken Access Control**.

## 📌 Informasi Proyek

- **Nama Proyek:** Portal UBM
- **Jenis Proyek:** Web Application Security Testing
- **Fokus Pengujian:**
    - SQL Injection
    - Command Injection
    - Insecure Direct Object Reference (IDOR)
    - Broken Access Control
    - Unrestricted File Upload

## 🌐 Daftar Halaman

| Endpoint | Deskripsi |
|---|---|
| `/` | Halaman utama portal |
| `/login` | Halaman autentikasi pengguna |
| `/profile` | Halaman profil pengguna |
| `/tugas` | Halaman daftar tugas |
| `/tugas/tambah` | Halaman penambahan tugas |
| `/panel` | Halaman panel administratif |
| `/panel/server` | Halaman pengujian eksekusi perintah server |

## 👥 Akun Pengujian

| Username | Password | Role |
|---|---|---|
| `32240006` | `1234` | Student |
| `l2339` | `4567` | Lecturer |

> **Catatan:** Akun di atas digunakan untuk keperluan pengujian aplikasi dalam lingkungan yang terkontrol.

## 🔐 Environment Variables

Buat file `.env` pada direktori utama proyek dengan konfigurasi berikut:

```env
DATABASE_URL=
JWT_SECRET=
```

| Variabel | Deskripsi |
|---|---|
| `DATABASE_URL` | URL koneksi database |
| `JWT_SECRET` | Secret key untuk penandatanganan dan verifikasi JWT |

Isi kedua variabel tersebut sesuai dengan konfigurasi lingkungan pengujian.

## 🗄️ Database Setup

1. Pastikan database sudah dibuat dan konfigurasi `DATABASE_URL` pada file `.env` sudah sesuai.
2. Jalankan file `schema.sql` untuk membuat struktur tabel database.

   ```bash
   psql "$DATABASE_URL" -f schema.sql
   ```

3. Pastikan proses eksekusi selesai tanpa error sebelum menjalankan aplikasi.

> **Catatan:** Perintah di atas menggunakan PostgreSQL dan mengasumsikan file `schema.sql` berada di direktori utama proyek serta `DATABASE_URL` sudah berisi koneksi database yang valid.

---

# 🐛 SEC APP — Vulnerability Findings

## 1. SQL Injection

**Endpoint:** `/login`

**Deskripsi:**

Proses autentikasi diduga rentan terhadap SQL Injection karena input pengguna dapat memengaruhi logika query SQL.

**Temuan:**

- Pengujian menggunakan pola `' OR '1'='1` pada input login.
- Perlu verifikasi apakah manipulasi input dapat melewati autentikasi tanpa kredensial yang valid.

**Rekomendasi mitigasi:**

- Gunakan parameterized queries atau prepared statements.
- Hindari menyusun query SQL secara langsung dari input pengguna.
- Terapkan validasi input dan penanganan error yang aman.

## 2. Command Injection

**Endpoint:** `/panel/server`

**Deskripsi:**

Endpoint `/panel/server` menyediakan fitur eksekusi perintah sistem operasi yang memungkinkan pengguna menjalankan perintah melalui aplikasi web. Fitur ini berpotensi menimbulkan kerentanan Command Injection apabila input pengguna diteruskan ke shell tanpa validasi dan pembatasan yang memadai.

**Temuan:**

- Endpoint `/panel/server` memungkinkan pengguna menjalankan perintah sistem operasi melalui aplikasi web.
- Perintah `whoami` dapat digunakan untuk mengetahui identitas pengguna yang menjalankan proses server.
- Perintah `dir` dapat digunakan untuk menampilkan daftar direktori dan file.
- Perintah `cd` dan `cd ..` dapat digunakan untuk berpindah direktori.
- Perlu diperiksa apakah input tambahan dapat memanipulasi perintah yang dieksekusi oleh sistem operasi.

**Skenario pengujian:**

1. Mengakses halaman `/panel/server`.
2. Menjalankan perintah `whoami` untuk mengidentifikasi akun sistem yang menjalankan server.
3. Menjalankan perintah `dir` untuk melihat isi direktori aktif.
4. Menggunakan `cd` dan `cd ..` untuk menguji perpindahan direktori.
5. Memeriksa apakah input perintah dapat memengaruhi eksekusi perintah sistem lainnya.

**Rekomendasi mitigasi:**

- Hindari meneruskan input pengguna secara langsung ke shell sistem operasi.
- Gunakan fungsi API sistem operasi yang tidak melibatkan shell apabila memungkinkan.
- Terapkan allowlist terhadap perintah yang memang diperlukan.
- Batasi hak akses akun sistem yang menjalankan aplikasi.
- Terapkan validasi input dan pencatatan aktivitas eksekusi perintah.

## 3. Insecure Direct Object Reference (IDOR)

**Endpoint:** `/profile/{nim}`

**Deskripsi:**

Halaman profil diduga memiliki kelemahan kontrol akses yang memungkinkan pengguna melihat data pengguna lain dengan mengganti NIM pada URL.

**Temuan:**

- Pengguna dapat mengubah parameter NIM pada URL.
- Perlu verifikasi apakah aplikasi tetap menampilkan profil pengguna lain tanpa memeriksa hak akses.

**Rekomendasi mitigasi:**

- Verifikasi hak akses pada setiap permintaan profil.
- Pastikan pengguna hanya dapat mengakses data yang diizinkan.
- Terapkan pemeriksaan otorisasi di sisi server, bukan hanya menyembunyikan tautan di antarmuka.

## 4. Broken Access Control — Unauthenticated Admin Panel Access

**Endpoint:**
- `/panel`
- `/panel/server`

**Deskripsi:**

Halaman panel yang seharusnya diperuntukkan bagi administrator dapat diakses oleh pengguna tanpa melalui proses autentikasi maupun verifikasi role administrator.

**Temuan:**

- Pengguna dapat mengakses `/panel` tanpa melakukan login sebagai administrator.
- Pengguna dapat mengakses `/panel/server` tanpa melakukan login sebagai administrator.
- Fitur eksekusi perintah sistem pada `/panel/server` dapat diakses tanpa verifikasi hak akses administrator.
- Kondisi ini berpotensi memungkinkan pengguna yang tidak berwenang mengakses fungsi administratif aplikasi.

**Skenario pengujian:**

1. Pastikan pengguna belum melakukan login.
2. Akses endpoint `/panel` secara langsung.
3. Akses endpoint `/panel/server` secara langsung.
4. Periksa apakah aplikasi tetap memberikan akses ke halaman tersebut.
5. Ulangi pengujian menggunakan akun Student dan Lecturer untuk memeriksa pembatasan berdasarkan role.

**Rekomendasi mitigasi:**

- Terapkan autentikasi pada seluruh endpoint administratif.
- Terapkan pemeriksaan role administrator di sisi server.
- Gunakan middleware untuk memverifikasi autentikasi dan otorisasi.
- Tolak permintaan dari pengguna yang tidak memiliki hak akses.
- Jangan hanya mengandalkan pembatasan navigasi pada frontend.

## 5. Unrestricted File Upload

**Endpoint:** Fitur unggah file pada aplikasi.

**Deskripsi:**

Kerentanan yang terjadi ketika aplikasi menerima file tanpa validasi jenis, ukuran, konten, atau pembatasan penyimpanan yang memadai.

**Skenario pengujian:**

- Memeriksa apakah aplikasi menerima berbagai jenis file tanpa pembatasan.
- Memeriksa validasi ekstensi dan MIME type.
- Memeriksa apakah file yang diunggah dapat dieksekusi atau diakses secara tidak semestinya.

**Rekomendasi mitigasi:**

- Terapkan allowlist ekstensi file.
- Validasi MIME type dan signature file.
- Batasi ukuran file yang dapat diunggah.
- Simpan file di luar direktori publik apabila memungkinkan.
- Hindari memberikan izin eksekusi pada direktori penyimpanan file.

---

## 📊 Status Pengujian

| Vulnerability | Endpoint | Status |
|---|---|---|
| SQL Injection | `/login` | Perlu verifikasi hasil autentikasi |
| Command Injection | `/panel/server` | Fitur eksekusi command tersedia; injeksi perlu diverifikasi |
| IDOR | `/profile/{nim}` | Perlu verifikasi kontrol akses |
| Broken Access Control | `/panel` | Dapat diakses tanpa login admin |
| Broken Access Control | `/panel/server` | Dapat diakses tanpa login admin |
| Unrestricted File Upload | Fitur unggah file | Perlu pengujian |

## 🎯 Tujuan Pengujian

1. Mengidentifikasi kerentanan keamanan pada aplikasi web.
2. Menguji efektivitas autentikasi dan otorisasi berdasarkan role.
3. Memeriksa perlindungan terhadap akses data pengguna lain.
4. Mengevaluasi validasi input dan keamanan unggah file.
5. Menguji keamanan fitur eksekusi perintah sistem.
6. Mendokumentasikan hasil pengujian dan rekomendasi mitigasi.

## ⚠️ Disclaimer

Proyek ini dibuat untuk tujuan edukasi dan pengujian keamanan pada lingkungan yang terkontrol. Seluruh pengujian harus dilakukan hanya pada aplikasi dan sistem yang memiliki izin pengujian.

Hasil pengujian harus didokumentasikan berdasarkan respons aplikasi dan bukti yang diperoleh. Hindari menyimpan password atau data pribadi pengguna lain dalam laporan.
