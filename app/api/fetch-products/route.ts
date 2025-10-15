import { NextRequest, NextResponse } from 'next/server';
import { generateTopRatedProducts } from '@/lib/xai';
import { generateMockTopRatedProducts } from '@/lib/mock-products';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { productName } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    const apiKey = process.env.XAI_API_KEY || process.env.NEXT_PUBLIC_XAI_API_KEY;
    
    let productsResult: string;
    if (!apiKey) {
      console.warn('No XAI API key found, using mock data');
      productsResult = generateMockTopRatedProducts(productName);
    } else {
      // Call xAI API to fetch top-rated products
      productsResult = await generateTopRatedProducts(productName);
      
      if (!productsResult) {
        throw new Error('Failed to get products from xAI');
      }
    }

    // Parse the JSON response
    let productsData;
    try {
      productsData = JSON.parse(productsResult);
    } catch (parseError) {
      console.error('Failed to parse xAI response:', productsResult);
      // Try to extract JSON from the response
      const firstBrace = productsResult.indexOf('{');
      const lastBrace = productsResult.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        productsData = JSON.parse(productsResult.substring(firstBrace, lastBrace + 1));
      } else {
        throw new Error('Invalid response format from xAI');
      }
    }

    // Normalize product URLs to ensure real, clickable links per platform
    const normalizePlatform = (platform: string | undefined) => {
      if (!platform) return '';
      const key = platform.toLowerCase();
      if (key.includes('aliexpress')) return 'aliexpress';
      if (key.includes('amazon')) return 'amazon';
      if (key.includes('ebay')) return 'ebay';
      if (key.includes('walmart')) return 'walmart';
      if (key.includes('dhgate')) return 'dhgate';
      if (key.includes('banggood')) return 'banggood';
      if (key.includes('alibaba')) return 'alibaba';
      return key;
    };

    const isValidProductUrlForPlatform = (platformKey: string, urlString: string | undefined) => {
      if (!urlString) return false;
      try {
        const u = new URL(urlString);
        const host = u.hostname.toLowerCase();
        const path = u.pathname.toLowerCase();

        switch (platformKey) {
          case 'aliexpress':
            return /aliexpress\.(com|us|ru)$/.test(host) || host.endsWith('.aliexpress.com')
              ? (path.includes('/item/') || path.startsWith('/i/'))
              : false;
          case 'amazon':
            return host.includes('amazon.') && (path.includes('/dp/') || path.includes('/gp/product/'));
          case 'ebay':
            return host.includes('ebay.') && path.includes('/itm/');
          case 'walmart':
            return host.includes('walmart.com') && path.includes('/ip/');
          case 'dhgate':
            return host.includes('dhgate.com') && path.includes('/product/');
          case 'banggood':
            return host.includes('banggood.com') && (/\-p-\d+\.html$/.test(path) || path.includes('/product/'));
          case 'alibaba':
            return host.includes('alibaba.com') && (path.includes('/product-detail/') || path.includes('/offer/'));
          default:
            // Fallback: ensure it is a valid https URL
            return u.protocol === 'https:';
        }
      } catch {
        return false;
      }
    };

    const buildSearchUrl = (platformKey: string, name: string) => {
      const q = encodeURIComponent(name);
      switch (platformKey) {
        case 'aliexpress':
          return `https://www.aliexpress.com/wholesale?SearchText=${q}`;
        case 'amazon':
          return `https://www.amazon.com/s?k=${q}`;
        case 'ebay':
          return `https://www.ebay.com/sch/i.html?_nkw=${q}`;
        case 'walmart':
          return `https://www.walmart.com/search?q=${q}`;
        case 'dhgate':
          return `https://www.dhgate.com/wholesale/search.do?act=search&searchkey=${q}`;
        case 'banggood':
          return `https://www.banggood.com/search/${q}.html`;
        case 'alibaba':
          return `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=${q}`;
        default:
          return `https://www.google.com/search?q=${q}`;
      }
    };

    // Build product URL from product ID
    const buildProductUrl = (platformKey: string, productId: string | undefined, productName: string) => {
      if (!productId) {
        return buildSearchUrl(platformKey, productName);
      }

      switch (platformKey) {
        case 'aliexpress':
          // AliExpress item URLs
          return `https://www.aliexpress.com/item/${productId}.html`;
        case 'amazon':
          // Amazon ASIN URLs
          return `https://www.amazon.com/dp/${productId}`;
        case 'ebay':
          // eBay item URLs
          return `https://www.ebay.com/itm/${productId}`;
        case 'walmart':
          // Walmart item URLs
          return `https://www.walmart.com/ip/product/${productId}`;
        case 'dhgate':
          // DHgate uses slugs in URLs
          return `https://www.dhgate.com/product/${productId}.html`;
        case 'banggood':
          // Banggood product URLs
          return `https://www.banggood.com/product-p-${productId}.html`;
        case 'alibaba':
          // Alibaba product URLs
          return `https://www.alibaba.com/product-detail/${productId}.html`;
        default:
          return buildSearchUrl(platformKey, productName);
      }
    };

    // Utility to extract OG/Twitter image from HTML
    const extractImageFromHtml = (html: string): string | null => {
      const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      if (ogMatch?.[1]) return ogMatch[1];
      const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      if (twMatch?.[1]) return twMatch[1];
      return null;
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const ensureLiveImage = async (urlString: string | undefined): Promise<string | null> => {
      if (!urlString) return null;
      try {
        const res = await fetch(urlString, {
          method: 'HEAD',
          signal: controller.signal,
        });
        if (res.ok) return urlString;
      } catch (_) {
        // ignore and fallback
      }
      return null;
    };

    const tryFetchOgImage = async (pageUrl: string | undefined): Promise<string | null> => {
      if (!pageUrl) return null;
      try {
        const htmlRes = await fetch(pageUrl, {
          headers: { 'accept': 'text/html' },
          signal: controller.signal,
        });
        if (!htmlRes.ok) return null;
        const html = await htmlRes.text();
        const found = extractImageFromHtml(html);
        if (found) {
          const ok = await ensureLiveImage(found);
          if (ok) return ok;
        }
      } catch (_) {
        // ignore and fallback
      }
      return null;
    };

    if (Array.isArray(productsData?.products)) {
      const processed = await Promise.all(
        productsData.products.map(async (p: any) => {
          const platformKey = normalizePlatform(p.platform);
          
          // First, try to build URL from product_id if available
          let safeProductUrl: string;
          if (p.product_id) {
            safeProductUrl = buildProductUrl(platformKey, p.product_id, p.product_name || productName);
          } else if (p.product_url) {
            // Fallback to checking if provided URL is valid
            const hasValidUrl = isValidProductUrlForPlatform(platformKey, p.product_url);
            safeProductUrl = hasValidUrl
              ? p.product_url
              : buildSearchUrl(platformKey, p.product_name || productName);
          } else {
            // Last resort: build search URL
            safeProductUrl = buildSearchUrl(platformKey, p.product_name || productName);
          }

          let imageUrl: string | null = null;
          // 1) If provided image looks valid and loads, use it
          if (typeof p.image_url === 'string' && /^https?:\/\//i.test(p.image_url)) {
            imageUrl = await ensureLiveImage(p.image_url);
          }
          // 2) Otherwise, try to extract OG image from the product page
          if (!imageUrl) {
            imageUrl = await tryFetchOgImage(safeProductUrl);
          }

          return {
            ...p,
            product_url: safeProductUrl,
            image_url: imageUrl || 'https://via.placeholder.com/300?text=Product',
          };
        })
      );
      clearTimeout(timeoutId);
      productsData.products = processed;
    }

    return NextResponse.json(productsData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
