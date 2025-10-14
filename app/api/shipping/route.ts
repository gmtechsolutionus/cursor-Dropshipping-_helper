import { NextRequest, NextResponse } from 'next/server';
import { generateWithGrok } from '@/lib/xai';
import { ShippingEstimate } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, productWeight, productDimensions } = await request.json();

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    const prompt = `Calculate shipping estimates from ${origin} to ${destination}.
    ${productWeight ? `Product weight: ${productWeight}` : ''}
    ${productDimensions ? `Product dimensions: ${productDimensions}` : ''}
    
    Include:
    1. Different shipping methods (standard, express, etc.)
    2. Estimated delivery times
    3. Shipping costs
    4. Customs risk assessment
    5. Any potential customs fees or import duties
    
    Return the data in this JSON format:
    {
      "origin": "string",
      "destination": "string",
      "shipping_methods": [
        {
          "method": "string",
          "carrier": "string",
          "estimated_days": {
            "min": number,
            "max": number
          },
          "cost": number,
          "tracking_available": boolean,
          "customs_risk": "low" | "medium" | "high",
          "customs_notes": "string"
        }
      ]
    }`;

    const result = await generateWithGrok(prompt);
    
    if (!result) {
      throw new Error('Failed to calculate shipping from xAI');
    }

    let shippingEstimate: ShippingEstimate;
    try {
      shippingEstimate = JSON.parse(result);
    } catch (parseError) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        shippingEstimate = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from xAI');
      }
    }

    return NextResponse.json(shippingEstimate);
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}