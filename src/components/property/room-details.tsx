"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  Users,
  Wifi,
  Car,
  Sun,
  Wind,
  Lightbulb,
  Lock,
  Volume2,
  Thermometer,
  Droplets,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  MessageSquare,
  Heart,
  Share,
  Info
} from 'lucide-react';

interface Room {
  roomNumber: number;
  name: string;
  features: string;
  calculatedPrice: number;
  availableFrom: string;
  arrangement: 'mixed' | 'female_only' | 'male_only';
  size?: number;
  photos?: string[];
  description?: string;
  furnishing?: {
    bed: string;
    desk: boolean;
    chair: boolean;
    wardrobe: boolean;
    bedside_table: boolean;
    lighting: string;
    curtains: boolean;
  };
  roomFeatures?: {
    window: boolean;
    balcony: boolean;
    airConditioning: boolean;
    heating: boolean;
    soundproofing: boolean;
    lockableDoor: boolean;
    naturalLight: 'excellent' | 'good' | 'fair' | 'limited';
    ventilation: 'excellent' | 'good' | 'fair' | 'poor';
  };
  isOccupied?: boolean;
  currentTenant?: {
    name: string;
    profileImage: string;
    moveOutDate?: string;
  };
}

interface RoomDetailsProps {
  rooms: Room[];
  propertyName: string;
  propertyId: string;
  propertyRules?: {
    genderRestriction?: 'mixed' | 'female_only' | 'male_only';
    smokingAllowed?: boolean;
    petsAllowed?: boolean;
    guestsAllowed?: boolean;
  };
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ 
  rooms, 
  propertyName,
  propertyId,
  propertyRules 
}) => {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const getFeatureDescription = (feature: string) => {
    const descriptions: { [key: string]: string } = {
      'private_bathroom': 'Private bathroom attached to the room',
      'shared_bathroom': 'Shared bathroom with other tenants',
      'private_bathroom_balcony': 'Private bathroom and balcony access',
      'shared_bathroom_balcony': 'Shared bathroom with private balcony',
      'balcony': 'Private balcony with outdoor space'
    };
    return descriptions[feature] || feature.replace(/_/g, ' ');
  };

  const getArrangementColor = (arrangement: string) => {
    const colors: { [key: string]: string } = {
      'mixed': 'bg-blue-100 text-blue-800',
      'female_only': 'bg-pink-100 text-pink-800',
      'male_only': 'bg-green-100 text-green-800'
    };
    return colors[arrangement] || 'bg-gray-100 text-gray-800';
  };

  const getArrangementLabel = (arrangement: string) => {
    const labels: { [key: string]: string } = {
      'mixed': 'Mixed Gender',
      'female_only': 'Female Only',
      'male_only': 'Male Only'
    };
    return labels[arrangement] || arrangement;
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <Check className="w-4 h-4 text-green-600" />;
      case 'good': return <Check className="w-4 h-4 text-blue-600" />;
      case 'fair': return <Eye className="w-4 h-4 text-yellow-600" />;
      case 'limited':
      case 'poor': return <EyeOff className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const availableRooms = rooms.filter(room => !room.isOccupied);
  const occupiedRooms = rooms.filter(room => room.isOccupied);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Details</h2>
          <p className="text-gray-600">
            {availableRooms.length} of {rooms.length} rooms available
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
          >
            Compare Rooms
          </Button>
        </div>
      </div>

      {/* Room Comparison Table */}
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle>Room Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Feature</th>
                    {rooms.map(room => (
                      <th key={room.roomNumber} className="text-center py-2 px-4">
                        Room {room.roomNumber}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Price</td>
                    {rooms.map(room => (
                      <td key={room.roomNumber} className="text-center py-2 px-4 font-semibold text-purple-600">
                        {formatPrice(room.calculatedPrice)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Size</td>
                    {rooms.map(room => (
                      <td key={room.roomNumber} className="text-center py-2 px-4">
                        {room.size ? `${room.size} m²` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Bathroom</td>
                    {rooms.map(room => (
                      <td key={room.roomNumber} className="text-center py-2 px-4">
                        {room.features.includes('private') ? 'Private' : 'Shared'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Balcony</td>
                    {rooms.map(room => (
                      <td key={room.roomNumber} className="text-center py-2 px-4">
                        {room.features.includes('balcony') || room.roomFeatures?.balcony ? 
                          <Check className="w-4 h-4 text-green-600 mx-auto" /> : 
                          <X className="w-4 h-4 text-red-600 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Available</td>
                    {rooms.map(room => (
                      <td key={room.roomNumber} className="text-center py-2 px-4">
                        {room.isOccupied ? 'Occupied' : new Date(room.availableFrom).toLocaleDateString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Rooms */}
      {availableRooms.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Rooms</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableRooms.map((room) => (
              <Card key={room.roomNumber} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{room.name}</CardTitle>
                      <p className="text-gray-600 text-sm mt-1">
                        Room {room.roomNumber} • {getFeatureDescription(room.features)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatPrice(room.calculatedPrice)}
                      </div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Room Photos */}
                  {room.photos && room.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {room.photos.slice(0, 3).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${room.name} - Photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}

                  {/* Room Description */}
                  {room.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {room.description}
                    </p>
                  )}

                  {/* Room Specs */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {room.size && (
                      <div>
                        <Square className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs text-gray-600">Size</div>
                        <div className="font-semibold">{room.size} m²</div>
                      </div>
                    )}
                    <div>
                      <Bath className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-xs text-gray-600">Bathroom</div>
                      <div className="font-semibold text-xs">
                        {room.features.includes('private') ? 'Private' : 'Shared'}
                      </div>
                    </div>
                    <div>
                      <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-xs text-gray-600">Arrangement</div>
                      <Badge className={`text-xs ${getArrangementColor(room.arrangement)}`}>
                        {getArrangementLabel(room.arrangement)}
                      </Badge>
                    </div>
                  </div>

                  {/* Room Features */}
                  {room.roomFeatures && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Room Features</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Sun className="w-4 h-4 mr-2 text-gray-600" />
                            <span>Natural Light</span>
                          </div>
                          {getQualityIcon(room.roomFeatures.naturalLight)}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Wind className="w-4 h-4 mr-2 text-gray-600" />
                            <span>Ventilation</span>
                          </div>
                          {getQualityIcon(room.roomFeatures.ventilation)}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Thermometer className="w-4 h-4 mr-2 text-gray-600" />
                            <span>AC/Heating</span>
                          </div>
                          {room.roomFeatures.airConditioning || room.roomFeatures.heating ? 
                            <Check className="w-4 h-4 text-green-600" /> : 
                            <X className="w-4 h-4 text-red-600" />
                          }
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Volume2 className="w-4 h-4 mr-2 text-gray-600" />
                            <span>Soundproofing</span>
                          </div>
                          {room.roomFeatures.soundproofing ? 
                            <Check className="w-4 h-4 text-green-600" /> : 
                            <X className="w-4 h-4 text-red-600" />
                          }
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Furnishing */}
                  {room.furnishing && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Furnishing</h4>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        {Object.entries(room.furnishing).map(([key, value]) => {
                          if (typeof value === 'boolean') {
                            return (
                              <div key={key} className="flex items-center justify-between">
                                <span className="capitalize">{key.replace('_', ' ')}</span>
                                {value ? 
                                  <Check className="w-4 h-4 text-green-600" /> : 
                                  <X className="w-4 h-4 text-red-600" />
                                }
                              </div>
                            );
                          } else if (typeof value === 'string') {
                            return (
                              <div key={key} className="flex items-center justify-between">
                                <span className="capitalize">{key.replace('_', ' ')}</span>
                                <span className="text-gray-600 capitalize">{value}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Availability */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Available from {new Date(room.availableFrom).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Available Now
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1"
                      onClick={() => window.location.href = `/apply/property/${propertyId}?roomId=${room.roomNumber}`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Apply for Room
                    </Button>
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Visit
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex justify-center space-x-4 pt-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedRoom(
                        selectedRoom === room.roomNumber ? null : room.roomNumber
                      )}
                    >
                      <Info className="w-4 h-4 mr-1" />
                      {selectedRoom === room.roomNumber ? 'Less' : 'More'} Details
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {selectedRoom === room.roomNumber && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Additional Information</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p>• Monthly rent includes utilities (water, electricity, internet)</p>
                          <p>• Security deposit: One month's rent</p>
                          <p>• Minimum stay: 6 months</p>
                          <p>• 24/7 maintenance support available</p>
                        </div>
                      </div>
                      
                      {propertyRules && (
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">Property Rules</h4>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div className="flex justify-between">
                              <span>Smoking:</span>
                              <span>{propertyRules.smokingAllowed ? 'Allowed' : 'Not allowed'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pets:</span>
                              <span>{propertyRules.petsAllowed ? 'Allowed' : 'Not allowed'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Guests:</span>
                              <span>{propertyRules.guestsAllowed ? 'Allowed with notice' : 'Restricted'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Occupied Rooms */}
      {occupiedRooms.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Currently Occupied</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {occupiedRooms.map((room) => (
              <Card key={room.roomNumber} className="opacity-75">
                <CardContent className="py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-lg">{room.name}</h4>
                      <p className="text-gray-600 text-sm">Room {room.roomNumber}</p>
                      <div className="text-lg font-bold text-gray-600 mt-1">
                        {formatPrice(room.calculatedPrice)}/month
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="outline" className="text-red-700 border-red-300 mb-2">
                        Occupied
                      </Badge>
                      {room.currentTenant?.moveOutDate && (
                        <div className="text-sm text-gray-600">
                          Available: {new Date(room.currentTenant.moveOutDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {room.currentTenant?.moveOutDate && (
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Join Waitlist
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Room Selection Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="py-6">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 rounded-full p-2">
              <Bed className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Choosing the Right Room</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Consider your budget and preferred amenities</p>
                <p>• Think about bathroom sharing preferences</p>
                <p>• Check room orientation for natural light</p>
                <p>• Consider proximity to common areas and noise levels</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomDetails; 