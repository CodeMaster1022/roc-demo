"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Home, Bath, Car, Maximize } from 'lucide-react';

interface PropertyDetailsStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  data,
  onUpdate
}) => {
  const handleInputChange = (field: string, value: string | number) => {
    onUpdate({ [field]: value });
  };

  const incrementValue = (field: string, current: number) => {
    onUpdate({ [field]: Math.max(0, current + 1) });
  };

  const decrementValue = (field: string, current: number) => {
    onUpdate({ [field]: Math.max(0, current - 1) });
  };

  return (
    <div className="space-y-8">
      {/* Property Area */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Property Size <span className="text-red-500">*</span>
        </Label>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Maximize className="w-5 h-5 mr-2" />
              Total Area
            </CardTitle>
            <CardDescription>
              Enter the total area of your property in square meters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="120"
                value={data.totalArea || ''}
                onChange={(e) => handleInputChange('totalArea', parseFloat(e.target.value) || 0)}
                className="w-32"
                min="0"
                step="0.1"
              />
              <span className="text-gray-600">m²</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Configuration */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Room Configuration <span className="text-red-500">*</span>
        </Label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Rooms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Home className="w-5 h-5 mr-2" />
                Bedrooms
              </CardTitle>
              <CardDescription>
                Number of bedrooms in the property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => decrementValue('totalRooms', data.totalRooms || 0)}
                  disabled={!data.totalRooms || data.totalRooms <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold w-8 text-center">
                  {data.totalRooms || 0}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => incrementValue('totalRooms', data.totalRooms || 0)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Total Bathrooms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Bath className="w-5 h-5 mr-2" />
                Bathrooms
              </CardTitle>
              <CardDescription>
                Total bathrooms (including those in bedrooms)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => decrementValue('totalBathrooms', data.totalBathrooms || 0)}
                  disabled={!data.totalBathrooms || data.totalBathrooms <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold w-8 text-center">
                  {data.totalBathrooms || 0}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => incrementValue('totalBathrooms', data.totalBathrooms || 0)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parking Spaces */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Car className="w-5 h-5 mr-2" />
                Parking Spaces
              </CardTitle>
              <CardDescription>
                Available parking spaces (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => decrementValue('parkingSpaces', data.parkingSpaces || 0)}
                  disabled={!data.parkingSpaces || data.parkingSpaces <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold w-8 text-center">
                  {data.parkingSpaces || 0}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => incrementValue('parkingSpaces', data.parkingSpaces || 0)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Property Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Area:</span>
            <div className="font-semibold">{data.totalArea || 0} m²</div>
          </div>
          <div>
            <span className="text-gray-600">Bedrooms:</span>
            <div className="font-semibold">{data.totalRooms || 0}</div>
          </div>
          <div>
            <span className="text-gray-600">Bathrooms:</span>
            <div className="font-semibold">{data.totalBathrooms || 0}</div>
          </div>
          <div>
            <span className="text-gray-600">Parking:</span>
            <div className="font-semibold">{data.parkingSpaces || 0} spaces</div>
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Important Notes</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Bathroom count should include all bathrooms, including ensuite bathrooms in bedrooms</li>
          <li>• Property area will be verified during the approval process</li>
          <li>• Parking spaces can help increase your property&apos;s appeal to tenants</li>
        </ul>
      </div>
    </div>
  );
};

export default PropertyDetailsStep; 