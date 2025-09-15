"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
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
  { id: 'review', title: 'Review & Save', component: PropertyReviewStep }
];

const EditPropertyPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const propertyId = params.id as string;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const property = await mockPropertyService.getPropertyById(propertyId);
      
      if (!property) {
        toast.error('Property not found');
        router.push('/properties');
        return;
      }

      // Check if user owns this property
      if (property.hosterId !== user?._id) {
        toast.error('You do not have permission to edit this property');
        router.push('/properties');
        return;
      }

      // Transform property data to match form structure
      const prop = property as any; // Type assertion to access all properties
      const transformedData = {
        propertyType: prop.propertyType || '',
        furnishingType: prop.furnishingType || '',
        name: prop.name || '',
        description: prop.description || '',
        location: {
          address: prop.location?.address || '',
          city: prop.location?.city || '',
          state: prop.location?.state || '',
          zipCode: prop.location?.zipCode || '',
          country: prop.location?.country || 'Mexico',
          coverageAreaId: prop.location?.coverageAreaId || '',
          coordinates: prop.location?.coordinates || null
        },
        totalArea: prop.totalArea || 0,
        totalRooms: prop.totalRooms || 0,
        totalBathrooms: prop.totalBathrooms || 0,
        parkingSpaces: prop.parkingSpaces || 0,
        rentalType: prop.rentalType || '',
        fullPropertyPrice: prop.fullPropertyPrice || 0,
        expectedPropertyPrice: prop.expectedPropertyPrice || 0,
        availableFrom: prop.availableFrom || '',
        rooms: prop.rooms || [],
        contractTypes: prop.contractTypes || {
          threeMonths: false,
          sixMonths: false,
          twelveMonths: false,
          custom: {
            enabled: false,
            minMonths: 1,
            maxMonths: 24
          }
        },
        securityDepositRequired: prop.securityDepositRequired || false,
        photos: prop.photos || [],
        amenities: prop.amenities || [],
        rules: prop.rules || {
          petsAllowed: false,
          smokingAllowed: false,
          gatheringsAllowed: false,
          gatheringDays: [],
          gatheringTimes: {
            start: '',
            end: ''
          }
        },
        environmentType: prop.environmentType || '',
        customRules: prop.customRules || []
      };

      setFormData(transformedData);
      setOriginalData({ ...transformedData });
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property data');
      router.push('/properties');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: any) => {
    setFormData((prev: any) => ({ ...prev, ...updates }));
  };

  const getCurrentStepComponent = () => {
    if (!formData) return null;
    
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

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSave = async () => {
    if (!user || !formData) {
      toast.error('Unable to save changes');
      return;
    }

    setSaving(true);
    
    try {
      // Update property
      const updatedProperty = await mockPropertyService.updateProperty(propertyId, {
        ...formData,
        hosterId: user._id,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Property updated successfully!');
      setOriginalData({ ...formData }); // Update original data to reflect saved state
      
      // Optionally redirect to property list or stay on edit page
      router.push('/properties');
      
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/properties');
      }
    } else {
      router.push('/properties');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Property</h3>
              <p className="text-gray-600 mb-6">The property data could not be loaded.</p>
              <Button onClick={() => router.push('/properties')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Properties
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              {hasChanges() && (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>
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

          {/* Changes Indicator */}
          {hasChanges() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-yellow-800">
                  You have unsaved changes. Don't forget to save your updates.
                </span>
              </div>
            </div>
          )}
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
          
          <div className="flex space-x-3">
            {hasChanges() && (
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
            
            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Changes...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Finish
                  </>
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
        </div>
      </main>
    </div>
  );
};

export default withAuth(EditPropertyPage, { 
  allowedUserTypes: ['hoster'] 
}); 