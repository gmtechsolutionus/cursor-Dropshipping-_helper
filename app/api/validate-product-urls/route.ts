import { NextRequest, NextResponse } from 'next/server';
import { validateProductUrls } from '@/lib/url-validator';
import { TopRatedProduct } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Products array is required' },
        { status: 400 }
      );
    }

    // Validate all product URLs in parallel
    const validationResults = await validateProductUrls(
      products.map((p: TopRatedProduct) => ({
        product_url: p.product_url,
        platform: p.platform,
        product_name: p.product_name,
      })),
      5000 // 5 second timeout
    );

    // Update products with validation results
    const updatedProducts = products.map((product: TopRatedProduct, index: number) => {
      const validation = validationResults[index];
      return {
        ...product,
        product_url: validation.finalUrl,
        url_status: validation.status,
        original_url: validation.originalUrl,
        last_validated: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      products: updatedProducts,
      summary: {
        total: products.length,
        valid: validationResults.filter((r) => r.status === 'valid').length,
        replaced: validationResults.filter((r) => r.status === 'replaced').length,
        invalid: validationResults.filter((r) => r.status === 'invalid').length,
      },
    });
  } catch (error) {
    console.error('Error validating product URLs:', error);
    return NextResponse.json(
      {
        error: 'Failed to validate product URLs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
