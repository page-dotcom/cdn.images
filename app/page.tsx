'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  // States
  const [title, setTitle] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [play, setPlay] = useState(false);
  const [blurSides, setBlurSides] = useState(false);
  const [blurAmount, setBlurAmount] = useState(10);
  const [centerWidth, setCenterWidth] = useState(40);

  // UI States
  const [status, setStatus] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // 1. FITUR ANTI-REFRESH (Load data dari localStorage saat pertama buka)
  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem('streamlite_draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTitle(parsed.title || '');
        setImg1(parsed.img1 || '');
        setImg2(parsed.img2 || '');
        setImg3(parsed.img3 || '');
        setPlay(parsed.play || false);
        setBlurSides(parsed.blurSides || false);
        if (parsed.blurAmount) setBlurAmount(parsed.blurAmount);
        if (parsed.centerWidth) setCenterWidth(parsed.centerWidth);
      } catch (e) {
        console.error('Error parsing draft');
      }
    }
  }, []);

  // 2. FITUR ANTI-REFRESH (Simpan otomatis setiap ada perubahan ketikan)
  useEffect(() => {
    if (isMounted) {
      const draft = { title, img1, img2, img3, play, blurSides, blurAmount, centerWidth };
      localStorage.setItem('streamlite_draft', JSON.stringify(draft));
    }
  }, [title, img1, img2, img3, play, blurSides, blurAmount, centerWidth, isMounted]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('MENGIRIM DATA...');
    setResultUrl('');

    const { data, error } = await supabase
      .from('streamlite_posts')
      .insert([
        { title, image_left: img1, image_center: img2, image_right: img3, show_play: play, blur_sides: blurSides, blur_amount: blurAmount, center_width: centerWidth }
      ])
      .select();

    if (error) {
      setStatus('GAGAL: ' + error.message);
    } else if (data && data.length > 0) {
      setStatus('DATA BERHASIL DISIMPAN');
      const newId = data[0].id;
      // Gunakan URL absolut agar bisa di-copy dan dipakai di web lain
      const baseUrl = window.location.origin;
      const ogUrl = `${baseUrl}/api/og?id=${newId}`;
      setResultUrl(ogUrl);
      
      // Hapus draft setelah berhasil (opsional, saya matikan agar kamu bisa edit ulang jika mau)
      // localStorage.removeItem('streamlite_draft');
    }
  };

  const copyToClipboard = (text: string, type: 'link' | 'html') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  // Mencegah error tampilan Next.js saat load localStorage
  if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: '#fcfcfc' }}></div>;

  // Kode HTML untuk Blogger
  const htmlSnippet = `<h2>${title}</h2>\n<img src="${resultUrl}" style="width:100%; display:none;" alt="${title}" />`;

  // Styles
  // Styles yang sudah dirapikan (pas untuk Mobile & Desktop)
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#555' };
  
  const inputStyle = { width: '100%', padding: '16px', backgroundColor: '#f5f5f5', border: 'none', borderRadius: 0, fontSize: '14px', outline: 'none', color: '#111', boxSizing: 'border-box' as const };
  
  const optionContainerStyle = { padding: '20px', backgroundColor: '#f5f5f5', marginBottom: '5px', boxSizing: 'border-box' as const };
  
  const btnStyle = { padding: '16px 20px', border: 'none', borderRadius: 0, fontSize: '13px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' as const, letterSpacing: '1px', boxSizing: 'border-box' as const };

  
  return (
     <div style={{ display: 'flex', minHeight: '100vh', padding: '50px 20px', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#fcfcfc', boxSizing: 'border-box' }}>
      
      <div style={{ width: '100%', maxWidth: '700px', backgroundColor: '#fff', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        {/* HEADER & LIST BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #111', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
            New Post
          </h1>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="View Post List">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div>
            <label style={labelStyle}>Movie / Post Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title here..." style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Image 1 (Left)</label>
            <input type="url" value={img1} onChange={(e) => setImg1(e.target.value)} placeholder="https://..." style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Image 2 (Center Main)</label>
            <input type="url" value={img2} onChange={(e) => setImg2(e.target.value)} placeholder="https://..." style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Image 3 (Right)</label>
            <input type="url" value={img3} onChange={(e) => setImg3(e.target.value)} placeholder="https://..." style={inputStyle} required />
          </div>

          {/* ADVANCED SETTINGS */}
          <div style={{ marginTop: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Layout Settings</h3>
            
            <div style={optionContainerStyle}>
               <label style={labelStyle}>Center Width: {centerWidth}%</label>
               <input type="range" min="30" max="70" value={centerWidth} onChange={(e) => setCenterWidth(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
            </div>

            <div style={optionContainerStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: blurSides ? '20px' : '0' }}>
                  <input type="checkbox" checked={blurSides} onChange={(e) => setBlurSides(e.target.checked)} style={{ width: '22px', height: '22px', cursor: 'pointer' }} id="blurCheck"/>
                  <label htmlFor="blurCheck" style={{ fontSize: '14px', fontWeight: 700, cursor: 'pointer', margin: 0 }}>Apply Blur to Left & Right Images</label>
              </div>
              {blurSides && (
                  <div>
                   <label style={{...labelStyle, color: '#666'}}>Blur Intensity: {blurAmount}px</label>
                   <input type="range" min="1" max="30" value={blurAmount} onChange={(e) => setBlurAmount(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                  </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', backgroundColor: '#ececec' }}>
              <input type="checkbox" checked={play} onChange={(e) => setPlay(e.target.checked)} style={{ width: '22px', height: '22px', cursor: 'pointer' }} id="playCheck"/>
              <label htmlFor="playCheck" style={{ fontSize: '14px', fontWeight: 700, cursor: 'pointer', margin: 0 }}>Add Red Play Button</label>
            </div>
          </div>

          <button type="submit" style={{ ...btnStyle, marginTop: '20px', backgroundColor: '#111', color: '#fff', width: '100%', padding: '22px' }}>
            GENERATE IMAGE
          </button>

          {/* STATUS TEXT (Menggantikan Alert) */}
          {status && (
            <div style={{ padding: '15px', backgroundColor: resultUrl ? '#e8f5e9' : '#111', color: resultUrl ? '#1b5e20' : '#fff', fontSize: '13px', fontWeight: 700, textAlign: 'center', letterSpacing: '1px' }}>
              {status}
            </div>
          )}
        </form>

        {/* AREA HASIL - Muncul hanya jika sukses */}
        {resultUrl && (
          <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: '2px solid #f5f5f5' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Result & Export</h2>
            
            {/* Action Buttons for URL */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
              <a href={resultUrl} target="_blank" rel="noreferrer" style={{ ...btnStyle, backgroundColor: '#111', color: '#fff', textDecoration: 'none', textAlign: 'center', flex: 1 }}>
                LIHAT GAMBAR
              </a>
              <button onClick={() => copyToClipboard(resultUrl, 'link')} style={{ ...btnStyle, backgroundColor: '#f5f5f5', color: '#111', flex: 1 }}>
                {copiedLink ? 'COPIED!' : 'COPY IMAGE URL'}
              </button>
            </div>

            {/* Kode HTML untuk Blogger */}
            <div style={{ backgroundColor: '#111', padding: '20px', boxSizing: 'border-box', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px' }}>HTML CODE (BLOGGER)</span>
                <button onClick={() => copyToClipboard(htmlSnippet, 'html')} style={{ ...btnStyle, backgroundColor: '#fff', color: '#111', padding: '8px 12px', fontSize: '11px' }}>
                  {copiedHtml ? 'COPIED!' : 'COPY HTML'}
                </button>
              </div>
              
              {/* Textarea dibedakan warnanya sedikit agar kontras dengan background hitam */}
              <textarea 
                readOnly 
                value={htmlSnippet}
                style={{ width: '100%', height: '100px', backgroundColor: '#1a1a1a', color: '#00ffcc', border: 'none', padding: '15px', fontSize: '13px', fontFamily: 'monospace', resize: 'none', outline: 'none', boxSizing: 'border-box', margin: 0 }}
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
