"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { propertyAmenities } from '@/lib/property-mock-data';
import { Star } from 'lucide-react';

interface PropertyAmenitiesStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyAmenitiesStep: React.FC<PropertyAmenitiesStepProps> = ({
  data,
  onUpdate
}) => {
  const handleAmenityToggle = (amenityId: string, checked: boolean) => {
    const currentAmenities = data.amenities || [];
    const updatedAmenities = checked
      ? [...currentAmenities, amenityId]
      : currentAmenities.filter((id: string) => id !== amenityId);
    
    onUpdate({ amenities: updatedAmenities });
  };

  const groupedAmenities = propertyAmenities.reduce((acc, amenity) => {
    const category = amenity.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, typeof propertyAmenities>);

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'recreation': return 'Recreation & Entertainment';
      case 'utilities': return 'Utilities & Services';
      case 'parking': return 'Parking & Transportation';
      case 'security': return 'Security & Safety';
      case 'accessibility': return 'Accessibility';
      default: return 'Other Amenities';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Property Amenities
        </Label>
        <p className="text-gray-600 mb-6">
          Select the amenities available at your property. These help tenants understand what's included.
        </p>
      </div>

      {/* Amenities by Category */}
      <div className="space-y-6">
        {Object.entries(groupedAmenities).map(([category, amenities]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Star className="w-5 h-5 mr-2" />
                {getCategoryTitle(category)}
              </CardTitle>
              <CardDescription>
                {category === 'recreation' && 'Entertainment and leisure facilities'}
                {category === 'utilities' && 'Essential services and utilities'}
                {category === 'parking' && 'Vehicle parking and transportation'}
                {category === 'security' && 'Safety and security features'}
                {category === 'accessibility' && 'Accessibility and mobility features'}
                {category === 'other' && 'Additional property features'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={amenity.id}
                      checked={data.amenities?.includes(amenity.id) || false}
                      onCheckedChange={(checked) => 
                        handleAmenityToggle(amenity.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={amenity.id} className="text-sm font-medium">
                      {amenity.name.en}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Amenities Summary */}
      {data.amenities && data.amenities.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Selected Amenities ({data.amenities.length})</h4>
          <div className="flex flex-wrap gap-2">
            {data.amenities.map((amenityId: string) => {
              const amenity = propertyAmenities.find(a => a.id === amenityId);
              return amenity ? (
                <span
                  key={amenityId}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {amenity.name.en}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Amenity Guidelines</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Only select amenities that are actually available and accessible to tenants</li>
          <li>• More amenities can increase your property's appeal and rental value</li>
          <li>• Amenities will be verified during the property approval process</li>
          <li>• You can update amenities later if you add new features to your property</li>
        </ul>
      </div>
    </div>
  );
};

export default PropertyAmenitiesStep; 