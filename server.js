// 1. Impor package yang dibutuhkan
const express = require('express');
const cors = require('cors');

// 2. Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Konfigurasi Middleware

// Konfigurasi CORS untuk memberi izin pada frontend Netlify Anda
const corsOptions = {
  origin: 'https://fluentvoices.netlify.app' // URL Frontend Anda
};

// Terapkan middleware CORS untuk semua request
app.use(cors(corsOptions));

// Tambahkan baris ini untuk secara eksplisit menangani pre-flight request dari browser
app.options('*', cors(corsOptions)); 


app.use(express.json()); // Mem-parsing body permintaan dalam format JSON
app.use(express.urlencoded({ extended: true })); // Mem-parsing body dari form HTML

// 4. Membuat route untuk endpoint pendaftaran
// Ini adalah URL yang akan dituju oleh formulir Anda
app.post('/daftar', (req, res) => {
    // req.body akan berisi data yang dikirim dari formulir
    const dataPendaftar = req.body;

    console.log('🎉 Data pendaftaran baru diterima:'); //
    console.log(dataPendaftar);

    // --- Logika Pemrosesan Data ---
    // Di sini Anda bisa menyimpan data ke database, mengirim email, dll.
    // Untuk saat ini, kita hanya akan menampilkannya di konsol server.

    // Validasi sederhana
    if (!dataPendaftar.Nama || !dataPendaftar.Telepon || !dataPendaftar.Email) {
        // Jika data penting tidak ada, kirim respons error
        return res.status(400).json({ message: 'Data tidak lengkap. Nama, Telepon, dan Email wajib diisi.' });
    }

    // 5. Mengirim respons kembali ke frontend
    // Mengirim pesan sukses jika data diterima dengan baik
    res.status(200).json({ message: 'Pendaftaran Anda telah berhasil kami terima! Tim kami akan segera menghubungi Anda.' });
});

// 6. Menjalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server Fluent Voice berjalan di http://localhost:${PORT}`);
});