export interface ProductAnalysis {
  product_name: string;
  description: string;
  features_list: string[];
  specs: {
    brand?: string;
    model?: string;
    material?: string;
    dimensions?: string;
    weight?: string;
    color?: string;
    [key: string]: string | undefined;
  };
  estimated_price_usd: {
    min: number;
    max: number;
    average: number;
  };
  affiliate_links: {
    platform: string;
    url: string;
    price: number;
  }[];
  supplier_options: {
    name: string;
    platform: string;
    price: number;
    shipping_time: string;
    rating: number;
    reviews_count: number;
    url: string;
  }[];
  product_image?: string; // Base64 image data
}

export interface PriceComparison {
  product_name: string;
  comparisons: {
    supplier: string;
    platform: string;
    price: number;
    shipping_cost: number;
    total_cost: number;
    delivery_time: string;
    in_stock: boolean;
    url: string;
  }[];
}

export interface SupplierVerification {
  supplier_name: string;
  platform: string;
  trust_score: number;
  verified: boolean;
  business_info: {
    established_year?: number;
    location?: string;
    response_rate?: number;
    on_time_delivery?: number;
  };
  red_flags: string[];
  green_flags: string[];
  recommendation: 'safe' | 'caution' | 'avoid';
}

export interface ShippingEstimate {
  origin: string;
  destination: string;
  shipping_methods: {
    method: string;
    carrier: string;
    estimated_days: {
      min: number;
      max: number;
    };
    cost: number;
    tracking_available: boolean;
    customs_risk: 'low' | 'medium' | 'high';
    customs_notes?: string;
  }[];
}

export interface ReviewSummary {
  product_name: string;
  overall_rating: number;
  total_reviews: number;
  sentiment_analysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  key_pros: string[];
  key_cons: string[];
  fake_review_likelihood: number;
  authentic_review_sample: {
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface SEODescription {
  title: string;
  meta_description: string;
  product_description: string;
  bullet_points: string[];
  keywords: string[];
  call_to_action: string;
}

export interface CompetitorAnalysis {
  product_name: string;
  competitors: {
    name: string;
    price: number;
    advantages: string[];
    disadvantages: string[];
    market_position: string;
    estimated_sales_volume: string;
  }[];
  pricing_strategy: string;
  unique_selling_points: string[];
  market_opportunities: string[];
}