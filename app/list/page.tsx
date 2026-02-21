'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function ListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const ITEMS_PER_PAGE = 5;

  const fetchPosts = async (currentPage: number) => {
    setLoading(true);
    const from = currentPage * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Ambil data + 1 untuk mengecek apakah masih ada data di halaman berikutnya
    const { data, error } = await supabase
      .from('streamlite_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to + 1);

    if (error) {
      setStatusMessage('GAGAL MEMUAT DATA: ' + error.message);
    } else {
      if (data && data.length > ITEMS_PER_PAGE) {
        setHasMore(true);
        setPosts(data.slice(0, ITEMS_PER_PAGE));
      } else {
        setHasMore(false);
        setPosts(data || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    setStatusMessage('MENGHAPUS DATA...');
    const { error } = await supabase.from('streamlite_posts').delete().eq('id', id);
    if (error) {
      setStatusMessage('GAGAL MENGHAPUS: ' + error.message);
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
      setStatusMessage('DATA BERHASIL DIHAPUS!');
      fetchPosts(page); // Muat ulang tabel
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleCopy = (id: string) => {
    const url = `${window.location.origin}/api/og?id=${id}`;
    navigator.clipboard.writeText(url);
    setStatusMessage('URL GAMBAR BERHASIL DISALIN!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Styles
  const btnStyle = { padding: '12px 16px', border: 'none', borderRadius: 0, fontSize: '11px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' as const, letterSpacing: '1px', boxSizing: 'border-box' as const };
  const thStyle = { padding: '16px', textAlign: 'left' as const, borderBottom: '2px solid #111', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#555' };
  const tdStyle = { padding: '16px', borderBottom: '1px solid #eee', fontSize: '14px', color: '#111' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: '50px 20px', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#fcfcfc', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '900px', backgroundColor: '#fff', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
        
        {/* HEADER & HOME BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #111', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
            List Posts
          </h1>
          {/* Tombol Home untuk kembali ke form */}
          <a href="/" style={{ color: '#111', textDecoration: 'none' }} title="Back to Home">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </a>
        </div>

        {/* STATUS NOTIFICATION (Ganti Alert JS) */}
        {statusMessage && (
          <div style={{ padding: '15px', marginBottom: '20px', backgroundColor: statusMessage.includes('GAGAL') ? '#111' : '#e8f5e9', color: statusMessage.includes('GAGAL') ? '#fff' : '#1b5e20', fontSize: '12px', fontWeight: 800, textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {statusMessage}
          </div>
        )}

        {/* TABLE AREA (Scrollable & Fixed Layout) */}
        <div style={{ width: '100%', overflowX: 'auto', marginBottom: '30px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '100px' }}>Image</th>
                <th style={{ ...thStyle, width: '120px' }}>Date</th>
                <th style={thStyle}>Title</th>
                <th style={{ ...thStyle, width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', padding: '40px', fontWeight: 700 }}>LOADING DATA...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', padding: '40px', fontWeight: 700 }}>TIDAK ADA DATA</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} style={{ transition: 'background-color 0.2s' }}>
                    
                    {/* Kolom Gambar */}
                    <td style={tdStyle}>
                      <img src={post.image_center} alt="Preview" style={{ width: '80px', height: '45px', objectFit: 'cover', backgroundColor: '#eee', display: 'block' }} />
                    </td>

                    {/* Kolom Tanggal (Baru) */}
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: '#666', fontSize: '12px', fontWeight: 700 }}>
                      {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Kolom Judul (Dengan efek ellipsis ...) */}
                    <td style={tdStyle}>
                      <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 800 }}>
                        {post.title}
                      </div>
                    </td>

                    {/* Kolom Aksi */}
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleCopy(post.id)} style={{ ...btnStyle, backgroundColor: '#f5f5f5', color: '#111' }}>
                          COPY URL
                        </button>
                        <button onClick={() => { if(window.confirm('Yakin ingin menghapus post ini?')) handleDelete(post.id) }} style={{ ...btnStyle, backgroundColor: '#111', color: '#fff' }}>
                          DELETE
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION (PREV & NEXT) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #f5f5f5', paddingTop: '20px' }}>
          <button 
            onClick={() => setPage((p) => Math.max(0, p - 1))} 
            disabled={page === 0 || loading}
            style={{ ...btnStyle, backgroundColor: page === 0 ? '#fafafa' : '#111', color: page === 0 ? '#ccc' : '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
          >
            PREV PAGE
          </button>
          
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#555', letterSpacing: '1px' }}>
            PAGE {page + 1}
          </span>

          <button 
            onClick={() => setPage((p) => p + 1)} 
            disabled={!hasMore || loading}
            style={{ ...btnStyle, backgroundColor: !hasMore ? '#fafafa' : '#111', color: !hasMore ? '#ccc' : '#fff', cursor: !hasMore ? 'not-allowed' : 'pointer' }}
          >
            NEXT PAGE
          </button>
        </div>

      </div>
    </div>
  );
}
