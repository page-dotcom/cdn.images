'use client';

import { useState } from 'react';
import { supabase } from './supabase';

export default function Home() {
  const [title, setTitle] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [play, setPlay] = useState(false);
  
  // State baru untuk fitur Blur dan Lebar
  const [blurSides, setBlurSides] = useState(false);
  const [blurAmount, setBlurAmount] = useState(10); // Range 1-20
  const [centerWidth, setCenterWidth] = useState(40); // Range 30-70 persen

  const [status, setStatus] = useState('');
  const [resultUrl, setResultUrl] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('Mengirim data...');
    setResultUrl('');

    const { data, error } = await supabase
      .from('streamlite_posts')
      .insert([
        {
          title: title,
          image_left: img1,
          image_center: img2,
          image_right: img3,
          show_play: play,
          // Masukkan settingan baru ke database
          blur_sides: blurSides,
          blur_amount: blurAmount,
          center_width: centerWidth
        }
      ])
      .select();

    if (error) {
      setStatus('Gagal: ' + error.message);
    } else if (data && data.length > 0) {
      setStatus('Data berhasil disimpan! Tunggu sebentar...');
      const newId = data[0].id;
      // URL tetap bersih dan pendek
      const ogUrl = `/api/og?id=${newId}`;
      setResultUrl(ogUrl);
      
      // Reset form (opsional)
      // setTitle(''); setImg1(''); setImg2(''); setImg3(''); setPlay(false); setBlurSides(false); setCenterWidth(40);
    }
  };

  // Style untuk label input
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' as const };
  // Style untuk input text
  const inputStyle = { width: '100%', padding: '16px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: 0, fontSize: '16px', outline: 'none' };
  // Style untuk container checkbox/slider
  const optionContainerStyle = { padding: '16px', backgroundColor: '#f0f0f0', marginBottom: '20px' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: '40px', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '30px' }}>
          Add New Post + Settings
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={labelStyle}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Image URL 1 (Left)</label>
            <input type="url" value={img1} onChange={(e) => setImg1(e.target.value)} placeholder="https://..." style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Image URL 2 (Center - Main)</label>
            <input type="url" value={img2} onChange={(e) => setImg2(e.target.value)} placeholder="https://..." style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Image URL 3 (Right)</label>
            <input type="url" value={img3} onChange={(e) => setImg3(e.target.value)} placeholder="https://..." style={inputStyle} required />
          </div>

          {/* --- BAGIAN SETTING BARU --- */}
          <div style={optionContainerStyle}>
             <label style={labelStyle}>Center Image Width: {centerWidth}%</label>
             <input 
                type="range" min="30" max="70" value={centerWidth} 
                onChange={(e) => setCenterWidth(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
             />
             <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Geser untuk melebarkan gambar tengah ke samping.</p>
          </div>

          <div style={optionContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: blurSides ? '15px' : '0' }}>
                <input type="checkbox" checked={blurSides} onChange={(e) => setBlurSides(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} id="blurCheck"/>
                <label htmlFor="blurCheck" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Blur Side Images (Left & Right)</label>
            </div>
            
            {/* Slider Blur Adjustment hanya muncul jika checkbox dicentang */}
            {blurSides && (
                <div>
                 <label style={{...labelStyle, fontSize: '12px', marginBottom: '5px'}}>Blur Intensity: {blurAmount}px</label>
                 <input 
                    type="range" min="1" max="30" value={blurAmount} 
                    onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer' }}
                 />
                </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', backgroundColor: '#f0f0f0' }}>
            <input type="checkbox" checked={play} onChange={(e) => setPlay(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} id="playCheck"/>
            <label htmlFor="playCheck" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Include Red Play Button (Center)</label>
          </div>
          {/* --- END BAGIAN SETTING BARU --- */}


          <button type="submit" style={{ marginTop: '10px', padding: '20px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
            SUBMIT DATA & GENERATE
          </button>

          {status && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: resultUrl ? '#d4edda' : '#f8d7da', color: resultUrl ? '#155724' : '#721c24', fontSize: '14px', fontWeight: 500 }}>
              {status}
            </div>
          )}

          {resultUrl && (
            <div style={{ marginTop: '10px' }}>
              <a href={resultUrl} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', padding: '15px', backgroundColor: '#111', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
                KLIK UNTUK MELIHAT HASIL GAMBAR
              </a>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
