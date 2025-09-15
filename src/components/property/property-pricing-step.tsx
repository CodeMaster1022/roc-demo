"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { rentalTypeOptions } from '@/lib/property-mock-data';
import { DollarSign, Calendar, Home, Users, Building } from 'lucide-react';

interface PropertyPricingStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyPricingStep: React.FC<PropertyPricingStepProps> = ({
  data,
  onUpdate
}) => {
  const handleRentalTypeSelect = (type: string) => {
    onUpdate({ rentalType: type });
  };

  const handleInputChange = (field: string, value: string | number) => {
    onUpdate({ [field]: value });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full_property': return Home;
      case 'by_room': return Users;
      case 'both': return Building;
      default: return Home;
    }
  };

  return (
    <div className="space-y-8">
      {/* Rental Type Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Rental Type <span className="text-red-500">*</span>
        </Label>
        <p className="text-gray-600 mb-6">
          Choose how you want to rent your property. This affects pricing and tenant management.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rentalTypeOptions.map((option) => {
            const Icon = getTypeIcon(option.value);
            const isSelected = data.rentalType === option.value;
            
            return (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-purple-600 bg-purple-50 border-purple-200'
                    : 'hover:border-purple-300'
                }`}
                onClick={() => handleRentalTypeSelect(option.value)}
              >
                <CardHeader className="text-center pb-3">
                  <div className={`mx-auto mb-3 p-3 rounded-full ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon size={24} />
                  </div>
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

      {/* Property Price */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Property Pricing <span className="text-red-500">*</span>
        </Label>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <DollarSign className="w-5 h-5 mr-2" />
              {data.rentalType === 'full_property' ? 'Monthly Rent' : 'Expected Property Price'}
            </CardTitle>
            <CardDescription>
              {data.rentalType === 'full_property' 
                ? 'Set the monthly rent for the entire property'
                : data.rentalType === 'by_room'
                ? 'Set the total value to calculate individual room prices'
                : 'Set the base price for full property rental (room prices will be calculated automatically)'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">$</span>
              <Input
                type="number"
                placeholder="25000"
                value={data.fullPropertyPrice || ''}
                onChange={(e) => handleInputChange('fullPropertyPrice', parseFloat(e.target.value) || 0)}
                className="w-40"
                min="0"
                step="100"
              />
              <span className="text-gray-600">MXN / month</span>
            </div>
            
            {data.rentalType === 'both' && data.fullPropertyPrice > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Room pricing will be calculated automatically</strong> based on room features 
                  using our point system. You can review and adjust individual room prices in the next step.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Availability Date */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Availability <span className="text-red-500">*</span>
        </Label>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Calendar className="w-5 h-5 mr-2" />
              Available From
            </CardTitle>
            <CardDescription>
              When will your property be available for rent?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={data.availableFrom}
              onChange={(e) => handleInputChange('availableFrom', e.target.value)}
              className="w-48"
              min={new Date().toISOString().split('T')[0]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Pricing Summary */}
      {data.fullPropertyPrice > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Pricing Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Monthly Price:</span>
              <span className="font-semibold">${data.fullPropertyPrice?.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee (7%):</span>
              <span className="font-semibold">+${Math.round(data.fullPropertyPrice * 0.07)?.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ROC Commission (3%):</span>
              <span className="font-semibold">-${Math.round(data.fullPropertyPrice * 0.03)?.toLocaleString()} MXN</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Tenant Pays:</span>
              <span>${Math.round(data.fullPropertyPrice * 1.07)?.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>You Receive:</span>
              <span className="text-green-600">${Math.round(data.fullPropertyPrice * 0.97)?.toLocaleString()} MXN</span>
            </div>
          </div>
        </div>
      )}

      {/* Information Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Pricing Guidelines</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Research similar properties in your area for competitive pricing</li>
          <li>• Consider your property's unique features and amenities</li>
          <li>• Room prices are calculated automatically using our point-based system</li>
          <li>• You can adjust individual room prices in the next step if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default PropertyPricingStep; 