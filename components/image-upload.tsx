'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
  isUploading?: boolean;
  selectedFile?: File | null;
}

export function ImageUpload({ onImageUpload, isUploading, selectedFile }: ImageUploadProps) {
  const [localFile, setLocalFile] = useState<File | null>(null);

  useEffect(() => {
    setLocalFile(selectedFile || null);
  }, [selectedFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setLocalFile(file);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const clearFile = () => {
    setLocalFile(null);
    onImageUpload(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    disabled: isUploading || !!localFile
  });

  if (localFile) {
    return (
      <div className="relative border-2 border-solid border-primary rounded-2xl p-8 bg-primary/5 glass">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={clearFile}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center space-y-4">
          <ImageIcon className="w-12 h-12 text-primary" />
          <div className="text-center">
            <p className="text-sm font-medium">{localFile.name}</p>
            <p className="text-xs text-gray-500">
              {(localFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors glass",
        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
        isUploading && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        <Upload className="w-12 h-12 text-primary" />
        <div>
          <p className="text-sm font-medium">
            {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            or click to select a file
          </p>
        </div>
      </div>
    </div>
  );
}