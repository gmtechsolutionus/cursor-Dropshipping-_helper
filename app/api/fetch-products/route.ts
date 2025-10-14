import { NextRequest, NextResponse } from 'next/server';
import { generateTopRatedProducts } from '@/lib/xai';

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

    // Call xAI API to fetch top-rated products
    const productsResult = await generateTopRatedProducts(productName);

    if (!productsResult) {
      throw new Error('Failed to get products from xAI');
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

    return NextResponse.json(productsData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
