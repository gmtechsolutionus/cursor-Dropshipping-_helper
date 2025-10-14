'use client';

import React, { useState } from 'react';
import { ImageUpload } from './image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload } from 'lucide-react';

interface ProductInputProps {
  onAnalyze: (data: { image?: File; productName?: string }) => void;
  isAnalyzing?: boolean;
}

export function ProductInput({ onAnalyze, isAnalyzing }: ProductInputProps) {
  const [productName, setProductName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
  };

  const handleImageAnalyze = () => {
    if (selectedFile) {
      onAnalyze({ image: selectedFile });
    }
  };

  const handleTextAnalyze = () => {
    if (productName.trim()) {
      onAnalyze({ productName: productName.trim() });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Product</CardTitle>
        <CardDescription>
          Upload a product image or enter a product name for AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Search by Name
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              isUploading={isAnalyzing}
            />
            <Button 
              onClick={handleImageAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                type="text"
                placeholder="e.g., iPhone 15 Pro Max, Nike Air Max 90, Sony WH-1000XM5"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && productName.trim() && !isAnalyzing) {
                    handleTextAnalyze();
                  }
                }}
                disabled={isAnalyzing}
              />
              <p className="text-sm text-muted-foreground">
                Enter the product name or description for analysis
              </p>
            </div>
            <Button 
              onClick={handleTextAnalyze}
              disabled={!productName.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Product'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}