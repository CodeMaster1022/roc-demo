"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, withAuth } from '@/contexts/auth-context';
import { searchService } from '@/lib/search-mock-data';
import PropertyApplicationForm from '@/components/application/property-application-form';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { toast } from 'sonner';

const PropertyApplicationPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const propertyId = params.id as string;
  const roomId = new URLSearchParams(window.location.search).get('roomId') || undefined;
  
  const [property, setProperty] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const propertyData = await searchService.getPropertyById(propertyId);
      setProperty(propertyData);
      
      if (roomId && propertyData?.rooms) {
        const room = propertyData.rooms.find((r: any) => r.roomNumber.toString() === roomId);
        setSelectedRoom(room);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property details');
      router.push('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (applicationData: any) => {
    try {
      // In a real app, this would save to backend
      console.log('Application submitted:', applicationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Application submitted successfully!');
      router.push(`/applications?status=submitted&propertyId=${propertyId}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-16">
              <Home className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Property Not Found</h3>
              <p className="text-gray-600 mb-8">
                The property you're trying to apply for doesn't exist or is no longer available.
              </p>
              <Button onClick={() => router.push('/search')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const monthlyRent = selectedRoom ? selectedRoom.calculatedPrice : property.fullPropertyPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <PropertyApplicationForm
          propertyId={propertyId}
          propertyName={property.name}
          roomId={roomId}
          roomName={selectedRoom?.name}
          monthlyRent={monthlyRent}
          onSubmit={handleApplicationSubmit}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
};

export default withAuth(PropertyApplicationPage, { 
  allowedUserTypes: ['tenant', 'roomie'] 
}); 