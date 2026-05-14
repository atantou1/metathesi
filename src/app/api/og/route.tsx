import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Δυναμικές παράμετροι ή προεπιλογές
    const title = searchParams.get('title') || 'metaThesi';
    const description = searchParams.get('desc') || 'Βάλε την αναζήτηση στον αυτόματο πιλότο. Η πρώτη πλατφόρμα αμοιβαίων μεταθέσεων.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to bottom right, #0ea5e9, #3b82f6)',
              padding: '60px 80px',
              borderRadius: '40px',
              boxShadow: '0 20px 40px rgba(14, 165, 233, 0.2)',
              maxWidth: '80%',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 20 ? 50 : 70,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 20,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 30,
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
                maxWidth: '90%',
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          </div>
          
          {/* Footer Logo */}
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 'bold', color: '#0ea5e9', letterSpacing: '-0.05em' }}>
              meta<span style={{ color: '#0f172a' }}>Thesi</span>
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
