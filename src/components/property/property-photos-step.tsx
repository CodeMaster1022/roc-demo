"use client";

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Star, Image } from 'lucide-react';

interface PropertyPhotosStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyPhotosStep: React.FC<PropertyPhotosStepProps> = ({
  data,
  onUpdate
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newPhotos = Array.from(files).map((file, index) => ({
      url: URL.createObjectURL(file), // In real app, this would be uploaded to server
      caption: '',
      isPrimary: (data.photos?.length || 0) === 0 && index === 0,
      order: (data.photos?.length || 0) + index + 1
    }));

    onUpdate({
      photos: [...(data.photos || []), ...newPhotos]
    });
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = data.photos.filter((_: any, i: number) => i !== index);
    // Reorder remaining photos
    const reorderedPhotos = updatedPhotos.map((photo: any, i: number) => ({
      ...photo,
      order: i + 1,
      isPrimary: i === 0 // First photo becomes primary
    }));
    
    onUpdate({ photos: reorderedPhotos });
  };

  const setPrimaryPhoto = (index: number) => {
    const updatedPhotos = data.photos.map((photo: any, i: number) => ({
      ...photo,
      isPrimary: i === index
    }));
    
    onUpdate({ photos: updatedPhotos });
  };

  const updateCaption = (index: number, caption: string) => {
    const updatedPhotos = [...data.photos];
    updatedPhotos[index] = { ...updatedPhotos[index], caption };
    
    onUpdate({ photos: updatedPhotos });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Property Photos
        </Label>
        <p className="text-gray-600 mb-6">
          Upload high-quality photos of your property. The first photo will be used as the main image.
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Upload className="w-5 h-5 mr-2" />
            Upload Photos
          </CardTitle>
          <CardDescription>
            Drag and drop images here or click to browse. Supported formats: JPG, PNG, WebP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Drag photos here or click to browse
            </p>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="photo-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      {data.photos && data.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Photos ({data.photos.length})</CardTitle>
            <CardDescription>
              Click on a photo to set it as the main image. Add captions to help tenants understand each space.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.photos.map((photo: any, index: number) => (
                <div key={index} className="relative group">
                  <div className={`relative rounded-lg overflow-hidden ${
                    photo.isPrimary ? 'ring-2 ring-purple-500' : ''
                  }`}>
                    <img
                      src={photo.url}
                      alt={photo.caption || `Property photo ${index + 1}`}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setPrimaryPhoto(index)}
                    />
                    
                    {/* Primary Badge */}
                    {photo.isPrimary && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Main
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Caption Input */}
                  <Input
                    placeholder="Add a caption..."
                    value={photo.caption}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    className="mt-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Photo Guidelines</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Upload at least 5-10 high-quality photos for best results</li>
          <li>• Include photos of all rooms, common areas, and exterior</li>
          <li>• Use natural lighting and avoid blurry or dark images</li>
          <li>• The main photo should showcase your property's best feature</li>
          <li>• Add descriptive captions to help tenants understand each space</li>
        </ul>
      </div>

      {/* Photo Requirements */}
      <div className={`p-4 rounded-lg border ${
        data.photos && data.photos.length >= 5 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <h4 className={`font-semibold mb-2 ${
          data.photos && data.photos.length >= 5 ? 'text-green-900' : 'text-yellow-900'
        }`}>
          Photo Requirements {data.photos && data.photos.length >= 5 ? '✓' : ''}
        </h4>
        <p className={`text-sm ${
          data.photos && data.photos.length >= 5 ? 'text-green-800' : 'text-yellow-800'
        }`}>
          {data.photos && data.photos.length >= 5 
            ? `Great! You have ${data.photos.length} photos uploaded. Your listing will look attractive to potential tenants.`
            : `You have ${data.photos?.length || 0} photos. We recommend at least 5 photos for a complete listing.`
          }
        </p>
      </div>
    </div>
  );
};

export default PropertyPhotosStep; 