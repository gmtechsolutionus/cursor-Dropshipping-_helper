// Mock product data for testing without API key
export function generateMockTopRatedProducts(productName: string) {
  const mockProducts = {
    "products": [
      {
        "product_id": "B0CHX3TM6V",
        "product_name": "Spigen Tough Armor Designed for iPhone 15 Pro Max Case (2023) - Black",
        "price": 44.99,
        "platform": "Amazon",
        "rating": 4.7,
        "reviews_count": 12300,
        "shipping_info": "Free shipping"
      },
      {
        "product_id": "B0D9JXYZ12",
        "product_name": "OtterBox Defender Series Case for iPhone 15 Pro Max - Black",
        "price": 59.95,
        "platform": "Amazon",
        "rating": 4.6,
        "reviews_count": 8800,
        "shipping_info": "Free shipping"
      },
      {
        "product_id": "1005006123456789",
        "product_name": "Apple Silicone Case with MagSafe for iPhone 15 Pro Max - Midnight",
        "price": 49.00,
        "platform": "AliExpress",
        "rating": 4.8,
        "reviews_count": 6500,
        "shipping_info": "Free shipping"
      },
      {
        "product_id": "B0C5XYZ789",
        "product_name": "OtterBox Symmetry Series Case for iPhone 15 Pro Max - Clear",
        "price": 49.95,
        "platform": "Amazon",
        "rating": 4.7,
        "reviews_count": 5400,
        "shipping_info": "Free shipping"
      },
      {
        "product_id": "B0D1ABC456",
        "product_name": "Spigen Ultra Hybrid Designed for iPhone 15 Pro Max Case (2023) - Crystal Clear",
        "price": 34.99,
        "platform": "Amazon",
        "rating": 4.6,
        "reviews_count": 4300,
        "shipping_info": "Free shipping"
      },
      {
        "product_id": "234567890123",
        "product_name": "Apple Clear Case with MagSafe for iPhone 15 Pro Max",
        "price": 49.00,
        "platform": "eBay",
        "rating": 4.7,
        "reviews_count": 3200,
        "shipping_info": "Free shipping"
      },
      {
        "product_id": "B0C9DEF123",
        "product_name": "OtterBox Commuter Series Case for iPhone 15 Pro Max - Black",
        "price": 39.95,
        "platform": "Amazon",
        "rating": 4.6,
        "reviews_count": 2100,
        "shipping_info": "Free shipping"
      },
      {
        "product_id": "123456789",
        "product_name": "Spigen Liquid Air Armor Case for iPhone 15 Pro Max",
        "price": 16.99,
        "platform": "Walmart",
        "rating": 4.5,
        "reviews_count": 1800,
        "shipping_info": "Free shipping, 2-3 days"
      },
      {
        "product_id": "iphone-15-pro-max-tough-case",
        "product_name": "Heavy Duty Armor Case for iPhone 15 Pro Max with Screen Protector",
        "price": 23.99,
        "platform": "DHgate",
        "rating": 4.6,
        "reviews_count": 1500,
        "shipping_info": "Free shipping, 7-15 days"
      },
      {
        "product_id": "1234567",
        "product_name": "Premium Leather Case for iPhone 15 Pro Max with Card Holder",
        "price": 28.99,
        "platform": "Banggood",
        "rating": 4.5,
        "reviews_count": 1200,
        "shipping_info": "Free shipping, 10-20 days"
      }
    ]
  };

  // Replace generic product name with the requested one
  if (productName) {
    mockProducts.products = mockProducts.products.map(p => ({
      ...p,
      product_name: p.product_name.replace(/iPhone 15 Pro Max/gi, productName)
    }));
  }

  return JSON.stringify(mockProducts);
}