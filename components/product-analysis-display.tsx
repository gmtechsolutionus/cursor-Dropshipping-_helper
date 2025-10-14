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

interface ProductAnalysisDisplayProps {
  analysis: ProductAnalysis;
}

export function ProductAnalysisDisplay({ analysis }: ProductAnalysisDisplayProps) {
  const [priceComparison, setPriceComparison] = useState<PriceComparison | null>(null);
  const [supplierVerification, setSupplierVerification] = useState<SupplierVerification | null>(null);
  const [shippingEstimate, setShippingEstimate] = useState<ShippingEstimate | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [seoDescription, setSeoDescription] = useState<SEODescription | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis | null>(null);
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
        <h2 className="text-3xl font-bold">{analysis.product_name}</h2>
        <div className="flex gap-2">
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Product Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Product Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground">{analysis.description}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Key Features</h4>
            <ul className="list-disc list-inside space-y-1">
              {analysis.features_list.map((feature, index) => (
                <li key={index} className="text-muted-foreground">{feature}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Specifications</h4>
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
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                ${analysis.estimated_price_usd.min} - ${analysis.estimated_price_usd.max}
              </Badge>
              <span className="text-muted-foreground">Average: ${analysis.estimated_price_usd.average}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Options */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Options</CardTitle>
          <CardDescription>Recommended suppliers from various platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.supplier_options.map((supplier, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{supplier.name}</h4>
                    <p className="text-sm text-muted-foreground">{supplier.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${supplier.price}</p>
                    <p className="text-xs text-muted-foreground">{supplier.shipping_time}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{supplier.rating} ({supplier.reviews_count} reviews)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSupplierVerification(supplier)}
                      disabled={loadingStates.supplier}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={supplier.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analysis Tools</CardTitle>
          <CardDescription>Get deeper insights into your product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              onClick={handlePriceComparison}
              disabled={loadingStates.price}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Compare Prices
            </Button>
            <Button
              onClick={handleShippingEstimate}
              disabled={loadingStates.shipping}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Shipping Estimate
            </Button>
            <Button
              onClick={handleReviewAnalysis}
              disabled={loadingStates.reviews}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Analyze Reviews
            </Button>
            <Button
              onClick={handleSEOGeneration}
              disabled={loadingStates.seo}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Generate SEO
            </Button>
            <Button
              onClick={handleCompetitorAnalysis}
              disabled={loadingStates.competitors}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Competitor Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
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
              <Card>
                <CardHeader>
                  <CardTitle>Price Comparison</CardTitle>
                </CardHeader>
                <CardContent>
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
                            <p className="text-xs text-muted-foreground">
                              ${comp.price} + ${comp.shipping_cost} shipping
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span>{comp.delivery_time}</span>
                          <Badge variant={comp.in_stock ? "default" : "destructive"}>
                            {comp.in_stock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {seoDescription && (
            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Optimized Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Title</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(seoDescription.title)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground">{seoDescription.title}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Meta Description</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(seoDescription.meta_description)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground">{seoDescription.meta_description}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Product Description</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(seoDescription.product_description)}
                      >
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
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}