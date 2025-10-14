import { NextRequest, NextResponse } from 'next/server';
import { analyzeProductImage, analyzeProductByName } from '@/lib/xai';
import { ProductAnalysis } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, productName } = await request.json();

    if (!imageBase64 && !productName) {
      return NextResponse.json(
        { error: 'Please provide either an image or product name' },
        { status: 400 }
      );
    }

    let analysisResult: string | null = null;

    if (imageBase64) {
      // Call xAI API to analyze the image
      analysisResult = await analyzeProductImage(imageBase64);
    } else if (productName) {
      // Call xAI API to analyze by product name
      analysisResult = await analyzeProductByName(productName);
    }

    if (!analysisResult) {
      throw new Error('Failed to get analysis from xAI');
    }

    // Parse the JSON response
    let productAnalysis: ProductAnalysis;
    try {
      productAnalysis = JSON.parse(analysisResult);
    } catch (parseError) {
      console.error('Failed to parse xAI response:', analysisResult);
      
      // Try multiple extraction methods
      let extractedJson = null;
      
      // Method 1: Extract from markdown code blocks
      const markdownMatch = analysisResult.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (markdownMatch) {
        extractedJson = markdownMatch[1];
      }
      
      // Method 2: Find JSON object (first { to last })
      if (!extractedJson) {
        const firstBrace = analysisResult.indexOf('{');
        const lastBrace = analysisResult.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          extractedJson = analysisResult.substring(firstBrace, lastBrace + 1);
        }
      }
      
      if (extractedJson) {
        try {
          productAnalysis = JSON.parse(extractedJson);
        } catch (e) {
          console.error('Failed to parse extracted JSON:', extractedJson);
          throw new Error('Invalid response format from xAI - could not parse JSON');
        }
      } else {
        throw new Error('Invalid response format from xAI - no JSON found');
      }
    }

    // Validate the response structure
    if (!productAnalysis.product_name || !productAnalysis.description) {
      throw new Error('Incomplete product analysis');
    }

    // Ensure all required fields have default values
    productAnalysis = {
      product_name: productAnalysis.product_name || 'Unknown Product',
      description: productAnalysis.description || '',
      features_list: productAnalysis.features_list || [],
      specs: productAnalysis.specs || {},
      estimated_price_usd: productAnalysis.estimated_price_usd || {
        min: 0,
        max: 0,
        average: 0
      },
      affiliate_links: productAnalysis.affiliate_links || [],
      supplier_options: productAnalysis.supplier_options || []
    };

    return NextResponse.json(productAnalysis);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}