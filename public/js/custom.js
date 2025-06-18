document.addEventListener('DOMContentLoaded', () => {

    // Logic untuk Mobile Menu (Hamburger)
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu ul');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            // Ganti ikon bars menjadi close (X) saat menu aktif
            const icon = menuToggle.querySelector('i');
            if (menu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Menghilangkan notifikasi flash setelah beberapa detik
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(flash => {
        setTimeout(() => {
            flash.style.opacity = '0';
            flash.style.transform = 'translate(-50%, -20px)';
        }, 4000); // Pesan akan hilang setelah 4 detik
    });
    
    // Inisialisasi AOS (Animate On Scroll)
    AOS.init({
        duration: 800, // durasi animasi
        once: true, // animasi hanya terjadi sekali
        offset: 50, // trigger animasi sedikit sebelum elemen terlihat
    });

});
