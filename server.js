// 1. Impor package yang dibutuhkan
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

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

// --- KONFIGURASI NODEMAILER ---

// Konfigurasi untuk mengirim email menggunakan akun Gmail Anda
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fluentvoicesenglish@gmail.com', // Email Anda
        pass: 'fymy igic kvaq zxke' // Sandi Aplikasi Anda
    }
});


app.post('/daftar', (req, res) => {
    const dataPendaftar = req.body;

    console.log('🎉 Data pendaftaran baru diterima:', dataPendaftar);

    if (!dataPendaftar.Nama || !dataPendaftar.Telepon || !dataPendaftar.Email || !dataPendaftar.Paket) {
        return res.status(400).json({ message: 'Data tidak lengkap. Semua kolom wajib diisi.' });
    }

    // --- Format nomor WhatsApp untuk link ---
    const nomorWhatsappLink = dataPendaftar.Telepon.replace(/\s|-/g, '').replace(/^0/, '62');

    // === PERUBAHAN DIMULAI DI SINI ===

    // 1. Siapkan variabel kosong untuk menampung HTML kode promo
    let promoCodeHtml = '';

    // 2. Cek apakah pendaftar mengirimkan kode promo
    if (dataPendaftar.KodePromo) {
        // Jika ya, isi variabel dengan baris HTML untuk ditampilkan di email
        promoCodeHtml = `<li><strong>Kode Promo Digunakan:</strong> <span style="background-color: #adff00; color: #1a1a1a; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${dataPendaftar.KodePromo}</span></li>`;
    }

    // Menyiapkan isi email yang akan dikirim
    const mailOptions = {
        from: '"Fluent Voice Notifikasi" <fluentvoicesenglish@gmail.com>',
        to: 'fluentvoicesenglish@gmail.com',
        subject: `Pendaftaran Baru dari ${dataPendaftar.Nama}`,
        html: `
            <h3>Pendaftaran Baru Telah Diterima!</h3>
            <p>Berikut adalah detail pendaftar:</p>
            <ul>
                <li><strong>Nama:</strong> ${dataPendaftar.Nama}</li>
                <li><strong>No. WhatsApp:</strong> <a href="https://wa.me/${nomorWhatsappLink}" target="_blank">${dataPendaftar.Telepon}</a></li>
                <li><strong>Email:</strong> ${dataPendaftar.Email}</li>
                <li><strong>Kelompok Umur:</strong> ${dataPendaftar.Umur}</li>
                <li><strong>Kota:</strong> ${dataPendaftar.Kota}</li>
                <li><strong>Paket yang Dipilih:</strong> ${dataPendaftar.Paket}</li>
                ${promoCodeHtml} 
            </ul>
        `
    };

    // === PERUBAHAN SELESAI ===


    // Mengirim email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error saat mengirim email:', error);
            return res.status(200).json({ message: 'Pendaftaran Anda berhasil, namun terjadi kesalahan internal saat notifikasi email.' });
        }
        console.log('Email berhasil dikirim:', info.response);
        res.status(200).json({ message: 'Pendaftaran Anda telah berhasil kami terima! Tim kami akan segera menghubungi Anda.' });
    });
});

// 6. Menjalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server Fluent Voice berjalan di port: ${PORT}`);
});