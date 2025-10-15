'use client';

import { useState } from 'react';
import { ProductAnalysis, PriceComparison, SupplierVerification, ShippingEstimate, ReviewSummary, SEODescription, CompetitorAnalysis } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Package, TrendingUp, Shield, Truck, Star, Search, FileText, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductAnalysisDisplayProps {
  analysis: ProductAnalysis;
}

export function ProductAnalysisDisplay({ analysis }: ProductAnalysisDisplayProps) {
  const { t } = useLanguage();
  const [priceComparison, setPriceComparison] = useState<PriceComparison | null>(null);
  const [supplierVerification, setSupplierVerification] = useState<SupplierVerification | null>(null);
  const [shippingEstimate, setShippingEstimate] = useState<ShippingEstimate | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [seoDescription, setSeoDescription] = useState<SEODescription | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [topRatedProducts, setTopRatedProducts] = useState<any>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handlePriceComparison = async () => {
    setLoadingStates(prev => ({ ...prev, price: true }));
    try {
      const response = await fetch('/api/compare-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: analysis.product_name,
          productDescription: analysis.description
        })
      });
      
      if (!response.ok) throw new Error('Failed to compare prices');
      const data = await response.json();
      setPriceComparison(data);
      toast.success('Price comparison completed!');
    } catch (error) {
      toast.error('Failed to compare prices');
    } finally {
      setLoadingStates(prev => ({ ...prev, price: false }));
    }
  };

  const handleSupplierVerification = async (supplier: any) => {
    setLoadingStates(prev => ({ ...prev, supplier: true }));
    try {
      const response = await fetch('/api/verify-supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierName: supplier.name,
          platform: supplier.platform,
          supplierUrl: supplier.url
        })
      });
      
      if (!response.ok) throw new Error('Failed to verify supplier');
      const data = await response.json();
      setSupplierVerification(data);
      toast.success('Supplier verification completed!');
    } catch (error) {
      toast.error('Failed to verify supplier');
    } finally {
      setLoadingStates(prev => ({ ...prev, supplier: false }));
    }
  };

  const handleShippingEstimate = async () => {
    setLoadingStates(prev => ({ ...prev, shipping: true }));
    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: 'China',
          destination: 'United States',
          productWeight: analysis.specs.weight,
          productDimensions: analysis.specs.dimensions
        })
      });
      
      if (!response.ok) throw new Error('Failed to calculate shipping');
      const data = await response.json();
      setShippingEstimate(data);
      toast.success('Shipping estimate calculated!');
    } catch (error) {
      toast.error('Failed to calculate shipping');
    } finally {
      setLoadingStates(prev => ({ ...prev, shipping: false }));
    }
  };

  const handleReviewAnalysis = async () => {
    setLoadingStates(prev => ({ ...prev, reviews: true }));
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: analysis.product_name,
          platform: 'Multiple'
        })
      });
      
      if (!response.ok) throw new Error('Failed to analyze reviews');
      const data = await response.json();
      setReviewSummary(data);
      toast.success('Review analysis completed!');
    } catch (error) {
      toast.error('Failed to analyze reviews');
    } finally {
      setLoadingStates(prev => ({ ...prev, reviews: false }));
    }
  };

  const handleSEOGeneration = async () => {
    setLoadingStates(prev => ({ ...prev, seo: true }));
    try {
      const response = await fetch('/api/seo-desc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: analysis.product_name,
          productFeatures: analysis.features_list.join(', ')
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate SEO description');
      const data = await response.json();
      setSeoDescription(data);
      toast.success('SEO description generated!');
    } catch (error) {
      toast.error('Failed to generate SEO description');
    } finally {
      setLoadingStates(prev => ({ ...prev, seo: false }));
    }
  };

  const handleCompetitorAnalysis = async () => {
    setLoadingStates(prev => ({ ...prev, competitors: true }));
    try {
      const response = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: analysis.product_name,
          productCategory: analysis.specs.category
        })
      });
      
      if (!response.ok) throw new Error('Failed to analyze competitors');
      const data = await response.json();
      setCompetitorAnalysis(data);
      toast.success('Competitor analysis completed!');
    } catch (error) {
      toast.error('Failed to analyze competitors');
    } finally {
      setLoadingStates(prev => ({ ...prev, competitors: false }));
    }
  };

  const handleFetchTopProducts = async () => {
    setLoadingStates(prev => ({ ...prev, topProducts: true }));
    try {
      const response = await fetch('/api/fetch-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: analysis.product_name
        })
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setTopRatedProducts(data);
      toast.success('Top-rated products loaded!');
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoadingStates(prev => ({ ...prev, topProducts: false }));
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Title
    doc.setFontSize(20);
    doc.text('Product Analysis Report', 20, yPosition);
    yPosition += 15;
    
    // Product Name
    doc.setFontSize(16);
    doc.text(analysis.product_name, 20, yPosition);
    yPosition += 10;
    
    // Description
    doc.setFontSize(12);
    const descriptionLines = doc.splitTextToSize(analysis.description, 170);
    doc.text(descriptionLines, 20, yPosition);
    yPosition += descriptionLines.length * 5 + 10;
    
    // Features
    doc.setFontSize(14);
    doc.text('Features:', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    analysis.features_list.forEach(feature => {
      doc.text(`• ${feature}`, 25, yPosition);
      yPosition += 6;
    });
    
    // Price Range
    yPosition += 5;
    doc.setFontSize(14);
    doc.text('Price Range:', 20, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    doc.text(`$${analysis.estimated_price_usd.min} - $${analysis.estimated_price_usd.max} (Avg: $${analysis.estimated_price_usd.average})`, 25, yPosition);
    
    doc.save(`${analysis.product_name.replace(/\s+/g, '_')}_analysis.pdf`);
    toast.success('PDF exported successfully!');
  };

  const exportToCSV = () => {
    const csvData = [
      {
        'Product Name': analysis.product_name,
        'Description': analysis.description,
        'Min Price': analysis.estimated_price_usd.min,
        'Max Price': analysis.estimated_price_usd.max,
        'Average Price': analysis.estimated_price_usd.average,
        'Features': analysis.features_list.join('; ')
      }
    ];
    
    // Add supplier options
    analysis.supplier_options.forEach(supplier => {
      csvData.push({
        'Product Name': analysis.product_name,
        'Supplier': supplier.name,
        'Platform': supplier.platform,
        'Price': supplier.price,
        'Shipping Time': supplier.shipping_time,
        'Rating': supplier.rating,
        'Reviews': supplier.reviews_count
      } as any);
    });
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.product_name.replace(/\s+/g, '_')}_analysis.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold tracking-tight heading-gradient">{analysis.product_name}</h2>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t.exportPDF}
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            {t.exportCSV}
          </Button>
        </div>
      </div>

      {/* Advanced Analysis Tools - Top Section */}
      <Card>
        <CardHeader>
          <CardTitle className="heading-gradient">{t.additionalTools}</CardTitle>
          <CardDescription>Get deeper insights into your product</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Top-Rated Products FIRST under Advanced Analysis Tools */}
          {topRatedProducts && topRatedProducts.products && topRatedProducts.products.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">⭐ {t.topRatedProducts}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.topRatedProductsDesc}</p>
              {/* Single column layout, smaller image */}
              <div className="grid grid-cols-1 gap-4">
                {topRatedProducts.products.map((product: any, index: number) => (
                  <a
                    key={index}
                    href={product.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="relative shrink-0 h-36 w-36 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                        <img
                          src={`/api/image-proxy?url=${encodeURIComponent(
                            (product.image_url && !/placeholder\.com/.test(product.image_url))
                              ? product.image_url
                              : (product.product_url || '')
                          )}`}
                          alt={product.product_name}
                          className="absolute inset-0 w-full h-full object-contain"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-primary">{product.product_name}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-primary">$
                            {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                          </p>
                          <Badge variant="secondary" className="text-xs">{product.platform}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating} ({(product.reviews_count / 1000).toFixed(1)}k)</span>
                          </div>
                          {product.shipping_info && (
                            <span className="text-muted-foreground truncate">
                              {product.shipping_info.includes('Free') ? '📦 ' + t.freeShipping : product.shipping_info}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons for tools */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              onClick={handleFetchTopProducts}
              disabled={loadingStates.topProducts}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              {loadingStates.topProducts ? t.fetchingProducts : t.fetchProducts}
            </Button>
            <Button
              onClick={handlePriceComparison}
              disabled={loadingStates.price}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {t.comparePrice}
            </Button>
            <Button
              onClick={handleShippingEstimate}
              disabled={loadingStates.shipping}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              {t.calcShipping}
            </Button>
            <Button
              onClick={handleReviewAnalysis}
              disabled={loadingStates.reviews}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              {t.analyzeReviews}
            </Button>
            <Button
              onClick={handleSEOGeneration}
              disabled={loadingStates.seo}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {t.generateSEO}
            </Button>
            <Button
              onClick={handleCompetitorAnalysis}
              disabled={loadingStates.competitors}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              {t.analyzeCompetitors}
            </Button>
          </div>

          {/* Inline Results Panel */}
          <div className="mt-6 space-y-6">
            {/* Other Analyses Inline via Tabs */}
            {(priceComparison || supplierVerification || shippingEstimate || reviewSummary || seoDescription || competitorAnalysis) && (
              <Tabs defaultValue="price" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  {priceComparison && <TabsTrigger value="price">Prices</TabsTrigger>}
                  {supplierVerification && <TabsTrigger value="supplier">Supplier</TabsTrigger>}
                  {shippingEstimate && <TabsTrigger value="shipping">Shipping</TabsTrigger>}
                  {reviewSummary && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
                  {seoDescription && <TabsTrigger value="seo">SEO</TabsTrigger>}
                  {competitorAnalysis && <TabsTrigger value="competitors">Competitors</TabsTrigger>}
                </TabsList>

                {priceComparison && (
                  <TabsContent value="price">
                    <div className="space-y-3">
                      {priceComparison.comparisons.map((comp, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{comp.supplier}</h4>
                              <p className="text-sm text-muted-foreground">{comp.platform}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${comp.total_cost}</p>
                              <p className="text-xs text-muted-foreground">${comp.price} + ${comp.shipping_cost} shipping</p>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between text-sm">
                            <span>{comp.delivery_time}</span>
                            <Badge variant={comp.in_stock ? 'default' : 'destructive'}>
                              {comp.in_stock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {seoDescription && (
                  <TabsContent value="seo">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Title</h4>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(seoDescription.title)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground">{seoDescription.title}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Meta Description</h4>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(seoDescription.meta_description)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground">{seoDescription.meta_description}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Product Description</h4>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(seoDescription.product_description)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap">{seoDescription.product_description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Bullet Points</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {seoDescription.bullet_points.map((point, index) => (
                            <li key={index} className="text-muted-foreground">{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {seoDescription.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary">{keyword}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Image */}
      {analysis.product_image && (
        <Card>
          <CardHeader>
            <CardTitle>{t.productImage}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img 
                src={analysis.product_image} 
                alt={analysis.product_name}
                className="max-w-full h-auto max-h-96 rounded-lg shadow-lg object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t.productOverview}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">{t.description}</h4>
            <p className="text-muted-foreground">{analysis.description}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">{t.keyFeatures}</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.features_list.map((feature, index) => (
                <li key={index} className="text-muted-foreground">{feature}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">{t.specifications}</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(analysis.specs).map(([key, value]) => (
                value && (
                  <div key={key} className="flex">
                    <span className="font-medium capitalize">{key}:</span>
                    <span className="ml-2 text-muted-foreground">{value}</span>
                  </div>
                )
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">{t.priceRange}</h4>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                ${analysis.estimated_price_usd.min} - ${analysis.estimated_price_usd.max}
              </Badge>
              <span className="text-muted-foreground">{t.average}: ${analysis.estimated_price_usd.average}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Strategy */}
      {analysis.pricing_strategy && (
        <Card>
          <CardHeader>
            <CardTitle>💰 {t.pricingStrategy}</CardTitle>
            <CardDescription>{t.pricingStrategyDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{t.wholesalePricing}</h4>
                <p className="text-2xl font-bold text-primary">
                  ${analysis.pricing_strategy.wholesale_price.min} - ${analysis.pricing_strategy.wholesale_price.max}
                </p>
                <p className="text-sm text-muted-foreground">{t.average}: ${analysis.pricing_strategy.wholesale_price.average}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{t.suggestedRetail}</h4>
                <p className="text-2xl font-bold text-green-600">${analysis.pricing_strategy.suggested_retail_price}</p>
                <p className="text-sm text-muted-foreground">{t.competitivePrice}</p>
              </div>
              <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
                <h4 className="font-medium mb-2">{t.profitMargin}</h4>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {analysis.pricing_strategy.profit_margin_percentage}%
                </p>
                <p className="text-sm text-muted-foreground">${analysis.pricing_strategy.profit_margin_dollar} {t.perUnit}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{t.marketPosition}</h4>
                <p className="text-sm">{analysis.pricing_strategy.competitive_analysis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Analysis */}
      {analysis.market_analysis && (
        <Card>
          <CardHeader>
            <CardTitle>📊 {t.marketAnalysis}</CardTitle>
            <CardDescription>{t.marketAnalysisDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium mb-2">{t.demandLevel}</h4>
                <Badge variant={analysis.market_analysis.demand_level === 'high' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                  {analysis.market_analysis.demand_level.toUpperCase()}
                </Badge>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium mb-2">{t.competition}</h4>
                <Badge variant={analysis.market_analysis.competition_level === 'low' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                  {analysis.market_analysis.competition_level.toUpperCase()}
                </Badge>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h4 className="font-medium mb-2">{t.bestPricePoint}</h4>
                <p className="text-2xl font-bold text-primary">${analysis.market_analysis.best_selling_price}</p>
              </div>
              <div className="border rounded-lg p-4 col-span-2 md:col-span-3">
                <h4 className="font-medium mb-2">🎯 {t.targetDemo}</h4>
                <p className="text-muted-foreground">{analysis.market_analysis.target_demographics}</p>
              </div>
              <div className="border rounded-lg p-4 col-span-2 md:col-span-3">
                <h4 className="font-medium mb-2">📅 {t.seasonalTrends}</h4>
                <p className="text-muted-foreground">{analysis.market_analysis.seasonal_trends}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logistics Information */}
      {analysis.logistics && (
        <Card>
          <CardHeader>
            <CardTitle>📦 {t.logistics}</CardTitle>
            <CardDescription>{t.logisticsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">📦 {t.packaging}</h4>
                <p className="text-sm text-muted-foreground">{analysis.logistics.packaging_details}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">⚖️ {t.shippingWeight}</h4>
                <p className="text-sm text-muted-foreground">{analysis.logistics.shipping_weight}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">📏 {t.dimensions}</h4>
                <p className="text-sm text-muted-foreground">{analysis.logistics.shipping_dimensions}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">🏷️ {t.customsClass}</h4>
                <p className="text-sm text-muted-foreground">{analysis.logistics.customs_classification}</p>
              </div>
              <div className="border rounded-lg p-4 col-span-1 md:col-span-2">
                <h4 className="font-medium mb-2">💵 {t.importDuties}</h4>
                <p className="text-sm text-muted-foreground">{analysis.logistics.import_duties_estimate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inline results now shown above in the Advance Analysis Tools card */}
    </div>
  );
}