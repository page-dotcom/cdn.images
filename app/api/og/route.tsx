import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'No Title';
    const img1 = searchParams.get('img1');
    const img2 = searchParams.get('img2');
    const img3 = searchParams.get('img3');
    const showPlay = searchParams.get('play') === 'true';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#111',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Container untuk 3 Gambar */}
          <div style={{ display: 'flex', width: '100%', height: '80%', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Kiri */}
            <div style={{ display: 'flex', width: '30%', height: '80%' }}>
              {img1 && <img src={img1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>

            {/* Tengah (Lebih Besar) */}
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
              {img2 && <img src={img2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              
              {showPlay && (
                <svg width="100" height="100" viewBox="0 0 24 24" fill="white" style={{ position: 'absolute' }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>

            {/* Kanan */}
            <div style={{ display: 'flex', width: '30%', height: '80%' }}>
              {img3 && <img src={img3} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            
          </div>

          {/* Container untuk Title di bawah gambar */}
          <div style={{ display: 'flex', height: '20%', width: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 40, fontWeight: 700, letterSpacing: '2px' }}>
            {title}
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
