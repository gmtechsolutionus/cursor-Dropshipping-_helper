'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isUploading?: boolean;
}

export function ImageUpload({ onImageUpload, isUploading }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
        isUploading && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        {acceptedFiles.length > 0 ? (
          <>
            <ImageIcon className="w-12 h-12 text-primary" />
            <div>
              <p className="text-sm font-medium">{acceptedFiles[0].name}</p>
              <p className="text-xs text-gray-500">
                {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to select a file
              </p>
            </div>
          </>
        )}
      </div>
      
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Analyzing...</span>
          </div>
        </div>
      )}
    </div>
  );
}