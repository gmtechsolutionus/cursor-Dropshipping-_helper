/**
 * URL Validation and Replacement Utility
 * 
 * This module provides functionality to:
 * 1. Validate product URLs by checking if they return HTTP 200
 * 2. Search for replacement URLs when the original is invalid
 * 3. Support multiple e-commerce platforms
 */

export interface ValidationResult {
  isValid: boolean;
  status: number | null;
  replacementUrl?: string;
  message?: string;
}

/**
 * Validates a URL by sending a HEAD request
 * @param url - The URL to validate
 * @param timeout - Timeout in milliseconds (default: 5000)
 * @returns Promise<ValidationResult>
 */
export async function validateUrl(
  url: string,
  timeout: number = 5000
): Promise<ValidationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProductValidator/1.0)',
      },
    });

    clearTimeout(timeoutId);

    const isValid = response.status >= 200 && response.status < 400;
    return {
      isValid,
      status: response.status,
      message: isValid ? 'URL is accessible' : `HTTP ${response.status}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          isValid: false,
          status: null,
          message: 'Request timeout',
        };
      }
      return {
        isValid: false,
        status: null,
        message: error.message,
      };
    }
    return {
      isValid: false,
      status: null,
      message: 'Unknown error',
    };
  }
}

/**
 * Normalizes platform name to a consistent format
 */
export function normalizePlatform(platform: string): string {
  const key = platform.toLowerCase();
  if (key.includes('aliexpress')) return 'aliexpress';
  if (key.includes('amazon')) return 'amazon';
  if (key.includes('ebay')) return 'ebay';
  if (key.includes('walmart')) return 'walmart';
  if (key.includes('dhgate')) return 'dhgate';
  if (key.includes('banggood')) return 'banggood';
  if (key.includes('alibaba')) return 'alibaba';
  return key;
}

/**
 * Builds a search URL for a given platform and product name
 */
export function buildSearchUrl(platform: string, productName: string): string {
  const q = encodeURIComponent(productName);
  const platformKey = normalizePlatform(platform);

  switch (platformKey) {
    case 'aliexpress':
      return `https://www.aliexpress.com/wholesale?SearchText=${q}`;
    case 'amazon':
      return `https://www.amazon.com/s?k=${q}`;
    case 'ebay':
      return `https://www.ebay.com/sch/i.html?_nkw=${q}`;
    case 'walmart':
      return `https://www.walmart.com/search?q=${q}`;
    case 'dhgate':
      return `https://www.dhgate.com/wholesale/search.do?act=search&searchkey=${q}`;
    case 'banggood':
      return `https://www.banggood.com/search/${q}.html`;
    case 'alibaba':
      return `https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&SearchText=${q}`;
    default:
      return `https://www.google.com/search?q=site:${platform}.com+${q}`;
  }
}

/**
 * Validates if a URL matches the expected format for a platform
 */
export function isValidProductUrlForPlatform(
  platform: string,
  url: string
): boolean {
  const platformKey = normalizePlatform(platform);

  try {
    const urlObj = new URL(url);
    const host = urlObj.hostname.toLowerCase();
    const path = urlObj.pathname.toLowerCase();

    switch (platformKey) {
      case 'aliexpress':
        return (
          (/aliexpress\.(com|us|ru)$/.test(host) ||
            host.endsWith('.aliexpress.com')) &&
          (path.includes('/item/') || path.startsWith('/i/'))
        );
      case 'amazon':
        return (
          host.includes('amazon.') &&
          (path.includes('/dp/') || path.includes('/gp/product/'))
        );
      case 'ebay':
        return host.includes('ebay.') && path.includes('/itm/');
      case 'walmart':
        return host.includes('walmart.com') && path.includes('/ip/');
      case 'dhgate':
        return host.includes('dhgate.com') && path.includes('/product/');
      case 'banggood':
        return (
          host.includes('banggood.com') &&
          (/\-p-\d+\.html$/.test(path) || path.includes('/product/'))
        );
      case 'alibaba':
        return (
          host.includes('alibaba.com') &&
          (path.includes('/product-detail/') || path.includes('/offer/'))
        );
      default:
        return urlObj.protocol === 'https:';
    }
  } catch {
    return false;
  }
}

/**
 * Attempts to find a replacement URL using web search
 * This is a fallback mechanism when the direct URL is invalid
 */
export async function findReplacementUrl(
  platform: string,
  productName: string,
  timeout: number = 5000
): Promise<string | null> {
  try {
    const searchUrl = buildSearchUrl(platform, productName);
    
    // Validate the search URL itself
    const validation = await validateUrl(searchUrl, timeout);
    
    if (validation.isValid) {
      return searchUrl;
    }
    
    // If platform search fails, try Google search as last resort
    const googleUrl = `https://www.google.com/search?q=site:${platform}.com+${encodeURIComponent(productName)}`;
    const googleValidation = await validateUrl(googleUrl, timeout);
    
    if (googleValidation.isValid) {
      return googleUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding replacement URL:', error);
    return null;
  }
}

/**
 * Validates a product URL and attempts to find a replacement if invalid
 */
export async function validateAndReplaceUrl(
  url: string,
  platform: string,
  productName: string,
  timeout: number = 5000
): Promise<{
  isValid: boolean;
  finalUrl: string;
  status: 'valid' | 'replaced' | 'invalid';
  originalUrl?: string;
  message?: string;
}> {
  // First check if the URL format is valid for the platform
  if (!isValidProductUrlForPlatform(platform, url)) {
    // URL format is invalid, try to find a replacement
    const replacementUrl = await findReplacementUrl(platform, productName, timeout);
    
    if (replacementUrl) {
      return {
        isValid: true,
        finalUrl: replacementUrl,
        status: 'replaced',
        originalUrl: url,
        message: 'Invalid URL format, replaced with platform search',
      };
    }
    
    return {
      isValid: false,
      finalUrl: url,
      status: 'invalid',
      originalUrl: url,
      message: 'Invalid URL format and no replacement found',
    };
  }

  // URL format is valid, now check if it's accessible
  const validation = await validateUrl(url, timeout);

  if (validation.isValid) {
    return {
      isValid: true,
      finalUrl: url,
      status: 'valid',
      message: 'URL is valid and accessible',
    };
  }

  // URL is not accessible, try to find a replacement
  const replacementUrl = await findReplacementUrl(platform, productName, timeout);

  if (replacementUrl) {
    return {
      isValid: true,
      finalUrl: replacementUrl,
      status: 'replaced',
      originalUrl: url,
      message: `Original URL returned ${validation.status || 'error'}, replaced with platform search`,
    };
  }

  return {
    isValid: false,
    finalUrl: url,
    status: 'invalid',
    originalUrl: url,
    message: validation.message || 'URL is not accessible and no replacement found',
  };
}

/**
 * Validates multiple product URLs in parallel
 */
export async function validateProductUrls(
  products: Array<{
    product_url: string;
    platform: string;
    product_name: string;
  }>,
  timeout: number = 5000
): Promise<
  Array<{
    isValid: boolean;
    finalUrl: string;
    status: 'valid' | 'replaced' | 'invalid';
    originalUrl?: string;
    message?: string;
  }>
> {
  return Promise.all(
    products.map((product) =>
      validateAndReplaceUrl(
        product.product_url,
        product.platform,
        product.product_name,
        timeout
      )
    )
  );
}
