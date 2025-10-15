import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url', { status: 400 });
  }

  const fetchRemote = async (remoteUrl: string) => {
    return fetch(remoteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
      cache: 'no-store',
    });
  };

  try {
    // 1) Try direct image fetch first
    let resp = await fetchRemote(url);

    const contentType = resp.headers.get('content-type') || '';
    if (resp.ok && resp.body && contentType.startsWith('image/')) {
      return new NextResponse(resp.body, {
        status: 200,
        headers: {
          'content-type': contentType,
          'cache-control': 'public, max-age=86400',
        },
      });
    }

    // 2) If HTML page was provided, try to extract og:image
    if (resp.ok && contentType.includes('text/html')) {
      const html = await resp.text();
      const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i)
        || html.match(/<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i)
        || html.match(/<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["'][^>]*>/i)
        || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i)
        || html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i);

      const candidate = match?.[1];
      if (candidate) {
        resp = await fetchRemote(candidate);
        const ct = resp.headers.get('content-type') || '';
        if (resp.ok && resp.body && ct.startsWith('image/')) {
          return new NextResponse(resp.body, {
            status: 200,
            headers: {
              'content-type': ct,
              'cache-control': 'public, max-age=86400',
            },
          });
        }
      }
    }

    // 3) Fallback placeholder
    return NextResponse.redirect('https://via.placeholder.com/300?text=No+Image', 302);
  } catch (e) {
    return NextResponse.redirect('https://via.placeholder.com/300?text=No+Image', 302);
  }
}
