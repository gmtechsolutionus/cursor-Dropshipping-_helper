'use client';

import React, { useState } from 'react';
import { ImageUpload } from './image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductInputProps {
  onAnalyze: (data: { image?: File; productName?: string }) => void;
  isAnalyzing?: boolean;
}

export function ProductInput({ onAnalyze, isAnalyzing }: ProductInputProps) {
  const [productName, setProductName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const { t } = useLanguage();

  const handleImageUpload = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleImageAnalyze = () => {
    if (selectedFile) {
      onAnalyze({ image: selectedFile });
      // Reset after submit
      setSelectedFile(null);
    }
  };

  const handleTextAnalyze = () => {
    if (productName.trim()) {
      onAnalyze({ productName: productName.trim() });
      // Reset after submit
      setProductName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.analyzeProduct}</CardTitle>
        <CardDescription>
          {t.uploadImage} {t.orEnterName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              {t.uploadImage}
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              {t.orEnterName}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              isUploading={false}
              selectedFile={selectedFile}
            />
            {selectedFile && (
              <Button 
                onClick={handleImageAnalyze}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isAnalyzing ? t.analyzing : t.analyzeButton}
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">{t.orEnterName}</Label>
              <Input
                id="product-name"
                type="text"
                placeholder={t.productNamePlaceholder}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && productName.trim() && !isAnalyzing) {
                    handleTextAnalyze();
                  }
                }}
                disabled={isAnalyzing}
              />
            </div>
            <Button 
              onClick={handleTextAnalyze}
              disabled={!productName.trim() || isAnalyzing}
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? t.analyzing : t.analyzeButton}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}