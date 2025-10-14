import { NextRequest, NextResponse } from 'next/server';
import { generateWithGrok } from '@/lib/xai';
import { CompetitorAnalysis } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { productName, productCategory, targetMarket } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const prompt = `Analyze competitors for "${productName}" in the dropshipping market.
    ${productCategory ? `Category: ${productCategory}` : ''}
    ${targetMarket ? `Target market: ${targetMarket}` : ''}
    
    Provide:
    1. Main competitors and their pricing
    2. Competitive advantages and disadvantages
    3. Market positioning analysis
    4. Pricing strategy recommendations
    5. Unique selling points to emphasize
    6. Market opportunities
    
    Return the data in this JSON format:
    {
      "product_name": "string",
      "competitors": [
        {
          "name": "string",
          "price": number,
          "advantages": ["string"],
          "disadvantages": ["string"],
          "market_position": "string",
          "estimated_sales_volume": "string"
        }
      ],
      "pricing_strategy": "string",
      "unique_selling_points": ["string"],
      "market_opportunities": ["string"]
    }`;

    const result = await generateWithGrok(prompt);
    
    if (!result) {
      throw new Error('Failed to analyze competitors from xAI');
    }

    let competitorAnalysis: CompetitorAnalysis;
    try {
      competitorAnalysis = JSON.parse(result);
    } catch (parseError) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        competitorAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from xAI');
      }
    }

    return NextResponse.json(competitorAnalysis);
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    return NextResponse.json(
      { error: 'Failed to analyze competitors', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}