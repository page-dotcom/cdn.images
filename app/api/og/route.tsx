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
            flexDirection: 'row', // <-- INI KUNCI PERBAIKANNYA
            width: '100%',
            height: '100%',
            backgroundColor: '#111', // Warna gelap yang elegan
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Gambar 1 (Kiri - 30%) */}
          <div style={{ display: 'flex', width: '30%', height: '100%' }}>
            {image_left ? (
              <img src={image_left} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : null}
          </div>

          {/* Gambar 2 (Tengah - 40%) */}
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
            {image_center ? (
              <img src={image_center} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : null}
            
            {show_play && (
              <svg width="100" height="100" viewBox="0 0 24 24" fill="white" style={{ position: 'absolute' }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>

          {/* Gambar 3 (Kanan - 30%) */}
          <div style={{ display: 'flex', width: '30%', height: '100%' }}>
            {image_right ? (
              <img src={image_right} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
