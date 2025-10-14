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

    // Parse the JSON response with multiple fallback methods
    let productAnalysis: ProductAnalysis | null = null;
    
    const parseAttempts = [
      // Method 1: Direct parsing
      () => JSON.parse(analysisResult),
      
      // Method 2: Extract from markdown code blocks (```json or ```)
      () => {
        const markdownMatch = analysisResult.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (markdownMatch) return JSON.parse(markdownMatch[1]);
        throw new Error('No markdown block found');
      },
      
      // Method 3: Find outermost JSON object
      () => {
        const firstBrace = analysisResult.indexOf('{');
        const lastBrace = analysisResult.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          return JSON.parse(analysisResult.substring(firstBrace, lastBrace + 1));
        }
        throw new Error('No JSON braces found');
      },
      
      // Method 4: Remove common prefixes and try again
      () => {
        const cleaned = analysisResult
          .replace(/^[^{]*/, '') // Remove everything before first {
          .replace(/[^}]*$/, ''); // Remove everything after last }
        return JSON.parse(cleaned);
      },
      
      // Method 5: Try to extract JSON from "Here is the JSON:" or similar patterns
      () => {
        const patterns = [
          /(?:here\s+is\s+(?:the\s+)?json:?\s*)/i,
          /(?:json\s+(?:response|output):?\s*)/i,
          /(?:response:?\s*)/i
        ];
        
        let text = analysisResult;
        for (const pattern of patterns) {
          text = text.replace(pattern, '');
        }
        
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          return JSON.parse(text.substring(firstBrace, lastBrace + 1));
        }
        throw new Error('Pattern matching failed');
      }
    ];
    
    let lastError: Error | null = null;
    for (let i = 0; i < parseAttempts.length; i++) {
      try {
        productAnalysis = parseAttempts[i]();
        console.log(`Successfully parsed JSON using method ${i + 1}`);
        break;
      } catch (e) {
        lastError = e as Error;
        if (i === parseAttempts.length - 1) {
          console.error('All parsing attempts failed. Raw response:', analysisResult.substring(0, 500));
          throw new Error(`Invalid response format from xAI - could not parse JSON after ${parseAttempts.length} attempts. Last error: ${lastError.message}`);
        }
      }
    }

    // Validate parsing succeeded
    if (!productAnalysis) {
      throw new Error('Failed to parse JSON response');
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
      supplier_options: (productAnalysis.supplier_options || []).map(supplier => ({
        ...supplier,
        shipping_cost: supplier.shipping_cost ?? 0,
        moq: supplier.moq ?? 1,
        location: supplier.location || 'Unknown',
        payment_methods: supplier.payment_methods || 'Various',
        return_policy: supplier.return_policy || 'Check with supplier'
      })),
      product_image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : undefined,
      pricing_strategy: productAnalysis.pricing_strategy,
      market_analysis: productAnalysis.market_analysis,
      logistics: productAnalysis.logistics
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