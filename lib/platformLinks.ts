/**
 * Platform Links Utility
 * Generates guaranteed-working site search URLs for various e-commerce platforms
 */

export type PlatformKey =
  | 'amazon' | 'walmart' | 'ebay' | 'target' | 'bestbuy'
  | 'aliexpress' | 'temu' | 'dhgate' | 'banggood' | 'shopee' | 'lazada';

const GOOGLE = 'https://www.google.com/search?q=';

/**
 * URL-encodes a search query
 */
function q(s: string): string {
  return encodeURIComponent(s);
}

/**
 * Generates a guaranteed-working site search URL for the specified platform
 * Uses Google site: search operator to ensure the link always works
 */
export function siteSearchUrl(platform: PlatformKey, productTitle: string): string {
  switch (platform) {
    case 'amazon':
      return `${GOOGLE}${q(`site:amazon.com ${productTitle}`)}`;
    case 'walmart':
      return `${GOOGLE}${q(`site:walmart.com ${productTitle}`)}`;
    case 'ebay':
      return `${GOOGLE}${q(`site:ebay.com ${productTitle}`)}`;
    case 'target':
      return `${GOOGLE}${q(`site:target.com ${productTitle}`)}`;
    case 'bestbuy':
      return `${GOOGLE}${q(`site:bestbuy.com ${productTitle}`)}`;
    case 'aliexpress':
      // US shipping - use .us domain for US market
      return `${GOOGLE}${q(`site:aliexpress.us ${productTitle}`)}`;
    case 'temu':
      return `${GOOGLE}${q(`site:temu.com ${productTitle}`)}`;
    case 'dhgate':
      return `${GOOGLE}${q(`site:dhgate.com ${productTitle}`)}`;
    case 'banggood':
      return `${GOOGLE}${q(`site:banggood.com ${productTitle}`)}`;
    case 'shopee':
      return `${GOOGLE}${q(`site:shopee.com ${productTitle}`)}`;
    case 'lazada':
      return `${GOOGLE}${q(`site:lazada.com ${productTitle}`)}`;
    default:
      return `${GOOGLE}${q(productTitle)}`;
  }
}

/**
 * Generates a native platform search URL (direct search on the platform)
 * More direct than Google site search but may have URL format changes
 */
export function nativePlatformSearchUrl(platform: PlatformKey, productTitle: string): string {
  const encoded = q(productTitle);
  
  switch (platform) {
    case 'amazon':
      return `https://www.amazon.com/s?k=${encoded}`;
    case 'walmart':
      return `https://www.walmart.com/search?q=${encoded}`;
    case 'ebay':
      return `https://www.ebay.com/sch/i.html?_nkw=${encoded}`;
    case 'target':
      return `https://www.target.com/s?searchTerm=${encoded}`;
    case 'bestbuy':
      return `https://www.bestbuy.com/site/searchpage.jsp?st=${encoded}`;
    case 'aliexpress':
      return `https://www.aliexpress.us/wholesale?SearchText=${encoded}`;
    case 'temu':
      return `https://www.temu.com/search_result.html?search_key=${encoded}`;
    case 'dhgate':
      return `https://www.dhgate.com/wholesale/search.do?act=search&searchkey=${encoded}`;
    case 'banggood':
      return `https://www.banggood.com/search/${encoded}.html`;
    case 'shopee':
      return `https://shopee.com/search?keyword=${encoded}`;
    case 'lazada':
      return `https://www.lazada.com/catalog/?q=${encoded}`;
    default:
      return siteSearchUrl(platform, productTitle);
  }
}

/**
 * Platform metadata including labels and logo paths
 */
export const PLATFORM_META: Record<PlatformKey, { label: string; logo: string; color: string }> = {
  amazon: {
    label: 'Amazon',
    logo: '/platform-logos/amazon.svg',
    color: '#FF9900',
  },
  walmart: {
    label: 'Walmart',
    logo: '/platform-logos/walmart.svg',
    color: '#0071CE',
  },
  ebay: {
    label: 'eBay',
    logo: '/platform-logos/ebay.svg',
    color: '#E53238',
  },
  target: {
    label: 'Target',
    logo: '/platform-logos/target.svg',
    color: '#CC0000',
  },
  bestbuy: {
    label: 'BestBuy',
    logo: '/platform-logos/bestbuy.svg',
    color: '#0046BE',
  },
  aliexpress: {
    label: 'AliExpress',
    logo: '/platform-logos/aliexpress.svg',
    color: '#E62E04',
  },
  temu: {
    label: 'Temu',
    logo: '/platform-logos/temu.svg',
    color: '#FF6B00',
  },
  dhgate: {
    label: 'DHgate',
    logo: '/platform-logos/dhgate.svg',
    color: '#FF6C00',
  },
  banggood: {
    label: 'Banggood',
    logo: '/platform-logos/banggood.svg',
    color: '#F60',
  },
  shopee: {
    label: 'Shopee',
    logo: '/platform-logos/shopee.svg',
    color: '#EE4D2D',
  },
  lazada: {
    label: 'Lazada',
    logo: '/platform-logos/lazada.svg',
    color: '#0F146D',
  },
};

/**
 * Default platforms in priority order (US market first)
 */
export const DEFAULT_PLATFORMS: PlatformKey[] = [
  'amazon',
  'walmart',
  'ebay',
  'target',
  'bestbuy',
  'aliexpress',
  'temu',
  'dhgate',
  'banggood',
  'shopee',
  'lazada',
];

/**
 * US-focused platforms only
 */
export const US_PLATFORMS: PlatformKey[] = [
  'amazon',
  'walmart',
  'ebay',
  'target',
  'bestbuy',
];

/**
 * International/wholesale platforms
 */
export const INTERNATIONAL_PLATFORMS: PlatformKey[] = [
  'aliexpress',
  'temu',
  'dhgate',
  'banggood',
  'shopee',
  'lazada',
];
