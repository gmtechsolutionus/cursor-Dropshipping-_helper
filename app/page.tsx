'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/image-upload';
import { ProductAnalysisDisplay } from '@/components/product-analysis-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductAnalysis } from '@/types';
import toast from 'react-hot-toast';
import { Moon, Sun, Package, TrendingUp, Shield, Truck, Star, Search } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [productAnalysis, setProductAnalysis] = useState<ProductAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('analyze');
  const { theme, setTheme } = useTheme();

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    const toastId = toast.loading('Analyzing product image...');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        
        if (!base64) {
          throw new Error('Failed to convert image to base64');
        }

        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        setProductAnalysis(data);
        toast.success('Product analyzed successfully!', { id: toastId });
        setActiveTab('results');
      };

      reader.onerror = () => {
        throw new Error('Failed to read image file');
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.', { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const features = [
    { icon: Package, title: 'Product Identification', description: 'AI-powered image recognition' },
    { icon: TrendingUp, title: 'Price Comparison', description: 'Real-time market analysis' },
    { icon: Shield, title: 'Supplier Verification', description: 'Scam detection & ratings' },
    { icon: Truck, title: 'Shipping Calculator', description: 'Customs & delivery estimates' },
    { icon: Star, title: 'Review Analysis', description: 'Fake review detection' },
    { icon: Search, title: 'SEO Optimization', description: 'AI-generated descriptions' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dropshipping Helper</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyze">Analyze Product</TabsTrigger>
            <TabsTrigger value="results" disabled={!productAnalysis}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Product Image</CardTitle>
                <CardDescription>
                  Upload a product image to get instant AI-powered analysis, pricing, and supplier recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload onImageUpload={handleImageUpload} isUploading={isAnalyzing} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <feature.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results">
            {productAnalysis && (
              <ProductAnalysisDisplay analysis={productAnalysis} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}