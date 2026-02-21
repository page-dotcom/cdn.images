'use client';

import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Cek apakah sebelumnya sudah pernah login
  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem('streamlite_access') === 'granted') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    setStatus('VERIFYING...');
    
    
    const secretKey = process.env.NEXT_PUBLIC_PASSWORD || '';

    // Memberi sedikit jeda agar terasa seperti aplikasi sungguhan
    setTimeout(() => {
      if (password === secretKey) {
        localStorage.setItem('streamlite_access', 'granted');
        setStatus('ACCESS GRANTED');
        setTimeout(() => setIsLoggedIn(true), 600); // Masuk ke aplikasi
      } else {
        setStatus('ACCESS DENIED!');
        setTimeout(() => setStatus(''), 2500); // Notif hilang dalam 2.5 detik
      }
    }, 800);
  };

  // Mencegah kedipan layar putih sebelum pengecekan selesai
  if (!isMounted) {
    return (
      <html lang="en">
        <body style={{ margin: 0, backgroundColor: '#000' }}></body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fcfcfc', color: '#111' }} className={inter.className}>
        {isLoggedIn ? (
          // Jika sudah login, tampilkan halaman Form atau List
          children
        ) : (
          // Jika belum login, tampilkan Layar Login ini
          <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
            
            <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '50px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', boxSizing: 'border-box' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" style={{ marginBottom: '15px' }}>
                  <rect x="3" y="11" width="18" height="11" rx="0" ry="0"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '3px', textTransform: 'uppercase' }}>
                  Restricted
                </h1>
              </div>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, marginBottom: '10px', letterSpacing: '2px', color: '#555', textTransform: 'uppercase', textAlign: 'center' }}>
                    Enter Access Key
                  </label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '18px', backgroundColor: '#f5f5f5', border: 'none', borderRadius: 0, fontSize: '20px', outline: 'none', color: '#111', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '4px' }}
                    required
                  />
                </div>

                <button type="submit" style={{ padding: '20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 0, fontSize: '12px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  UNLOCK SYSTEM
                </button>

                {/* AREA NOTIFIKASI STATUS */}
                {status && (
                  <div style={{ padding: '15px', backgroundColor: status === 'ACCESS GRANTED' ? '#e8f5e9' : '#111', color: status === 'ACCESS GRANTED' ? '#1b5e20' : '#fff', fontSize: '11px', fontWeight: 800, textAlign: 'center', letterSpacing: '1.5px', marginTop: '-5px' }}>
                    {status}
                  </div>
                )}

              </form>
            </div>
            
          </div>
        )}
      </body>
    </html>
  );
}
