import { NextRequest, NextResponse } from 'next/server';
import { generateWithGrok } from '@/lib/xai';
import { SEODescription } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { productName, productFeatures, targetAudience, platform } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const prompt = `Write SEO-optimized product listing for "${productName}" for dropshipping.
    ${productFeatures ? `Key features: ${productFeatures}` : ''}
    ${targetAudience ? `Target audience: ${targetAudience}` : ''}
    ${platform ? `Platform: ${platform}` : ''}
    
    Create:
    1. Compelling title (60-70 characters)
    2. Meta description (150-160 characters)
    3. Full product description (300 words)
    4. 5-7 bullet points highlighting key benefits
    5. Relevant keywords for SEO
    6. Strong call-to-action
    
    Return the data in this JSON format:
    {
      "title": "string",
      "meta_description": "string",
      "product_description": "string",
      "bullet_points": ["string"],
      "keywords": ["string"],
      "call_to_action": "string"
    }`;

    const result = await generateWithGrok(prompt);
    
    if (!result) {
      throw new Error('Failed to generate SEO description from xAI');
    }

    let seoDescription: SEODescription;
    try {
      seoDescription = JSON.parse(result);
    } catch (parseError) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        seoDescription = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from xAI');
      }
    }

    return NextResponse.json(seoDescription);
  } catch (error) {
    console.error('Error generating SEO description:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO description', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}