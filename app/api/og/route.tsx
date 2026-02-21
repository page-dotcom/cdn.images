import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// Panggil kunci Supabase (Vercel otomatis membaca ini dari Environment Variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Jika tidak ada ID di URL, tampilkan error
    if (!id) return new Response('Masukkan ID post', { status: 400 });

    // Ambil data langsung dari Supabase berdasarkan ID
    const { data, error } = await supabase
      .from('streamlite_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return new Response('Data tidak ditemukan', { status: 404 });

    const { image_left, image_center, image_right, show_play } = data;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%', // Tinggi penuh
            backgroundColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Gambar 1 (Kiri - 30%) */}
          <div style={{ display: 'flex', width: '30%', height: '100%' }}>
            <img src={image_left} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Gambar 2 (Tengah - 40% - Lebih Lebar) */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: '40%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <img src={image_center} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            {show_play && (
              <svg width="100" height="100" viewBox="0 0 24 24" fill="white" style={{ position: 'absolute' }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>

          {/* Gambar 3 (Kanan - 30%) */}
          <div style={{ display: 'flex', width: '30%', height: '100%' }}>
            <img src={image_right} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
