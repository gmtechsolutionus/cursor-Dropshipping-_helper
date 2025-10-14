import { NextRequest, NextResponse } from 'next/server';
import { generateWithGrok } from '@/lib/xai';
import { SupplierVerification } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { supplierName, platform, supplierUrl } = await request.json();

    if (!supplierName || !platform) {
      return NextResponse.json(
        { error: 'Supplier name and platform are required' },
        { status: 400 }
      );
    }

    const prompt = `Verify the reliability and trustworthiness of supplier "${supplierName}" on ${platform}.
    ${supplierUrl ? `Supplier URL: ${supplierUrl}` : ''}
    
    Analyze:
    1. Business legitimacy and history
    2. Customer reviews and ratings
    3. Response rates and delivery times
    4. Any red flags or scam indicators
    5. Positive indicators of reliability
    
    Return the data in this JSON format:
    {
      "supplier_name": "string",
      "platform": "string",
      "trust_score": number (0-100),
      "verified": boolean,
      "business_info": {
        "established_year": number,
        "location": "string",
        "response_rate": number,
        "on_time_delivery": number
      },
      "red_flags": ["string"],
      "green_flags": ["string"],
      "recommendation": "safe" | "caution" | "avoid"
    }`;

    const result = await generateWithGrok(prompt);
    
    if (!result) {
      throw new Error('Failed to verify supplier from xAI');
    }

    let verification: SupplierVerification;
    try {
      verification = JSON.parse(result);
    } catch (parseError) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verification = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from xAI');
      }
    }

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Error verifying supplier:', error);
    return NextResponse.json(
      { error: 'Failed to verify supplier', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}