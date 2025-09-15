"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth, withAuth } from '@/contexts/auth-context';
import { searchService } from '@/lib/search-mock-data';
import RoommateApplicationForm from '@/components/application/roommate-application-form';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { toast } from 'sonner';

const RoommateApplicationPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const roommateId = params.id as string;
  const propertyId = searchParams.get('propertyId') || '';
  const roomId = searchParams.get('roomId');
  
  const [roommate, setRoommate] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock roommate data - in real app would fetch from API
  const mockRoommates = [
    {
      id: 'roommate_1',
      name: 'Sofia Martinez',
      age: 24,
      gender: 'female',
      occupation: 'Graphic Designer',
      bio: 'Creative professional who loves art, photography, and good coffee. I work mostly from home and enjoy a clean, organized living space.',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      roomNumber: 2,
      moveInDate: '2024-01-15',
      languages: ['Spanish', 'English'],
      interests: ['art', 'photography', 'coffee', 'design'],
      lifestyle: {
        sleepSchedule: 'flexible',
        socialLevel: 'moderately_social',
        cleanliness: 'very_clean',
        workFromHome: true,
        petsOwner: false
      },
      rating: 4.8,
      reviewCount: 12,
      isVerified: true,
      lastActive: '2 hours ago'
    },
    {
      id: 'roommate_2',
      name: 'Carlos Rodriguez',
      age: 28,
      gender: 'male',
      occupation: 'Software Engineer',
      bio: 'Tech enthusiast who enjoys gaming, cooking, and weekend hiking. Looking for a responsible roommate who values both social time and personal space.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      roomNumber: 1,
      moveInDate: '2023-12-01',
      languages: ['Spanish', 'English', 'Portuguese'],
      interests: ['gaming', 'cooking', 'hiking', 'technology'],
      lifestyle: {
        sleepSchedule: 'night_owl',
        socialLevel: 'social',
        cleanliness: 'clean',
        workFromHome: false,
        petsOwner: false
      },
      rating: 4.6,
      reviewCount: 8,
      isVerified: true,
      lastActive: '1 day ago'
    }
  ];

  useEffect(() => {
    loadData();
  }, [roommateId, propertyId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load roommate data
      const roommateData = mockRoommates.find(r => r.id === roommateId);
      if (!roommateData) {
        throw new Error('Roommate not found');
      }
      setRoommate(roommateData);

      // Load property data if propertyId is provided
      if (propertyId) {
        const propertyData = await searchService.getPropertyById(propertyId);
        setProperty(propertyData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load roommate information');
      router.push('/roommates');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (applicationData: any) => {
    try {
      // In a real app, this would save to backend
      console.log('Roommate application submitted:', applicationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Roommate application submitted successfully!');
      router.push(`/applications?status=submitted&roommateId=${roommateId}`);
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

  if (!roommate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-16">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Roommate Not Found</h3>
              <p className="text-gray-600 mb-8">
                The roommate you're trying to apply to doesn't exist or is no longer available.
              </p>
              <Button onClick={() => router.push('/roommates')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Roommate Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate monthly rent - use property rent or default
  const monthlyRent = property?.fullPropertyPrice || 8000;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <RoommateApplicationForm
          roommateId={roommateId}
          roommateName={roommate.name}
          propertyId={propertyId}
          propertyName={property?.name || 'Shared Living Space'}
          roomId={roomId}
          monthlyRent={monthlyRent}
          onSubmit={handleApplicationSubmit}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
};

export default withAuth(RoommateApplicationPage, { 
  allowedUserTypes: ['tenant', 'roomie'] 
}); 