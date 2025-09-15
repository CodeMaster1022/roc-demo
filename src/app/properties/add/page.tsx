"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// Import form steps
import PropertyBasicsStep from '@/components/property/property-basics-step';
import PropertyLocationStep from '@/components/property/property-location-step';
import PropertyDetailsStep from '@/components/property/property-details-step';
import PropertyPricingStep from '@/components/property/property-pricing-step';
import PropertyRoomsStep from '@/components/property/property-rooms-step';
import PropertyContractStep from '@/components/property/property-contract-step';
import PropertyPhotosStep from '@/components/property/property-photos-step';
import PropertyAmenitiesStep from '@/components/property/property-amenities-step';
import PropertyRulesStep from '@/components/property/property-rules-step';
import PropertyReviewStep from '@/components/property/property-review-step';

import { mockPropertyService } from '@/lib/property-mock-data';
import { withAuth } from '@/contexts/auth-context';

interface PropertyFormData {
  // Basic info
  propertyType: string;
  furnishingType: string;
  name: string;
  description: string;
  
  // Location
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coverageAreaId?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Details
  totalArea: number;
  totalRooms: number;
  totalBathrooms: number;
  parkingSpaces: number;
  
  // Pricing
  rentalType: string;
  fullPropertyPrice: number;
  expectedPropertyPrice?: number;
  availableFrom: string;
  
  // Rooms (if applicable)
  rooms: Array<{
    roomNumber: number;
    name: string;
    features: string;
    furnishingType: string;
    price: number;
    calculatedPrice: number;
    availableFrom: string;
    arrangement: string;
  }>;
  
  // Contract
  contractTypes: {
    threeMonths: boolean;
    sixMonths: boolean;
    twelveMonths: boolean;
    custom: {
      enabled: boolean;
      minMonths: number;
      maxMonths: number;
    };
  };
  securityDepositRequired: boolean;
  
  // Media
  photos: Array<{
    url: string;
    caption: string;
    isPrimary: boolean;
    order: number;
  }>;
  
  // Amenities & Rules
  amenities: string[];
  rules: {
    petsAllowed: boolean;
    smokingAllowed: boolean;
    gatheringsAllowed: boolean;
    gatheringDays: string[];
    gatheringTimes: {
      start: string;
      end: string;
    };
  };
  environmentType: string;
  customRules: Array<{
    title: string;
    description: string;
  }>;
}

const INITIAL_FORM_DATA: PropertyFormData = {
  propertyType: '',
  furnishingType: '',
  name: '',
  description: '',
  location: {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Mexico'
  },
  totalArea: 0,
  totalRooms: 0,
  totalBathrooms: 0,
  parkingSpaces: 0,
  rentalType: '',
  fullPropertyPrice: 0,
  availableFrom: '',
  rooms: [],
  contractTypes: {
    threeMonths: false,
    sixMonths: false,
    twelveMonths: false,
    custom: {
      enabled: false,
      minMonths: 1,
      maxMonths: 24
    }
  },
  securityDepositRequired: false,
  photos: [],
  amenities: [],
  rules: {
    petsAllowed: false,
    smokingAllowed: false,
    gatheringsAllowed: false,
    gatheringDays: [],
    gatheringTimes: {
      start: '',
      end: ''
    }
  },
  environmentType: '',
  customRules: []
};

const STEPS = [
  { id: 'basics', title: 'Property Basics', component: PropertyBasicsStep },
  { id: 'location', title: 'Location', component: PropertyLocationStep },
  { id: 'details', title: 'Property Details', component: PropertyDetailsStep },
  { id: 'pricing', title: 'Pricing & Availability', component: PropertyPricingStep },
  { id: 'rooms', title: 'Room Configuration', component: PropertyRoomsStep },
  { id: 'contract', title: 'Rental Options', component: PropertyContractStep },
  { id: 'photos', title: 'Photos', component: PropertyPhotosStep },
  { id: 'amenities', title: 'Amenities', component: PropertyAmenitiesStep },
  { id: 'rules', title: 'Rules & Environment', component: PropertyRulesStep },
  { id: 'review', title: 'Review & Submit', component: PropertyReviewStep }
];

const AddPropertyPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PropertyFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getCurrentStepComponent = () => {
    const StepComponent = STEPS[currentStep].component;
    return (
      <StepComponent
        data={formData}
        onUpdate={updateFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    );
  };

  const validateCurrentStep = (): boolean => {
    const step = STEPS[currentStep];
    
    switch (step.id) {
      case 'basics':
        return !!(formData.propertyType && formData.furnishingType);
      case 'location':
        return !!(formData.location.address && formData.location.city && formData.location.state);
      case 'details':
        return !!(formData.totalArea > 0 && formData.totalRooms > 0 && formData.totalBathrooms > 0);
      case 'pricing':
        return !!(formData.rentalType && formData.fullPropertyPrice > 0 && formData.availableFrom);
      case 'rooms':
        // Only validate if rental type includes rooms
        if (formData.rentalType === 'by_room' || formData.rentalType === 'both') {
          return formData.rooms.length > 0;
        }
        return true;
      case 'contract':
        return !!(formData.contractTypes.threeMonths || formData.contractTypes.sixMonths || 
                 formData.contractTypes.twelveMonths || formData.contractTypes.custom.enabled);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast.error('Please complete all required fields before continuing');
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create a property');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create property
      const propertyData = {
        ...formData,
        hosterId: user._id
      };
      
      const createdProperty = await mockPropertyService.createProperty(propertyData);
      
      // Create rooms if applicable
      if (formData.rooms.length > 0) {
        await mockPropertyService.createRooms(createdProperty._id, formData.rooms);
      }
      
      toast.success('Property created successfully! It has been submitted for review.');
      router.push('/properties');
      
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <Button
              variant="outline"
              onClick={() => router.push('/properties')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index <= currentStep && setCurrentStep(index)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-purple-600 text-white'
                    : index < currentStep
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
                disabled={index > currentStep}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form Step */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              {STEPS[currentStep].title}
              {currentStep === STEPS.length - 1 && (
                <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  Final Step
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getCurrentStepComponent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Property...
                </div>
              ) : (
                'Submit for Review'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default withAuth(AddPropertyPage, { 
  allowedUserTypes: ['hoster'] 
}); 