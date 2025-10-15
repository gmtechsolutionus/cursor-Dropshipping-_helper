'use client';

import React, { useState } from 'react';
import { PLATFORM_META, PlatformKey, siteSearchUrl, DEFAULT_PLATFORMS, US_PLATFORMS } from '@/lib/platformLinks';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
  productTitle: string;
  productImage?: string;
  platforms?: PlatformKey[];
  showPrice?: boolean;
  showUSOnly?: boolean;
};

export function TopRatedLinks({
  productTitle,
  productImage,
  platforms,
  showPrice = false,
  showUSOnly = false,
}: Props) {
  const selectedPlatforms = platforms || (showUSOnly ? US_PLATFORMS : DEFAULT_PLATFORMS);

  return (
    <div className="space-y-3">
      {selectedPlatforms.map((key) => (
        <PlatformLink
          key={key}
          platform={key}
          productTitle={productTitle}
          productImage={productImage}
          showPrice={showPrice}
        />
      ))}
    </div>
  );
}

type PlatformLinkProps = {
  platform: PlatformKey;
  productTitle: string;
  productImage?: string;
  showPrice?: boolean;
};

function PlatformLink({ platform, productTitle, productImage, showPrice }: PlatformLinkProps) {
  const meta = PLATFORM_META[platform];
  const href = siteSearchUrl(platform, productTitle);

  // Image fallback chain: productImage -> /api/image-proxy -> platformLogo
  const [imgSrc, setImgSrc] = useState<string | undefined>(
    productImage ? `/api/image-proxy?src=${encodeURIComponent(productImage)}` : meta.logo
  );
  const [hasErrored, setHasErrored] = useState(false);

  const handleImageError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      // Fallback to platform logo
      setImgSrc(meta.logo);
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md bg-card group"
      aria-label={`Search ${productTitle} on ${meta.label}`}
    >
      {/* Product/Platform Image */}
      <div className="relative shrink-0 h-14 w-14 rounded overflow-hidden bg-muted flex items-center justify-center">
        <img
          src={imgSrc}
          alt={`${productTitle} on ${meta.label}`}
          className="h-full w-full object-contain"
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1">
          Top-Rated Product Pricing
        </div>
        <div className="truncate font-medium text-sm mb-1 group-hover:text-primary transition-colors">
          {productTitle}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-xs"
            style={{ borderColor: meta.color, color: meta.color }}
          >
            {meta.label}
          </Badge>
          {/* Optional: Add free shipping badge if available */}
          {showPrice && (
            <span className="text-xs text-muted-foreground">Price available on site</span>
          )}
        </div>
      </div>

      {/* Open Link Icon */}
      <div className="shrink-0">
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </a>
  );
}

// Compact version for inline display
export function TopRatedLinksCompact({
  productTitle,
  productImage,
  platforms,
  showUSOnly = false,
}: Omit<Props, 'showPrice'>) {
  const selectedPlatforms = platforms || (showUSOnly ? US_PLATFORMS : DEFAULT_PLATFORMS);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {selectedPlatforms.map((key) => {
        const meta = PLATFORM_META[key];
        const href = siteSearchUrl(key, productTitle);

        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-all hover:shadow-md bg-card group text-center"
            aria-label={`Search ${productTitle} on ${meta.label}`}
          >
            <img
              src={meta.logo}
              alt={meta.label}
              className="h-8 w-8 object-contain"
              loading="lazy"
            />
            <span className="text-xs font-medium truncate w-full group-hover:text-primary transition-colors">
              {meta.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
