// 1. Impor package yang dibutuhkan
const express = require('express');
const cors = require('cors');

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Konfigurasi Middleware

// --- Konfigurasi CORS yang Aman (Direkomendasikan) ---
// Daftar ini hanya mengizinkan permintaan dari URL frontend Anda yang sah.
const allowedOrigins = [
  'https://fluentvoices.netlify.app', // URL Netlify Anda
  'http://localhost:3000',             // Untuk development/testing di komputer lokal
  'http://127.0.0.1:5500'              // Untuk testing file HTML langsung dari VS Code Live Server
];

app.use(cors({
  origin: function (origin, callback) {
    // Izinkan request jika origin-nya ada di dalam daftar 'allowedOrigins'
    // atau jika request tidak memiliki origin (seperti dari Postman atau aplikasi sejenis)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Akses tidak diizinkan oleh kebijakan CORS'));
    }
  }
}));

app.use(express.json()); // Mem-parsing body permintaan dalam format JSON
app.use(express.urlencoded({ extended: true })); // Mem-parsing body dari form HTML

// 4. Membuat route untuk endpoint pendaftaran
app.post('/daftar', (req, res) => {
    // req.body akan berisi data yang dikirim dari formulir
    const dataPendaftar = req.body;

    console.log('🎉 Data pendaftaran baru diterima:');
    console.log(dataPendaftar);

    // Validasi sederhana
    if (!dataPendaftar.Nama || !dataPendaftar.Telepon || !dataPendaftar.Email) {
        // Jika data penting tidak ada, kirim respons error
        return res.status(400).json({ message: 'Data tidak lengkap. Nama, Telepon, dan Email wajib diisi.' });
    }

    // 5. Mengirim respons kembali ke frontend
    res.status(200).json({ message: 'Pendaftaran Anda telah berhasil kami terima! Tim kami akan segera menghubungi Anda.' });
});

// 6. Menjalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server Fluent Voice berjalan di port: ${PORT}`);
});