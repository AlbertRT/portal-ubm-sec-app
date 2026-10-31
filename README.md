# Portal UBM

Portal UBM adalah proyek tugas pengujian keamanan aplikasi web (*Web Application Security Testing*) dengan fokus pada identifikasi kerentanan **SQL Injection** dan **Command Injection**.

## 📌 Informasi Proyek

- **Nama Proyek:** Portal UBM
- **Jenis Proyek:** Web Application Security Testing
- **Fokus Pengujian:**
    - SQL Injection
    - Command Injection
    - Insecure Direct Object Reference (IDOR)
    - Unrestricted File Upload

## 🌐 Daftar Halaman

| Endpoint | Deskripsi |
|---|---|
| `/` | Halaman utama portal |
| `/login` | Halaman autentikasi pengguna |
| `/profile` | Halaman profil pengguna |
| `/tugas` | Halaman daftar tugas |
| `/tugas/tambah` | Halaman penambahan tugas |

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

## 🐛 Daftar Vulnerability

### 1. SQL Injection

**Deskripsi:**  
Kerentanan yang dapat terjadi ketika input pengguna dimasukkan ke dalam query SQL tanpa penanganan yang aman.

**Area pengujian:**
- Autentikasi pada `/login`.
- Pengambilan data pengguna berdasarkan parameter query.
- Pengambilan data tugas berdasarkan input pengguna.

**Tujuan pengujian:** Memeriksa apakah input dapat mengubah logika query SQL atau menyebabkan akses data yang tidak semestinya.

### 2. Command Injection

**Deskripsi:**  
Kerentanan yang dapat terjadi ketika input pengguna diteruskan ke perintah sistem operasi tanpa validasi dan pembatasan yang memadai.

**Area pengujian:** Endpoint atau fitur yang memproses input pengguna menggunakan perintah sistem operasi.

**Tujuan pengujian:** Memastikan input pengguna tidak dapat memengaruhi eksekusi perintah sistem secara tidak semestinya.

### 3. Insecure Direct Object Reference (IDOR)

**Deskripsi:**  
Kerentanan kontrol akses yang memungkinkan pengguna mengakses data milik pengguna lain dengan memanipulasi identifier atau parameter yang digunakan untuk mengambil data.

**Skenario pengujian:**
- Mengakses profil pengguna lain melalui parameter atau identifier.
- Mengambil data tugas milik pengguna lain.
- Memastikan pembatasan akses berdasarkan identitas dan role pengguna berjalan dengan benar.

### 4. Unrestricted File Upload

**Deskripsi:**  
Kerentanan yang terjadi ketika aplikasi menerima file tanpa validasi jenis, ukuran, konten, atau pembatasan penyimpanan yang memadai.

**Area pengujian:** Fitur unggah file pada aplikasi.

**Skenario pengujian:**
- Memeriksa apakah aplikasi menerima berbagai jenis file tanpa pembatasan.
- Memeriksa validasi ekstensi dan MIME type.
- Memeriksa apakah file yang diunggah dapat dieksekusi atau diakses secara tidak semestinya.

## 🎯 Tujuan Pengujian

1. Mengidentifikasi kerentanan keamanan pada aplikasi web.
2. Menguji efektivitas autentikasi dan otorisasi berdasarkan role.
3. Memeriksa perlindungan terhadap akses data pengguna lain.
4. Mengevaluasi validasi input dan keamanan unggah file.
5. Mendokumentasikan hasil pengujian dan rekomendasi mitigasi.

## ⚠️ Disclaimer

Proyek ini dibuat untuk tujuan edukasi dan pengujian keamanan pada lingkungan yang terkontrol. Seluruh pengujian harus dilakukan hanya pada aplikasi dan sistem yang memiliki izin pengujian.