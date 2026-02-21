'use client';

import { useState } from 'react';
import { supabase } from './supabase';

export default function Home() {
  const [title, setTitle] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [play, setPlay] = useState(false);
  const [status, setStatus] = useState('');
  const [resultUrl, setResultUrl] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('Mengirim data...');
    setResultUrl('');

    // Kirim data ke tabel streamlite_posts di Supabase
    const { data, error } = await supabase
      .from('streamlite_posts')
      .insert([
        {
          title: title,
          image_left: img1,
          image_center: img2,
          image_right: img3,
          show_play: play
        }
      ]);

    if (error) {
      setStatus('Gagal: ' + error.message);
    } else {
      setStatus('Data berhasil disimpan!');
      
      // Membuat URL Vercel OG untuk melihat hasilnya langsung
      const ogUrl = `/api/og?title=${encodeURIComponent(title)}&img1=${encodeURIComponent(img1)}&img2=${encodeURIComponent(img2)}&img3=${encodeURIComponent(img3)}&play=${play}`;
      setResultUrl(ogUrl);
      
      // Kosongkan form setelah sukses (opsional)
      setTitle(''); setImg1(''); setImg2(''); setImg3(''); setPlay(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: '40px', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '40px' }}>
          Add New Post
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              style={{ width: '100%', padding: '16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: 0, fontSize: '16px', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Image URL 1 (Left)</label>
            <input 
              type="url" 
              value={img1}
              onChange={(e) => setImg1(e.target.value)}
              placeholder="https://..."
              style={{ width: '100%', padding: '16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: 0, fontSize: '16px', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Image URL 2 (Center - Main)</label>
            <input 
              type="url" 
              value={img2}
              onChange={(e) => setImg2(e.target.value)}
              placeholder="https://..."
              style={{ width: '100%', padding: '16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: 0, fontSize: '16px', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Image URL 3 (Right)</label>
            <input 
              type="url" 
              value={img3}
              onChange={(e) => setImg3(e.target.value)}
              placeholder="https://..."
              style={{ width: '100%', padding: '16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: 0, fontSize: '16px', outline: 'none' }}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', backgroundColor: '#f0f0f0' }}>
            <input 
              type="checkbox" 
              checked={play}
              onChange={(e) => setPlay(e.target.checked)}
              style={{ width: '20px', height: '20px', border: 'none', borderRadius: 0, outline: 'none' }}
            />
            <label style={{ fontSize: '14px', fontWeight: 500 }}>Include SVG Play Button</label>
          </div>

          <button 
            type="submit" 
            style={{ marginTop: '20px', padding: '20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 0, fontSize: '16px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
            SUBMIT DATA
          </button>

          {/* Status dan Hasil Link Gambar akan muncul di sini tanpa mengubah desain form */}
          {status && (
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: resultUrl ? '#e6ffe6' : '#ffe6e6', color: '#111', fontSize: '14px', fontWeight: 500 }}>
              {status}
            </div>
          )}

          {resultUrl && (
            <div style={{ marginTop: '10px' }}>
              <a 
                href={resultUrl} 
                target="_blank" 
                rel="noreferrer"
                style={{ display: 'inline-block', padding: '16px', backgroundColor: '#111', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
              >
                LIHAT GAMBAR HASIL GENERATE
              </a>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
