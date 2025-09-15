"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { propertyTypeOptions, furnishingOptions } from '@/lib/property-mock-data';
import { Home, Building } from 'lucide-react';

interface PropertyBasicsStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyBasicsStep: React.FC<PropertyBasicsStepProps> = ({
  data,
  onUpdate
}) => {
  const handlePropertyTypeSelect = (type: string) => {
    onUpdate({ propertyType: type });
  };

  const handleFurnishingSelect = (furnishing: string) => {
    onUpdate({ furnishingType: furnishing });
  };

  return (
    <div className="space-y-8">
      {/* Property Type Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Property Type <span className="text-red-500">*</span>
        </Label>
        <p className="text-gray-600 mb-6">
          Choose the type of property you want to list on ROC.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {propertyTypeOptions.map((option) => {
            const Icon = option.value === 'house' ? Home : Building;
            const isSelected = data.propertyType === option.value;
            
            return (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-purple-600 bg-purple-50 border-purple-200'
                    : 'hover:border-purple-300'
                }`}
                onClick={() => handlePropertyTypeSelect(option.value)}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`mx-auto mb-3 p-3 rounded-full ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <CardTitle className={`text-lg ${
                    isSelected ? 'text-purple-800' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Furnishing Type Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Furnishing Type <span className="text-red-500">*</span>
        </Label>
        <p className="text-gray-600 mb-6">
          Select the furnishing level of your property.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {furnishingOptions.map((option) => {
            const isSelected = data.furnishingType === option.value;
            
            return (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-purple-600 bg-purple-50 border-purple-200'
                    : 'hover:border-purple-300'
                }`}
                onClick={() => handleFurnishingSelect(option.value)}
              >
                <CardHeader className="text-center">
                  <CardTitle className={`text-base ${
                    isSelected ? 'text-purple-800' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Getting Started</h4>
        <p className="text-blue-800 text-sm">
          These basic selections help us understand your property type and prepare the right 
          configuration options for the following steps. You can always come back and change 
          these selections before submitting.
        </p>
      </div>
    </div>
  );
};

export default PropertyBasicsStep; 