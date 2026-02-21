export default function NotFound() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: '50px 20px', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fcfcfc', boxSizing: 'border-box' }}>
      
      <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#fff', padding: '60px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', boxSizing: 'border-box', textAlign: 'center' }}>
        
        {/* Angka 404 Raksasa */}
        <h1 style={{ fontSize: '80px', fontWeight: 900, margin: '0 0 10px 0', letterSpacing: '5px', color: '#111', lineHeight: 1 }}>
          404
        </h1>

        {/* Sub-judul */}
        <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 40px 0', letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>
          Page Not Found
        </h2>

        {/* Garis pemisah tegas */}
        <div style={{ width: '50px', height: '4px', backgroundColor: '#111', margin: '0 auto 40px auto' }}></div>

        {/* Pesan */}
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '40px', lineHeight: '1.6', fontWeight: 600 }}>
          Sistem tidak dapat menemukan halaman yang kamu cari. Halaman mungkin telah dihapus atau URL yang dimasukkan salah.
        </p>

        {/* Tombol Kembali yang datar dan tegas */}
        <a href="/" style={{ display: 'inline-block', width: '100%', padding: '20px', backgroundColor: '#111', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', boxSizing: 'border-box' }}>
          RETURN TO HOME
        </a>

      </div>
      
    </div>
  );
}
