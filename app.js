// =================================================================
// 1. IMPORT MODUL
// =================================================================
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 4000;

// =================================================================
// 2. PENGATURAN MIDDLEWARE
// =================================================================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'kunciSuperRahasiaSajiLokalUntukAdminDanUser',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.cart = req.session.cart || [];
    res.locals.discountPercent = req.session.discountPercent || 0;
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Konfigurasi Multer untuk Upload Foto Profil
const storage = multer.diskStorage({
    destination: './public/img/avatars/',
    filename: function(req, file, cb) {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profilePicture');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Hanya gambar yang diizinkan!');
    }
}

// =================================================================
// 3. DATA SIMULASI (PENGGANTI DATABASE) - VERSI LENGKAP
// =================================================================
let kategoriMakanan = [
    { id: 1, nama: 'Paket Nasi', gambar: '/img/kategori/nasi-rames.jpg' },
    { id: 2, nama: 'Lauk Utama', gambar: '/img/kategori/rendang.jpg' },
    { id: 3, nama: 'Sayuran', gambar: '/img/kategori/sayur-asem.jpg' },
    { id: 4, nama: 'Gorengan', gambar: '/img/kategori/gorengan.jpg' },
];

let semuaMakanan = [
    // Paket Nasi (id_kategori: 1)
    { id: 1, id_kategori: 1, nama: 'Nasi Rames Komplit', harga: 15000, gambar: '/img/kategori/nasi-rames.jpg', deskripsi: 'Nasi dengan orek tempe, tumis buncis, dan ayam goreng.' },
    { id: 2, id_kategori: 1, nama: 'Nasi Rendang', harga: 18000, gambar: '/img/makanan/nasi-rendang.jpg', deskripsi: 'Nasi dengan rendang daging sapi empuk dan kaya rempah.' },
    { id: 3, id_kategori: 1, nama: 'Nasi Ayam Bakar', harga: 16000, gambar: '/img/makanan/nasi-ayam-bakar.jpg', deskripsi: 'Nasi dengan ayam bakar bumbu kecap manis pedas.' },
    { id: 4, id_kategori: 1, nama: 'Nasi Lele Sambal', harga: 14000, gambar: '/img/makanan/lele-goreng.jpg', deskripsi: 'Nasi hangat disajikan dengan lele goreng renyah dan sambal terasi.' },

    // Lauk Utama (id_kategori: 2)
    { id: 5, id_kategori: 2, nama: 'Rendang Daging', harga: 12000, gambar: '/img/kategori/rendang.jpg', deskripsi: 'Potongan daging sapi empuk dengan bumbu rendang otentik.' },
    { id: 6, id_kategori: 2, nama: 'Ayam Goreng Lengkuas', harga: 9000, gambar: '/img/makanan/ayam-goreng.jpg', deskripsi: 'Ayam goreng gurih dengan serundeng lengkuas.' },
    { id: 7, id_kategori: 2, nama: 'Ikan Lele Goreng', harga: 8000, gambar: '/img/makanan/lele-goreng.jpg', deskripsi: 'Ikan lele renyah disajikan dengan sambal.' },
    { id: 8, id_kategori: 2, nama: 'Telur Balado', harga: 5000, gambar: '/img/makanan/telur-balado.jpg', deskripsi: 'Telur rebus yang digoreng dan dibalut bumbu balado pedas manis.' },
    { id: 9, id_kategori: 2, nama: 'Ati Ampela Goreng', harga: 6000, gambar: '/img/makanan/ati-ampela.jpg', deskripsi: 'Ati dan ampela ayam yang digoreng dengan bumbu kunyit.' },

    // Sayuran (id_kategori: 3)
    { id: 10, id_kategori: 3, nama: 'Sayur Asem', harga: 5000, gambar: '/img/kategori/sayur-asem.jpg', deskripsi: 'Sayur berkuah segar dengan cita rasa asam, manis, dan pedas.' },
    { id: 11, id_kategori: 3, nama: 'Tumis Kangkung', harga: 5000, gambar: '/img/makanan/tumis-kangkung.jpg', deskripsi: 'Kangkung segar ditumis dengan terasi dan bawang putih.' },
    { id: 12, id_kategori: 3, nama: 'Orek Tempe Basah', harga: 4000, gambar: '/img/makanan/orek-tempe.jpg', deskripsi: 'Potongan tempe dengan bumbu kecap manis yang legit.' },
    { id: 13, id_kategori: 3, nama: 'Sayur Lodeh', harga: 6000, gambar: '/img/makanan/sayur-lodeh.jpg', deskripsi: 'Aneka sayuran seperti labu siam dan terong dalam kuah santan gurih.' },

    // Gorengan (id_kategori: 4)
    { id: 14, id_kategori: 4, nama: 'Bakwan Jagung', harga: 2000, gambar: '/img/makanan/bakwan.jpg', deskripsi: 'Gorengan bakwan dengan jagung manis dan sayuran.' },
    { id: 15, id_kategori: 4, nama: 'Tempe Mendoan', harga: 2000, gambar: '/img/kategori/gorengan.jpg', deskripsi: 'Tempe tipis digoreng dengan adonan tepung basah.' },
    { id: 16, id_kategori: 4, nama: 'Tahu Isi', harga: 2000, gambar: '/img/makanan/tahu-isi.jpg', deskripsi: 'Tahu goreng dengan isian sayuran seperti tauge dan wortel.' }
];

let riwayatPesanan = [
    { id: 'SL-1686927780000', tanggal: '16 Juni 2025', total: 23000, status: 'Selesai', user: 'user@sajilokal.com', items: [{nama: 'Nasi Ayam Bakar', qty: 1}, {nama: 'Bakwan Jagung', qty: 2}] },
    { id: 'SL-1686927840000', tanggal: '17 Juni 2025', total: 34000, status: 'Sedang Diproses', user: 'pelangganlain@example.com', items: [{nama: 'Nasi Rendang', qty: 2}]},
];

let users = [
    { name: 'Admin Warteg', email: 'admin@sajilokal.com', password: 'admin', role: 'admin' },
    { name: 'Pelanggan Setia', email: 'user@sajilokal.com', password: '12345', role: 'user', phone: '081234567890', profilePicture: '/img/avatars/avatar-default.png' }
];

// =================================================================
// 4. MIDDLEWARE PROTEKSI RUTE (HANYA DIDEKLARASIKAN SATU KALI)
// =================================================================
const requireLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        req.flash('error_msg', 'Anda harus login untuk melanjutkan.');
        return res.redirect('/login');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.isLoggedIn || req.session.user.role !== 'admin') {
        req.flash('error_msg', 'Anda tidak memiliki akses ke halaman ini.');
        return res.redirect('/login');
    }
    next();
};

// =================================================================
// 5. RUTE PENGGUNA (CUSTOMER & UMUM)
// =================================================================
app.get('/', (req, res) => res.render('pages/index', { judul: 'SajiLokal', kategori: kategoriMakanan, makanan: semuaMakanan, path: '/' }));
app.get('/kategori', (req, res) => res.render('pages/categories', { judul: 'Kategori', kategori: kategoriMakanan, path: '/kategori' }));
app.get('/kategori/:id', (req, res) => {
    const kategori = kategoriMakanan.find(k => k.id === parseInt(req.params.id));
    if (!kategori) return res.status(404).send('Kategori tidak ditemukan');
    const makananDiKategori = semuaMakanan.filter(m => m.id_kategori === kategori.id);
    res.render('pages/category-foods', { judul: `Kategori: ${kategori.nama}`, kategori: kategori, makanan: makananDiKategori, path: '/kategori' });
});
app.get('/makanan', (req, res) => {
    const { keyword } = req.query;
    const filteredMakanan = keyword ? semuaMakanan.filter(m => m.nama.toLowerCase().includes(keyword.toLowerCase())) : semuaMakanan;
    res.render('pages/foods', { judul: 'Menu Makanan', makanan: filteredMakanan, searchTerm: keyword || '', path: '/makanan' });
});
app.get('/kontak', (req, res) => res.render('pages/contact', { judul: 'Kontak Kami', path: '/kontak' }));

// Rute Keranjang Belanja
app.get('/keranjang', (req, res) => {
    const cart = req.session.cart || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const discountPercent = req.session.discountPercent || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;
    res.render('pages/order', { judul: 'Keranjang Belanja', cart, subtotal, discountAmount, total, path: '/keranjang' });
});

app.post('/keranjang/tambah/:id', (req, res) => {
    const food = semuaMakanan.find(f => f.id === parseInt(req.params.id));
    if (!food) {
        req.flash('error_msg', 'Produk tidak ditemukan!');
        return res.redirect('back');
    }
    const cart = req.session.cart = req.session.cart || [];
    const itemIndex = cart.findIndex(item => item.id === food.id);
    if (itemIndex > -1) cart[itemIndex].qty++;
    else cart.push({ ...food, qty: 1 });
    req.flash('success_msg', `<strong>${food.nama}</strong> ditambahkan.`);
    res.redirect('back');
});

app.post('/keranjang/update/:id', (req, res) => {
    const foodId = parseInt(req.params.id);
    const newQty = parseInt(req.body.quantity);
    const cart = req.session.cart || [];
    const itemIndex = cart.findIndex(item => item.id === foodId);
    if (itemIndex > -1) {
        if (newQty > 0) cart[itemIndex].qty = newQty;
        else cart.splice(itemIndex, 1);
    }
    res.redirect('/keranjang');
});

app.post('/keranjang/kupon', (req, res) => {
    const { coupon_code } = req.body;
    if (coupon_code.toUpperCase() === 'SAJILOKAL10') {
        req.session.discountPercent = 10;
        req.flash('success_msg', 'Kupon diskon 10% berhasil diterapkan!');
    } else {
        req.session.discountPercent = 0;
        req.flash('error_msg', 'Kode kupon tidak valid.');
    }
    res.redirect('/keranjang');
});

app.post('/keranjang/kosongkan', (req, res) => {
    req.session.cart = [];
    req.session.discountPercent = 0;
    req.flash('success_msg', 'Keranjang berhasil dikosongkan.');
    res.redirect('/keranjang');
});

// =================================================================
// 6. RUTE OTENTIKASI DAN PROFIL PENGGUNA
// =================================================================
app.get('/login', (req, res) => res.render('pages/login', { judul: 'Login', path: '/login' }));

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } else {
        req.flash('error_msg', 'Email atau Password salah.');
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.get('/profil', requireLogin, (req, res) => {
    const view = req.query.view || 'info';
    res.render('pages/profil', { judul: 'Dasbor Saya', path: '/profil', currentView: view, orders: riwayatPesanan.filter(o => o.user === req.session.user.email) });
});

app.post('/profil/update', requireLogin, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            req.flash('error_msg', err);
            return res.redirect('/profil');
        }
        const userIndex = users.findIndex(u => u.email === req.session.user.email);
        if (userIndex > -1) {
            users[userIndex].name = req.body.name || users[userIndex].name;
            users[userIndex].email = req.body.email || users[userIndex].email;
            users[userIndex].phone = req.body.phone || users[userIndex].phone;
            if (req.file) {
                users[userIndex].profilePicture = '/img/avatars/' + req.file.filename;
            }
            req.session.user = users[userIndex];
        }
        req.flash('success_msg', 'Profil berhasil diperbarui!');
        res.redirect('/profil');
    });
});

app.get('/pesanan-saya', requireLogin, (req, res) => {
    res.redirect('/profil?view=riwayat');
});

app.get('/pesanan/:id', requireLogin, (req, res) => {
    const orderId = req.params.id;
    const order = riwayatPesanan.find(o => o.id === orderId);
    if (!order) {
        req.flash('error_msg', 'Pesanan tidak ditemukan.');
        return res.redirect('/profil?view=riwayat');
    }
    res.render('pages/detail-pesanan', { judul: `Detail Pesanan ${order.id}`, path: '/profil', order: order });
});

app.post('/checkout', requireLogin, (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        req.flash('error_msg', 'Keranjang Anda kosong, tidak bisa checkout.');
        return res.redirect('/keranjang');
    }
    const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const discountPercent = req.session.discountPercent || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount + 5000;
    const orderItems = cart.map(item => ({ nama: item.nama, qty: item.qty }));
    const newOrder = {
        id: `SL-${Date.now()}`,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        total: total,
        status: 'Sedang Diproses',
        user: req.session.user.email,
        items: orderItems
    };
    riwayatPesanan.unshift(newOrder);
    req.session.cart = [];
    req.session.discountPercent = 0;
    res.redirect('/pesanan-berhasil');
});

app.get('/pesanan-berhasil', requireLogin, (req, res) => {
    res.render('pages/pesanan-berhasil', { judul: 'Pesanan Berhasil', path: '/pesanan-berhasil' });
});

// =================================================================
// 7. RUTE ADMIN
// =================================================================
app.get('/admin/login', (req, res) => res.render('admin/login', { layout: false, judul: 'Login Admin' }));

app.get('/admin', requireAdmin, (req, res) => {
    res.render('admin/dashboard', {
        judul: 'Dasbor Admin',
        path: '/admin/dashboard',
        totalOrders: riwayatPesanan.length,
        totalMenus: semuaMakanan.length,
        totalUsers: users.filter(u => u.role === 'user').length
    });
});

app.get('/admin/orders', requireAdmin, (req, res) => {
    res.render('admin/manage-orders', { judul: 'Kelola Pesanan', path: '/admin/orders', orders: riwayatPesanan });
});

app.post('/admin/orders/update-status/:id', requireAdmin, (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = riwayatPesanan.find(o => o.id === orderId);
    if (order) order.status = status;
    req.flash('success_msg', `Status pesanan ${orderId} berhasil diubah.`);
    res.redirect('/admin/orders');
});

app.get('/admin/menus', requireAdmin, (req, res) => {
    res.render('admin/manage-menus', { judul: 'Kelola Menu', path: '/admin/menus', menus: semuaMakanan, categories: kategoriMakanan });
});

app.post('/admin/menus/add', requireAdmin, (req, res) => {
    const { nama, harga, deskripsi, id_kategori } = req.body;
    const newMenu = { id: Date.now(), nama, harga: parseInt(harga), deskripsi, id_kategori: parseInt(id_kategori), gambar: '/img/makanan/default-food.png' };
    semuaMakanan.push(newMenu);
    req.flash('success_msg', 'Menu baru berhasil ditambahkan.');
    res.redirect('/admin/menus');
});

app.post('/admin/menus/edit/:id', requireAdmin, (req, res) => {
    const menuId = parseInt(req.params.id);
    const { nama, harga, deskripsi, id_kategori } = req.body;
    const menuIndex = semuaMakanan.findIndex(m => m.id === menuId);
    if (menuIndex > -1) {
        semuaMakanan[menuIndex] = { ...semuaMakanan[menuIndex], nama, harga: parseInt(harga), deskripsi, id_kategori: parseInt(id_kategori) };
        req.flash('success_msg', 'Menu berhasil diperbarui.');
    }
    res.redirect('/admin/menus');
});

app.post('/admin/menus/delete/:id', requireAdmin, (req, res) => {
    const menuId = parseInt(req.params.id);
    semuaMakanan = semuaMakanan.filter(m => m.id !== menuId);
    req.flash('success_msg', 'Menu berhasil dihapus.');
    res.redirect('/admin/menus');
});

app.get('/admin/users', requireAdmin, (req, res) => {
    const customers = users.filter(user => user.role === 'user');
    res.render('admin/manage-users', { judul: 'Kelola Pelanggan', path: '/admin/users', customers: customers });
});

// =================================================================
// 8. RUTE FITUR AI (GEMINI)
// =================================================================
app.post('/api/ai-recommendation', async (req, res) => {
    try {
        const popularItems = semuaMakanan.slice(0, 5).map(item => item.nama).join(', ');
        const prompt = `Anda adalah asisten AI dari SajiLokal, sebuah website pesan antar makanan warteg di Indonesia. Berikan satu rekomendasi menu makan malam yang menarik dan menggugah selera untuk satu orang. Gaya bahasamu harus ramah dan sedikit puitis, seolah-olah sedang merekomendasikan masakan rumahan terbaik. Konteks: Menu populer kami saat ini adalah ${popularItems}. Struktur jawaban: 1. Satu paragraf singkat (2-3 kalimat) yang menjelaskan kenapa menu ini cocok untuk malam ini. 2. Sebutkan nama hidangan utama dan satu lauk pendamping dalam format list. Jawaban harus dalam Bahasa Indonesia.`;
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const apiResponse = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!apiResponse.ok) throw new Error(`API call failed with status: ${apiResponse.status}`);
        const result = await apiResponse.json();
        if (result.candidates && result.candidates.length > 0) {
            const recommendationText = result.candidates[0].content.parts[0].text;
            res.json({ success: true, recommendation: recommendationText });
        } else {
            throw new Error('No content received from Gemini API.');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ success: false, message: 'Gagal mendapatkan rekomendasi dari AI.' });
    }
});

// =================================================================
// 9. MENJALANKAN SERVER
// =================================================================
app.listen(PORT, () => console.log(`Server SajiLokal berjalan lancar di http://localhost:${PORT}`));
