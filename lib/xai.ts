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
    model: 'grok-2-vision-latest',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this product image in COMPREHENSIVE detail for dropshipping business. Provide ALL information a dropshipper needs:

PRODUCT IDENTIFICATION:
- Exact product name, brand, model number
- Complete specifications (dimensions, weight, material, color variants)
- Key features and unique selling points
- Target audience and use cases
- Product category and niche

PRODUCT LINKS (Provide 10-15 DIRECT product links from ALL platforms):
Find the BEST PRICED and HIGHEST RATED product listings from:
- AliExpress (4-5 listings with 4.5+ rating, 500+ reviews, best prices)
- Amazon (3-4 listings from US/international sellers with Prime options)
- DHgate (2-3 wholesale listings with competitive pricing)
- Alibaba (1-2 bulk suppliers with reasonable MOQ)
- eBay (1-2 highly rated sellers with good prices)
- Walmart, Banggood, Gearbest, Wish (2-3 additional best deals)

For EACH product link provide:
- Exact product title as shown on platform
- Direct product URL (actual searchable/generic product link)
- Current price in USD
- Shipping time and shipping cost estimate
- Product rating (4.0+) and review count (prefer 100+)
- Seller name, rating, and location
- Minimum order quantity (MOQ)
- Payment methods available
- Return/refund policy details
- Special deals or bulk discounts if available

Focus on: HIGH RATINGS (4.0+), MANY REVIEWS, COMPETITIVE PRICES, FAST SHIPPING, RELIABLE SELLERS

PRICING STRATEGY:
- Wholesale price range (min/max/average)
- Suggested retail price
- Estimated profit margin (percentage and dollar amount)
- Competitive pricing analysis
- Volume discount information

MARKET ANALYSIS:
- Current market demand (high/medium/low)
- Competition level
- Seasonal trends
- Best selling price point
- Target customer demographics

LOGISTICS:
- Packaging details
- Shipping weight and dimensions
- International shipping considerations
- Customs classification
- Import duties estimate

IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any markdown formatting, code blocks, or additional text. Start your response with { and end with }. Output the JSON with the following structure:
            {
              "product_name": "string",
              "description": "string (detailed 2-3 paragraphs)",
              "features_list": ["feature 1", "feature 2", "at least 5-8 features"],
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
              "supplier_options": [
                {
                  "name": "Supplier Name",
                  "platform": "AliExpress/Amazon/DHgate/Alibaba/eBay/etc",
                  "price": number,
                  "shipping_time": "X-Y days",
                  "shipping_cost": number,
                  "rating": 4.5,
                  "reviews_count": 1000,
                  "url": "https://platform.com/product",
                  "moq": 1,
                  "location": "China/USA/etc",
                  "payment_methods": "PayPal, Credit Card, etc",
                  "return_policy": "30 days return"
                }
              ],
              "pricing_strategy": {
                "wholesale_price": {"min": number, "max": number, "average": number},
                "suggested_retail_price": number,
                "profit_margin_percentage": number,
                "profit_margin_dollar": number,
                "competitive_analysis": "string with market pricing insights"
              },
              "market_analysis": {
                "demand_level": "high/medium/low",
                "competition_level": "high/medium/low",
                "seasonal_trends": "description of seasonal patterns",
                "target_demographics": "who buys this product",
                "best_selling_price": number
              },
              "logistics": {
                "packaging_details": "box size, packaging type",
                "shipping_weight": "actual weight",
                "shipping_dimensions": "LxWxH",
                "customs_classification": "HS code if applicable",
                "import_duties_estimate": "percentage or amount"
              }
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
    max_tokens: 4096,
  });

  return response.choices[0].message.content;
}

export async function generateWithGrok(prompt: string) {
  const xai = getXAIClient();
  const response = await xai.chat.completions.create({
    model: 'grok-2-latest',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 4096,
  });

  return response.choices[0].message.content;
}

export async function analyzeProductByName(productName: string) {
  const prompt = `Analyze the product "${productName}" in COMPREHENSIVE detail for dropshipping business. Provide ALL information a dropshipper needs:

PRODUCT IDENTIFICATION:
- Exact product name, brand, model number
- Complete specifications (dimensions, weight, material, color variants)
- Key features and unique selling points
- Target audience and use cases
- Product category and niche

PRODUCT LINKS (Provide 10-15 DIRECT product links from ALL platforms):
Find the BEST PRICED and HIGHEST RATED product listings from:
- AliExpress (4-5 listings with 4.5+ rating, 500+ reviews, best prices)
- Amazon (3-4 listings from US/international sellers with Prime options)
- DHgate (2-3 wholesale listings with competitive pricing)
- Alibaba (1-2 bulk suppliers with reasonable MOQ)
- eBay (1-2 highly rated sellers with good prices)
- Walmart, Banggood, Gearbest, Wish (2-3 additional best deals)

For EACH product link provide:
- Exact product title as shown on platform
- Direct product URL (actual searchable/generic product link)
- Current price in USD
- Shipping time and shipping cost estimate
- Product rating (4.0+) and review count (prefer 100+)
- Seller name, rating, and location
- Minimum order quantity (MOQ)
- Payment methods available
- Return/refund policy details
- Special deals or bulk discounts if available

Focus on: HIGH RATINGS (4.0+), MANY REVIEWS, COMPETITIVE PRICES, FAST SHIPPING, RELIABLE SELLERS

PRICING STRATEGY:
- Wholesale price range (min/max/average)
- Suggested retail price
- Estimated profit margin (percentage and dollar amount)
- Competitive pricing analysis
- Volume discount information

MARKET ANALYSIS:
- Current market demand (high/medium/low)
- Competition level
- Seasonal trends
- Best selling price point
- Target customer demographics

LOGISTICS:
- Packaging details
- Shipping weight and dimensions
- International shipping considerations
- Customs classification
- Import duties estimate

IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any markdown formatting, code blocks, or additional text. Start your response with { and end with }. Output the JSON with the following structure:
  {
    "product_name": "string",
    "description": "string (detailed 2-3 paragraphs)",
    "features_list": ["feature 1", "feature 2", "at least 5-8 features"],
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
    "supplier_options": [
      {
        "name": "Supplier Name",
        "platform": "AliExpress/Amazon/DHgate/Alibaba/eBay/etc",
        "price": number,
        "shipping_time": "X-Y days",
        "shipping_cost": number,
        "rating": 4.5,
        "reviews_count": 1000,
        "url": "https://platform.com/product",
        "moq": 1,
        "location": "China/USA/etc",
        "payment_methods": "PayPal, Credit Card, etc",
        "return_policy": "30 days return"
      }
    ],
    "pricing_strategy": {
      "wholesale_price": {"min": number, "max": number, "average": number},
      "suggested_retail_price": number,
      "profit_margin_percentage": number,
      "profit_margin_dollar": number,
      "competitive_analysis": "string with market pricing insights"
    },
    "market_analysis": {
      "demand_level": "high/medium/low",
      "competition_level": "high/medium/low",
      "seasonal_trends": "description of seasonal patterns",
      "target_demographics": "who buys this product",
      "best_selling_price": number
    },
    "logistics": {
      "packaging_details": "box size, packaging type",
      "shipping_weight": "actual weight",
      "shipping_dimensions": "LxWxH",
      "customs_classification": "HS code if applicable",
      "import_duties_estimate": "percentage or amount"
    }
  }`;

  return await generateWithGrok(prompt);
}