import OpenAI from 'openai';

let xaiClient: OpenAI | null = null;

function getXAIClient() {
  if (!xaiClient) {
    xaiClient = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_XAI_API_KEY || '',
      baseURL: 'https://api.x.ai/v1',
    });
  }
  return xaiClient;
}

export async function analyzeProductImage(imageBase64: string) {
  const xai = getXAIClient();
  const response = await xai.chat.completions.create({
    model: 'grok-4',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this product image: Identify the exact item, brand, model, key features, materials, dimensions, and suggest dropshipping suppliers/pricing from major platforms like AliExpress/Amazon. Output in JSON format with the following structure:
            {
              "product_name": "string",
              "description": "string",
              "features_list": ["string"],
              "specs": {
                "brand": "string",
                "model": "string",
                "material": "string",
                "dimensions": "string",
                "weight": "string",
                "color": "string"
              },
              "estimated_price_usd": {
                "min": number,
                "max": number,
                "average": number
              },
              "affiliate_links": [
                {
                  "platform": "string",
                  "url": "string",
                  "price": number
                }
              ],
              "supplier_options": [
                {
                  "name": "string",
                  "platform": "string",
                  "price": number,
                  "shipping_time": "string",
                  "rating": number,
                  "reviews_count": number,
                  "url": "string"
                }
              ]
            }`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  return response.choices[0].message.content;
}

export async function generateWithGrok(prompt: string) {
  const xai = getXAIClient();
  const response = await xai.chat.completions.create({
    model: 'grok-beta',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  return response.choices[0].message.content;
}

export async function analyzeProductByName(productName: string) {
  const prompt = `Analyze the product "${productName}" for dropshipping. Research and provide comprehensive information about this product including brand, model, key features, materials, typical dimensions, and suggest dropshipping suppliers/pricing from major platforms like AliExpress/Amazon. 

  Output in JSON format with the following structure:
  {
    "product_name": "string",
    "description": "string",
    "features_list": ["string"],
    "specs": {
      "brand": "string",
      "model": "string",
      "material": "string",
      "dimensions": "string",
      "weight": "string",
      "color": "string"
    },
    "estimated_price_usd": {
      "min": number,
      "max": number,
      "average": number
    },
    "affiliate_links": [
      {
        "platform": "string",
        "url": "string",
        "price": number
      }
    ],
    "supplier_options": [
      {
        "name": "string",
        "platform": "string",
        "price": number,
        "shipping_time": "string",
        "rating": number,
        "reviews_count": number,
        "url": "string"
      }
    ]
  }`;

  return await generateWithGrok(prompt);
}