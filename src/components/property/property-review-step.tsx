"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { propertyAmenities, roomFeatureOptions } from '@/lib/property-mock-data';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar, 
  FileText, 
  Star, 
  Shield,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PropertyReviewStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyReviewStep: React.FC<PropertyReviewStepProps> = ({ data }) => {
  const getAmenityName = (amenityId: string) => {
    const amenity = propertyAmenities.find(a => a.id === amenityId);
    return amenity?.name.en || amenityId;
  };

  const getRoomFeatureName = (featureValue: string) => {
    const feature = roomFeatureOptions.find(f => f.value === featureValue);
    return feature?.label || featureValue;
  };

  const getCompletionStatus = () => {
    const checks = [
      { label: 'Basic Information', complete: !!(data.propertyType && data.furnishingType) },
      { label: 'Location Details', complete: !!(data.location?.address && data.location?.city) },
      { label: 'Property Details', complete: !!(data.totalArea && data.totalRooms && data.totalBathrooms) },
      { label: 'Pricing & Availability', complete: !!(data.rentalType && data.fullPropertyPrice && data.availableFrom) },
      { label: 'Room Configuration', complete: data.rentalType === 'full_property' || (data.rooms && data.rooms.length > 0) },
      { label: 'Contract Terms', complete: !!(data.contractTypes?.threeMonths || data.contractTypes?.sixMonths || data.contractTypes?.twelveMonths || data.contractTypes?.custom?.enabled) },
      { label: 'Photos', complete: data.photos && data.photos.length >= 1 },
      { label: 'Amenities', complete: true }, // Optional
      { label: 'Rules & Environment', complete: true } // Optional
    ];

    const completed = checks.filter(check => check.complete).length;
    const total = checks.length;
    
    return { checks, completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const status = getCompletionStatus();
  const isReadyToSubmit = status.percentage >= 90; // Need at least 90% completion

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Property Listing</h2>
        <p className="text-gray-600">
          Please review all information before submitting your property for approval.
        </p>
      </div>

      {/* Completion Status */}
      <Card className={`border-2 ${isReadyToSubmit ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center text-lg ${isReadyToSubmit ? 'text-green-900' : 'text-yellow-900'}`}>
            {isReadyToSubmit ? <CheckCircle className="w-6 h-6 mr-2" /> : <AlertCircle className="w-6 h-6 mr-2" />}
            Listing Completion: {status.percentage}%
          </CardTitle>
          <CardDescription className={isReadyToSubmit ? 'text-green-700' : 'text-yellow-700'}>
            {isReadyToSubmit 
              ? 'Your listing is ready for submission!'
              : 'Please complete the remaining sections to submit your listing.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {status.checks.map((check, index) => (
              <div key={index} className="flex items-center space-x-2">
                {check.complete ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
                <span className={`text-sm ${check.complete ? 'text-green-800' : 'text-yellow-800'}`}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Property Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium capitalize">{data.propertyType || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Furnishing:</span>
                  <span className="font-medium capitalize">{data.furnishingType?.replace('_', ' ') || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Area:</span>
                  <span className="font-medium">{data.totalArea || 0} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rooms:</span>
                  <span className="font-medium">{data.totalRooms || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">{data.totalBathrooms || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parking:</span>
                  <span className="font-medium">{data.parkingSpaces || 0} spaces</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{data.location?.address || 'Address not provided'}</div>
                    <div className="text-gray-600">
                      {data.location?.city}, {data.location?.state} {data.location?.zipCode}
                    </div>
                    <div className="text-gray-600">{data.location?.country}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Rental Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Pricing & Rental Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Rental Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental Type:</span>
                    <Badge variant="secondary" className="capitalize">
                      {data.rentalType?.replace('_', ' ') || 'Not specified'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Price:</span>
                    <span className="font-semibold text-green-600">
                      ${data.fullPropertyPrice?.toLocaleString() || 0} MXN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available From:</span>
                    <span className="font-medium">
                      {data.availableFrom ? new Date(data.availableFrom).toLocaleDateString() : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Contract Terms</h4>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {data.contractTypes?.threeMonths && <Badge variant="outline">3 months</Badge>}
                  {data.contractTypes?.sixMonths && <Badge variant="outline">6 months</Badge>}
                  {data.contractTypes?.twelveMonths && <Badge variant="outline">12 months</Badge>}
                  {data.contractTypes?.custom?.enabled && (
                    <Badge variant="outline">
                      Custom ({data.contractTypes.custom.minMonths}-{data.contractTypes.custom.maxMonths} months)
                    </Badge>
                  )}
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Security Deposit: </span>
                  <span className={`font-medium ${data.securityDepositRequired ? 'text-yellow-600' : 'text-green-600'}`}>
                    {data.securityDepositRequired ? 'Required' : 'Not required'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Configuration */}
      {data.rooms && data.rooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Room Configuration ({data.rooms.length} rooms)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.rooms.map((room: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{room.name || `Room ${room.roomNumber}`}</h5>
                    <Badge variant="secondary">
                      ${room.calculatedPrice?.toLocaleString() || 0} MXN
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Features: {getRoomFeatureName(room.features)}</div>
                    <div>Furnishing: {room.furnishingType?.replace('_', ' ')}</div>
                    <div>Arrangement: {room.arrangement?.replace('_', ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos */}
      {data.photos && data.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Photos ({data.photos.length} uploaded)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.photos.slice(0, 8).map((photo: any, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  {photo.isPrimary && (
                    <div className="absolute top-1 left-1 bg-purple-600 text-white px-1 py-0.5 rounded text-xs flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Main
                    </div>
                  )}
                </div>
              ))}
              {data.photos.length > 8 && (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg h-24">
                  <span className="text-sm text-gray-600">+{data.photos.length - 8} more</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Amenities */}
      {data.amenities && data.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Amenities ({data.amenities.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.amenities.map((amenityId: string) => (
                <Badge key={amenityId} variant="outline">
                  {getAmenityName(amenityId)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules & Environment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Property Rules & Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Basic Rules</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pets:</span>
                  <span className={data.rules?.petsAllowed ? 'text-green-600' : 'text-red-600'}>
                    {data.rules?.petsAllowed ? 'Allowed' : 'Not allowed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Smoking:</span>
                  <span className={data.rules?.smokingAllowed ? 'text-yellow-600' : 'text-green-600'}>
                    {data.rules?.smokingAllowed ? 'Allowed' : 'Not allowed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gatherings:</span>
                  <span className={data.rules?.gatheringsAllowed ? 'text-blue-600' : 'text-gray-600'}>
                    {data.rules?.gatheringsAllowed ? 'Allowed' : 'Not allowed'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Environment</h4>
              <div className="text-sm">
                <Badge variant="secondary" className="capitalize">
                  {data.environmentType || 'Not specified'}
                </Badge>
              </div>
              {data.customRules && data.customRules.length > 0 && (
                <div className="mt-3">
                  <span className="text-sm text-gray-600">
                    {data.customRules.length} custom rule{data.customRules.length !== 1 ? 's' : ''} added
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">What happens next?</h4>
        <div className="space-y-2 text-blue-800 text-sm">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Your property will be reviewed by our team within 24-48 hours
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            You'll receive an email notification once approved
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Your listing will go live and be visible to potential tenants
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            You can manage applications and bookings from your dashboard
          </div>
        </div>
      </div>

      {!isReadyToSubmit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Complete Your Listing</h4>
          <p className="text-yellow-800 text-sm">
            Please go back and complete the missing sections to submit your property for review. 
            A complete listing has a much higher chance of attracting quality tenants.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyReviewStep; 