'use client';

import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [play, setPlay] = useState(false);

  // Nantinya fungsi ini akan kita ubah untuk kirim data ke Supabase
  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert('Data siap dikirim ke Supabase! (Kita bahas di tahap selanjutnya)');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: '40px', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '40px' }}>
          Add New Post
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Input Title */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Movie or Post Title"
              style={{ width: '100%', padding: '16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: 0, fontSize: '16px', outline: 'none' }}
              required
            />
          </div>

          {/* Input Gambar 1 */}
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

          {/* Input Gambar 2 (Center) */}
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

          {/* Input Gambar 3 */}
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

          {/* Checkbox Play Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', backgroundColor: '#f0f0f0' }}>
            <input 
              type="checkbox" 
              checked={play}
              onChange={(e) => setPlay(e.target.checked)}
              style={{ width: '20px', height: '20px', border: 'none', borderRadius: 0, outline: 'none' }}
            />
            <label style={{ fontSize: '14px', fontWeight: 500 }}>Include SVG Play Button on Center Image</label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={{ marginTop: '20px', padding: '20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 0, fontSize: '16px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
            SUBMIT DATA
          </button>

        </form>
      </div>
    </div>
  );
}
