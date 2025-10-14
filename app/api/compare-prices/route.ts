import { NextRequest, NextResponse } from 'next/server';
import { generateWithGrok } from '@/lib/xai';
import { PriceComparison } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { productName, productDescription } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const prompt = `Compare prices for "${productName}" across different dropshipping platforms.
    Product description: ${productDescription || 'N/A'}
    
    Search major platforms like AliExpress, Amazon, Alibaba, DHgate, and others.
    Include shipping costs and total costs.
    
    Return the data in this JSON format:
    {
      "product_name": "string",
      "comparisons": [
        {
          "supplier": "string",
          "platform": "string",
          "price": number,
          "shipping_cost": number,
          "total_cost": number,
          "delivery_time": "string",
          "in_stock": boolean,
          "url": "string"
        }
      ]
    }`;

    const result = await generateWithGrok(prompt);
    
    if (!result) {
      throw new Error('Failed to get price comparison from xAI');
    }

    let priceComparison: PriceComparison;
    try {
      priceComparison = JSON.parse(result);
    } catch (parseError) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        priceComparison = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from xAI');
      }
    }

    return NextResponse.json(priceComparison);
  } catch (error) {
    console.error('Error comparing prices:', error);
    return NextResponse.json(
      { error: 'Failed to compare prices', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}