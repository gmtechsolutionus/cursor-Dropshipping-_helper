'use client';

import { useState } from 'react';
import { ProductInput } from '@/components/product-input';
import { ProductAnalysisDisplay } from '@/components/product-analysis-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductAnalysis } from '@/types';
import toast from 'react-hot-toast';
import { Moon, Sun, Package, TrendingUp, Shield, Truck, Star, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [productAnalysis, setProductAnalysis] = useState<ProductAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('analyze');
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const handleProductAnalyze = async (data: { image?: File; productName?: string }) => {
    setIsAnalyzing(true);
    const toastId = toast.loading(data.image ? 'Analyzing product image...' : 'Analyzing product...');

    try {
      if (data.image) {
        // Handle image upload
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(data.image!);
          reader.onload = () => {
            const result = reader.result?.toString().split(',')[1];
            if (result) {
              resolve(result);
            } else {
              reject(new Error('Failed to convert image to base64'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read image file'));
        });

        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.details || 'Failed to analyze image');
        }

        const analysisData = await response.json();
        setProductAnalysis(analysisData);
        toast.success('Product analyzed successfully!', { id: toastId });
        setActiveTab('results');
        setIsAnalyzing(false);
      } else if (data.productName) {
        // Handle text-based analysis
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productName: data.productName }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.details || 'Failed to analyze product');
        }

        const analysisData = await response.json();
        setProductAnalysis(analysisData);
        toast.success('Product analyzed successfully!', { id: toastId });
        setActiveTab('results');
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze product. Please try again.', { id: toastId });
      setIsAnalyzing(false);
    }
  };

  const features = [
    { icon: Package, title: t.features.productId, description: t.features.productIdDesc },
    { icon: TrendingUp, title: t.features.priceComp, description: t.features.priceCompDesc },
    { icon: Shield, title: t.features.supplierVerify, description: t.features.supplierVerifyDesc },
    { icon: Truck, title: t.features.shippingCalc, description: t.features.shippingCalcDesc },
    { icon: Star, title: t.features.reviewAnalysis, description: t.features.reviewAnalysisDesc },
    { icon: Search, title: t.features.seoOptimization, description: t.features.seoOptimizationDesc },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* App chrome */}
      <div className="sticky top-0 z-40">
        <header className="glass border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary via-fuchsia-500 to-cyan-400" />
              <h1 className="text-2xl font-extrabold tracking-tight heading-gradient font-heading">{t.appTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="btn-modern"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>
          </div>
        </header>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="glass rounded-2xl p-4 sticky top-20">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Quick Tools</div>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start btn-modern"><Search className="h-4 w-4 mr-2" />{t.generateSEO}</Button>
                  <Button variant="outline" className="justify-start btn-modern"><TrendingUp className="h-4 w-4 mr-2" />{t.comparePrice}</Button>
                  <Button variant="outline" className="justify-start btn-modern"><Shield className="h-4 w-4 mr-2" />{t.verifySupplier}</Button>
                  <Button variant="outline" className="justify-start btn-modern"><Truck className="h-4 w-4 mr-2" />{t.calcShipping}</Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="min-w-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analyze">{t.analyzeProduct}</TabsTrigger>
                <TabsTrigger value="results" disabled={!productAnalysis}>
                  {t.results}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analyze" className="space-y-6">
                <Card className="neon-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-heading">AI Product Intelligence</CardTitle>
                        <CardDescription>Analyze by image or name to unlock insights</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ProductInput 
                      onAnalyze={handleProductAnalyze} 
                      isAnalyzing={isAnalyzing} 
                    />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <Card key={index} className="hover:translate-y-[-2px] transition-transform">
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <feature.icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg font-heading">{feature.title}</CardTitle>
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
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-xs text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} Dropshipping Helper</span>
          <span>Built with next@15, React 19, Tailwind</span>
        </div>
      </footer>
    </div>
  );
}