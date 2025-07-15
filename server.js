// 1. Impor package yang dibutuhkan
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); // -> TAMBAHKAN INI

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Konfigurasi Middleware
const allowedOrigins = [
  'https://fluentvoices.netlify.app',
  'http://localhost:3000',
  'http://127.0.0.1:5500'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Akses tidak diizinkan oleh kebijakan CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MULAI KONFIGURASI NODEMAILER ---

// Konfigurasi untuk mengirim email menggunakan akun Gmail Anda
// Ganti dengan email dan Sandi Aplikasi yang sudah Anda buat
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fluentvoicesenglish@gmail.com', // Email Anda
        pass: 'fymy igic kvaq zxke' // -> GANTI DENGAN SANDI APLIKASI
    }
});

// --- SELESAI KONFIGURASI NODEMAILER ---


// 4. Membuat route untuk endpoint pendaftaran
app.post('/daftar', (req, res) => {
    const dataPendaftar = req.body;

    console.log('🎉 Data pendaftaran baru diterima:', dataPendaftar);

    // Validasi sederhana
    if (!dataPendaftar.Nama || !dataPendaftar.Telepon || !dataPendaftar.Email) {
        return res.status(400).json({ message: 'Data tidak lengkap. Nama, Telepon, dan Email wajib diisi.' });
    }

    // --- MULAI LOGIKA KIRIM EMAIL ---

    // Menyiapkan isi email yang akan dikirim
    const mailOptions = {
        from: '"Fluent Voice Notifikasi" <fluentvoicesenglish@gmail.com>', // Nama dan email pengirim
        to: 'fluentvoicesenglish@gmail.com', // Email tujuan (email Anda)
        subject: `Pendaftaran Baru dari ${dataPendaftar.Nama}`, // Subjek email
        html: `
            <h3>Pendaftaran Baru Telah Diterima!</h3>
            <p>Berikut adalah detail pendaftar:</p>
            <ul>
                <li><strong>Nama:</strong> ${dataPendaftar.Nama}</li>
                <li><strong>No. WhatsApp:</strong> ${dataPendaftar.Telepon}</li>
                <li><strong>Email:</strong> ${dataPendaftar.Email}</li>
                <li><strong>Kelompok Umur:</strong> ${dataPendaftar.Umur}</li>
                <li><strong>Kota:</strong> ${dataPendaftar.Kota}</li>
            </ul>
        `
    };

    // Mengirim email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error saat mengirim email:', error);
            // Tetap kirim respons sukses ke pengguna agar tidak membingungkan,
            // tapi kita tahu ada masalah di backend.
            return res.status(200).json({ message: 'Pendaftaran Anda berhasil, namun terjadi kesalahan internal saat notifikasi email.' });
        }
        console.log('Email berhasil dikirim:', info.response);
        // Kirim respons sukses jika email berhasil dikirim
        res.status(200).json({ message: 'Pendaftaran Anda telah berhasil kami terima! Tim kami akan segera menghubungi Anda.' });
    });

    // --- SELESAI LOGIKA KIRIM EMAIL ---
});

// 6. Menjalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server Fluent Voice berjalan di port: ${PORT}`);
});