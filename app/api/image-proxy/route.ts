import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url', { status: 400 });
  }

  try {
    const resp = await fetch(url, {
      headers: {
        // Some CDNs require a UA; keep it generic
        'User-Agent': 'Mozilla/5.0 (compatible; DropshipHelper/1.0)'
      },
      // Avoid passing cookies
      redirect: 'follow',
      cache: 'no-store'
    });

    if (!resp.ok || !resp.body) {
      return NextResponse.redirect('https://via.placeholder.com/300?text=Image+Unavailable', 302);
    }

    const contentType = resp.headers.get('content-type') || 'image/jpeg';
    return new NextResponse(resp.body, {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=86400',
      },
    });
  } catch (e) {
    return NextResponse.redirect('https://via.placeholder.com/300?text=Image+Unavailable', 302);
  }
}
