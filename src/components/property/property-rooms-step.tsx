"use client";

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { roomFeatureOptions, furnishingOptions, calculateRoomPrices } from '@/lib/property-mock-data';
import { Plus, Trash2, Calculator, Users, Calendar } from 'lucide-react';

interface PropertyRoomsStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyRoomsStep: React.FC<PropertyRoomsStepProps> = ({
  data,
  onUpdate
}) => {
  // Skip this step if rental type is full_property only
  if (data.rentalType === 'full_property') {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Room Configuration Not Required</h3>
          <p className="text-gray-600">
            Since you're renting the entire property, individual room configuration is not needed.
          </p>
        </div>
      </div>
    );
  }

  // Initialize rooms if empty
  useEffect(() => {
    if (data.rooms.length === 0 && data.totalRooms > 0) {
      const initialRooms = Array.from({ length: data.totalRooms }, (_, index) => ({
        roomNumber: index + 1,
        name: `Room ${index + 1}`,
        features: '',
        furnishingType: data.furnishingType || '',
        price: 0,
        calculatedPrice: 0,
        availableFrom: data.availableFrom || '',
        arrangement: 'mixed'
      }));
      onUpdate({ rooms: initialRooms });
    }
  }, [data.totalRooms, data.rooms.length, data.furnishingType, data.availableFrom, onUpdate]);

  // Recalculate room prices when features change
  useEffect(() => {
    if (data.rooms.length > 0 && data.fullPropertyPrice > 0) {
      const updatedRooms = calculateRoomPrices(data.rooms, data.fullPropertyPrice);
      onUpdate({ rooms: updatedRooms });
    }
  }, [data.fullPropertyPrice]); // Only recalculate when property price changes

  const updateRoom = (index: number, updates: any) => {
    const updatedRooms = [...data.rooms];
    updatedRooms[index] = { ...updatedRooms[index], ...updates };
    
    // Recalculate prices if features changed
    if (updates.features) {
      const roomsWithPrices = calculateRoomPrices(updatedRooms, data.fullPropertyPrice);
      onUpdate({ rooms: roomsWithPrices });
    } else {
      onUpdate({ rooms: updatedRooms });
    }
  };

  const addRoom = () => {
    const newRoom = {
      roomNumber: data.rooms.length + 1,
      name: `Room ${data.rooms.length + 1}`,
      features: '',
      furnishingType: data.furnishingType || '',
      price: 0,
      calculatedPrice: 0,
      availableFrom: data.availableFrom || '',
      arrangement: 'mixed'
    };
    onUpdate({ rooms: [...data.rooms, newRoom] });
  };

  const removeRoom = (index: number) => {
    const updatedRooms = data.rooms.filter((_: any, i: number) => i !== index);
    // Renumber remaining rooms
    const renumberedRooms = updatedRooms.map((room: any, i: number) => ({
      ...room,
      roomNumber: i + 1,
      name: room.name.includes('Room') ? `Room ${i + 1}` : room.name
    }));
    onUpdate({ rooms: renumberedRooms });
  };

  const getFeaturePoints = (featureValue: string) => {
    const feature = roomFeatureOptions.find(f => f.value === featureValue);
    return feature?.points || 0;
  };

  const getTotalPoints = () => {
    return data.rooms.reduce((sum: number, room: any) => sum + getFeaturePoints(room.features), 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Room Configuration <span className="text-red-500">*</span>
        </Label>
        <p className="text-gray-600 mb-6">
          Configure each room individually. Prices will be calculated automatically based on room features.
        </p>
      </div>

      {/* Pricing Algorithm Info */}
      {data.fullPropertyPrice > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Calculator className="w-5 h-5 mr-2" />
              Dynamic Pricing Algorithm
            </CardTitle>
            <CardDescription>
              Room prices are calculated using our point-based system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Total Property Price:</span>
                <span className="font-semibold">${data.fullPropertyPrice?.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between">
                <span>Total Feature Points:</span>
                <span className="font-semibold">{getTotalPoints()} points</span>
              </div>
              <p className="text-purple-800 text-xs mt-2">
                Each room's price = (Room Points ÷ Total Points) × Property Price
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Room List */}
      <div className="space-y-6">
        {data.rooms.map((room: any, index: number) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Room {room.roomNumber}</CardTitle>
                  <CardDescription>Configure room features and details</CardDescription>
                </div>
                {data.rooms.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeRoom(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Room Name */}
              <div>
                <Label className="text-sm font-medium">Room Name</Label>
                <Input
                  value={room.name}
                  onChange={(e) => updateRoom(index, { name: e.target.value })}
                  placeholder={`Room ${room.roomNumber}`}
                  className="mt-1"
                />
              </div>

              {/* Room Features */}
              <div>
                <Label className="text-sm font-medium">
                  Room Features <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={room.features}
                  onValueChange={(value) => updateRoom(index, { features: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select room features" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomFeatureOptions.map((feature) => (
                      <SelectItem key={feature.value} value={feature.value}>
                        <div>
                          <div className="font-medium">{feature.label}</div>
                          <div className="text-xs text-gray-500">
                            {feature.points} points - {feature.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Furnishing Type */}
              <div>
                <Label className="text-sm font-medium">Furnishing</Label>
                <Select
                  value={room.furnishingType}
                  onValueChange={(value) => updateRoom(index, { furnishingType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select furnishing type" />
                  </SelectTrigger>
                  <SelectContent>
                    {furnishingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Room Arrangement */}
              <div>
                <Label className="text-sm font-medium">Room Arrangement</Label>
                <Select
                  value={room.arrangement}
                  onValueChange={(value) => updateRoom(index, { arrangement: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed Gender</SelectItem>
                    <SelectItem value="male_only">Male Only</SelectItem>
                    <SelectItem value="female_only">Female Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Available From */}
              <div>
                <Label className="text-sm font-medium">Available From</Label>
                <Input
                  type="date"
                  value={room.availableFrom}
                  onChange={(e) => updateRoom(index, { availableFrom: e.target.value })}
                  className="mt-1 w-48"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Calculated Price Display */}
              {room.features && data.fullPropertyPrice > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-green-900">Calculated Monthly Price</p>
                      <p className="text-xs text-green-700">
                        {getFeaturePoints(room.features)} points ({Math.round((getFeaturePoints(room.features) / getTotalPoints()) * 100)}% of total)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ${room.calculatedPrice?.toLocaleString()} MXN
                      </p>
                      <p className="text-xs text-green-600">
                        Tenant pays: ${Math.round(room.calculatedPrice * 1.07)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Room Button */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={addRoom}
          className="border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Room
        </Button>
      </div>

      {/* Summary */}
      {data.rooms.length > 0 && getTotalPoints() > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Room Configuration Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Rooms:</span>
              <span className="font-semibold">{data.rooms.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Feature Points:</span>
              <span className="font-semibold">{getTotalPoints()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Combined Monthly Revenue:</span>
              <span className="font-semibold text-green-600">
                ${data.rooms.reduce((sum: number, room: any) => sum + (room.calculatedPrice || 0), 0).toLocaleString()} MXN
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Room Configuration Tips</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Room prices are calculated automatically based on features and property value</li>
          <li>• Higher-point features (private bathroom, terrace) get higher prices</li>
          <li>• You can adjust the base property price to affect all room prices proportionally</li>
          <li>• Room arrangements help tenants find compatible living situations</li>
        </ul>
      </div>
    </div>
  );
};

export default PropertyRoomsStep; 