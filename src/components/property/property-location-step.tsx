"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { coverageAreas } from '@/lib/property-mock-data';
import { MapPin, Info } from 'lucide-react';

interface PropertyLocationStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyLocationStep: React.FC<PropertyLocationStepProps> = ({
  data,
  onUpdate
}) => {
  const handleLocationChange = (field: string, value: string) => {
    onUpdate({
      location: {
        ...data.location,
        [field]: value
      }
    });
  };

  const handleCoverageAreaChange = (areaId: string) => {
    const selectedArea = coverageAreas.find(area => area.id === areaId);
    if (selectedArea) {
      onUpdate({
        location: {
          ...data.location,
          coverageAreaId: areaId,
          city: selectedArea.city,
          state: selectedArea.state
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Coverage Area Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Coverage Area (Optional)
        </Label>
        <p className="text-gray-600 mb-6">
          Select a coverage area if your property falls within one of our priority zones. 
          This can help with faster approval and better visibility.
        </p>
        
        <Select 
          value={data.location.coverageAreaId || ""} 
          onValueChange={handleCoverageAreaChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a coverage area (optional)" />
          </SelectTrigger>
          <SelectContent>
            {coverageAreas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name} - {area.city}, {area.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Address Information */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Property Address <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-4">
          {/* Street Address */}
          <div>
            <Label htmlFor="address" className="text-sm font-medium">
              Street Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="e.g., Calle Orizaba 123, Col. Roma Norte"
              value={data.location.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., Mexico City"
                value={data.location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="state" className="text-sm font-medium">
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                type="text"
                placeholder="e.g., CDMX"
                value={data.location.state}
                onChange={(e) => handleLocationChange('state', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Zip Code and Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode" className="text-sm font-medium">
                Zip Code
              </Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="e.g., 06700"
                value={data.location.zipCode}
                onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="country" className="text-sm font-medium">
                Country
              </Label>
              <Input
                id="country"
                type="text"
                value={data.location.country}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                className="mt-1"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map Preview Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Preview
          </CardTitle>
          <CardDescription>
            Location verification will be processed during review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                Map preview will appear here
              </p>
              <p className="text-gray-400 text-xs">
                Google Maps integration coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <Info className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Location Information</h4>
            <p className="text-amber-800 text-sm">
              Your exact address will only be shared with approved tenants. We use this information 
              to verify your property location and ensure it complies with local regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyLocationStep; 