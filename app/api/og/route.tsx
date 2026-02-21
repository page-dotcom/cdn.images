import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return new Response('Masukkan ID post', { status: 400 });

    // Ambil semua data termasuk settingan baru
    const { data, error } = await supabase
      .from('streamlite_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return new Response('Data tidak ditemukan', { status: 404 });

    // Destructure data settingan baru
    const { 
      image_left, 
      image_center, 
      image_right, 
      show_play,
      blur_sides,
      blur_amount,
      center_width
    } = data;

    // --- LOGIKA MENGHITUNG LEBAR DINAMIS ---
    // Pastikan ada nilai default jika data kosong
    const cWidthVal = center_width || 40; 
    const bAmountVal = blur_amount || 10;

    // Hitung sisa lebar untuk sisi kiri dan kanan
    // Contoh: Jika tengah 60%, sisa 40%. Kiri dan Kanan masing-masing dapat 20%.
    const sideWidthVal = (100 - cWidthVal) / 2;

    // Buat string persentase untuk style
    const centerWidthStyle = `${cWidthVal}%`;
    const sideWidthStyle = `${sideWidthVal}%`;

    // Style CSS untuk efek blur
    const blurStyle = blur_sides ? `blur(${bAmountVal}px)` : 'none';


    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            backgroundColor: '#000', // Background hitam agar efek blur terlihat rapi di pinggir
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Gambar 1 (Kiri) - Lebar Dinamis & Blur */}
          <div style={{ display: 'flex', width: sideWidthStyle, height: '100%', overflow: 'hidden' }}>
            {image_left ? (
              <img 
                src={image_left} 
                // Terapkan filter blur di sini. Tambahkan scale sedikit (1.1) agar pinggiran blur tidak terlihat putih
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: blurStyle, transform: blur_sides ? 'scale(1.1)' : 'none' }} 
              />
            ) : null}
          </div>

          {/* Gambar 2 (Tengah) - Lebar Dinamis & Play Button Merah Besar */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: centerWidthStyle, // Lebar diatur di sini
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              boxShadow: '0px 0px 50px rgba(0,0,0,0.5)', // Opsional: Sedikit bayangan agar gambar tengah lebih "pop-up"
            }}
          >
            {image_center ? (
              <img src={image_center} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : null}
            
            {show_play && (
              // UPDATE: Tombol Play Merah (fill="red") dan Lebih Besar (width="160")
              <svg width="160" height="160" viewBox="0 0 24 24" fill="red" style={{ position: 'absolute', filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.5))' }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>

          {/* Gambar 3 (Kanan) - Lebar Dinamis & Blur */}
          <div style={{ display: 'flex', width: sideWidthStyle, height: '100%', overflow: 'hidden' }}>
            {image_right ? (
              <img 
                src={image_right} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: blurStyle, transform: blur_sides ? 'scale(1.1)' : 'none' }} 
              />
            ) : null}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
