import { NextRequest, NextResponse } from 'next/server';
import { generateWithGrok } from '@/lib/xai';
import { ReviewSummary } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { productName, platform, productUrl } = await request.json();

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    const prompt = `Analyze customer reviews for "${productName}" ${platform ? `on ${platform}` : ''}.
    ${productUrl ? `Product URL: ${productUrl}` : ''}
    
    Provide:
    1. Overall rating and sentiment analysis
    2. Key pros and cons mentioned by customers
    3. Fake review detection (likelihood percentage)
    4. Sample of authentic-seeming reviews
    5. Common complaints or issues
    
    Return the data in this JSON format:
    {
      "product_name": "string",
      "overall_rating": number (0-5),
      "total_reviews": number,
      "sentiment_analysis": {
        "positive": number (percentage),
        "neutral": number (percentage),
        "negative": number (percentage)
      },
      "key_pros": ["string"],
      "key_cons": ["string"],
      "fake_review_likelihood": number (0-100),
      "authentic_review_sample": [
        {
          "rating": number,
          "comment": "string",
          "date": "string"
        }
      ]
    }`;

    const result = await generateWithGrok(prompt);
    
    if (!result) {
      throw new Error('Failed to analyze reviews from xAI');
    }

    let reviewSummary: ReviewSummary;
    try {
      reviewSummary = JSON.parse(result);
    } catch (parseError) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reviewSummary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from xAI');
      }
    }

    return NextResponse.json(reviewSummary);
  } catch (error) {
    console.error('Error analyzing reviews:', error);
    return NextResponse.json(
      { error: 'Failed to analyze reviews', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}