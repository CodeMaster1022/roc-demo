"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Download, 
  Share,
  Grid3X3,
  Play
} from 'lucide-react';

interface Photo {
  url: string;
  caption: string;
  isPrimary: boolean;
  order: number;
  roomId?: string;
  type?: 'property' | 'room' | 'amenity' | 'neighborhood';
}

interface PhotoGalleryProps {
  photos: Photo[];
  propertyName: string;
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ 
  photos, 
  propertyName,
  className = "" 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
  };

  const getPhotosByType = (type: string) => {
    return photos.filter(photo => photo.type === type);
  };

  const mainPhotos = photos.slice(0, 5);
  const remainingCount = photos.length - 5;

  return (
    <div className={className}>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 h-96 rounded-lg overflow-hidden">
        {/* Main large image */}
        <div 
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={mainPhotos[0]?.url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'}
            alt={mainPhotos[0]?.caption || propertyName}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
            <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {mainPhotos[0]?.isPrimary && (
            <Badge className="absolute top-2 left-2 bg-purple-600">
              Primary Photo
            </Badge>
          )}
        </div>

        {/* Smaller images */}
        {mainPhotos.slice(1, 5).map((photo, index) => (
          <div 
            key={index + 1}
            className="relative cursor-pointer group"
            onClick={() => openLightbox(index + 1)}
          >
            <img
              src={photo?.url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop'}
              alt={photo?.caption || `${propertyName} - Image ${index + 2}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
              <Maximize className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Show remaining count on last image */}
            {index === 3 && remainingCount > 0 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllPhotos(true);
                }}
              >
                <div className="text-white text-center">
                  <Grid3X3 className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-lg font-semibold">+{remainingCount}</div>
                  <div className="text-sm">View all photos</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gallery Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllPhotos(true)}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            View all {photos.length} photos
          </Button>
          {/* Virtual Tour Button (placeholder) */}
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Virtual Tour
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent 
          className="max-w-7xl w-full h-full max-h-screen p-0 bg-black"
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">
            Photo Gallery - {photos[selectedImage]?.caption || `Photo ${selectedImage + 1}`}
          </DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={nextImage}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Main image */}
            <img
              src={photos[selectedImage]?.url}
              alt={photos[selectedImage]?.caption || propertyName}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-lg font-semibold">
                    {photos[selectedImage]?.caption || `Photo ${selectedImage + 1}`}
                  </div>
                  <div className="text-sm opacity-80">
                    {selectedImage + 1} of {photos.length}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
              <div className="flex space-x-2 bg-black/50 rounded-lg p-2">
                {photos.slice(Math.max(0, selectedImage - 2), selectedImage + 3).map((photo, index) => {
                  const actualIndex = Math.max(0, selectedImage - 2) + index;
                  return (
                    <img
                      key={actualIndex}
                      src={photo.url}
                      alt={photo.caption}
                      className={`w-12 h-12 object-cover rounded cursor-pointer transition-opacity ${
                        actualIndex === selectedImage ? 'opacity-100 ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                      }`}
                      onClick={() => setSelectedImage(actualIndex)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* All Photos Grid Modal */}
      <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">All Photos Gallery</DialogTitle>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Photos ({photos.length})</h2>
              <Button variant="ghost" onClick={() => setShowAllPhotos(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Photos by category */}
            {['property', 'room', 'amenity', 'neighborhood'].map((type) => {
              const typePhotos = getPhotosByType(type);
              if (typePhotos.length === 0) return null;

              return (
                <div key={type}>
                  <h3 className="text-lg font-semibold mb-3 capitalize">
                    {type} Photos ({typePhotos.length})
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {typePhotos.map((photo, index) => (
                      <div 
                        key={index}
                        className="relative cursor-pointer group"
                        onClick={() => {
                          const photoIndex = photos.findIndex(p => p.url === photo.url);
                          setShowAllPhotos(false);
                          openLightbox(photoIndex);
                        }}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-24 object-cover rounded transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded" />
                        {photo.isPrimary && (
                          <Badge className="absolute top-1 left-1 text-xs bg-purple-600">
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* All photos if no categories */}
            {photos.every(p => !p.type) && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo, index) => (
                  <div 
                    key={index}
                    className="relative cursor-pointer group"
                    onClick={() => {
                      setShowAllPhotos(false);
                      openLightbox(index);
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-24 object-cover rounded transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded" />
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="text-xs text-white bg-black/50 rounded px-1 truncate">
                        {photo.caption}
                      </div>
                    </div>
                    {photo.isPrimary && (
                      <Badge className="absolute top-1 left-1 text-xs bg-purple-600">
                        Primary
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoGallery; 