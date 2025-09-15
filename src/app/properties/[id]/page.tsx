"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Star, 
  Heart, 
  Share, 
  Wifi, 
  Car, 
  Dumbbell, 
  Waves, 
  Sun, 
  Shield, 
  Users, 
  ChefHat, 
  Shirt, 
  Building2, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  ArrowUp, 
  Trees,
  MessageSquare,
  Calendar,
  DollarSign,
  Home,
  Bed,
  Bath,
  Square,
  ArrowLeft
} from 'lucide-react';
import { searchService } from '@/lib/search-mock-data';
import { useAuth, withAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import PhotoGallery from '@/components/property/photo-gallery';
import RoommateInfo from '@/components/property/roommate-info';
import RoomDetails from '@/components/property/room-details';

const PropertyDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock roommates data
  const mockRoommates = [
    {
      id: 'roommate_1',
      name: 'Sofia Martinez',
      age: 24,
      gender: 'female' as const,
      occupation: 'Graphic Designer',
      bio: 'Creative professional who loves art, photography, and good coffee. I work mostly from home and enjoy a clean, organized living space.',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      roomNumber: 2,
      moveInDate: '2024-01-15',
      languages: ['Spanish', 'English'],
      interests: ['art', 'photography', 'coffee', 'design'],
      lifestyle: {
        sleepSchedule: 'flexible' as const,
        socialLevel: 'moderately_social' as const,
        cleanliness: 'very_clean' as const,
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
      age: 26,
      gender: 'male' as const,
      occupation: 'Software Engineer',
      bio: 'Tech enthusiast and fitness lover. I work regular hours and enjoy cooking healthy meals. Looking for respectful roommates who value a peaceful home environment.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      roomNumber: 3,
      moveInDate: '2023-11-20',
      languages: ['Spanish', 'English', 'Portuguese'],
      interests: ['technology', 'fitness', 'cooking', 'gaming'],
      lifestyle: {
        sleepSchedule: 'early_bird' as const,
        socialLevel: 'quiet' as const,
        cleanliness: 'clean' as const,
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
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const propertyData = await searchService.getPropertyById(propertyId);
      setProperty(propertyData);
      
      if (propertyData && user) {
        // Check if property is in favorites
        const favorites = await searchService.getFavorites(user._id);
        setIsFavorite(favorites.some((fav: any) => fav._id === propertyId));
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please log in to save favorites');
      return;
    }

    try {
      if (isFavorite) {
        await searchService.removeFromFavorites(user._id, propertyId);
        toast.success('Removed from favorites');
      } else {
        await searchService.addToFavorites(user._id, propertyId);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      wifi: Wifi,
      parking: Car,
      gym: Dumbbell,
      pool: Waves,
      rooftop: Sun,
      security: Shield,
      concierge: Users,
      kitchen: ChefHat,
      laundry: Shirt,
      business_center: Building2,
      study_room: BookOpen,
      coworking: Briefcase,
      cleaning: Sparkles,
      elevator: ArrowUp,
      garden: Trees
    };
    return iconMap[amenity] || Home;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-16">
              <Home className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Property Not Found</h3>
              <p className="text-gray-600 mb-8">
                The property you're looking for doesn't exist or has been removed.
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Photo Gallery */}
        <PhotoGallery 
          photos={property.photos} 
          propertyName={property.name}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location.address}, {property.location.city}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">{property.rating}</span>
                      <span className="text-gray-600 ml-1">({property.reviewCount} reviews)</span>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {property.propertyType}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {property.furnishingType.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleFavorite}
                    className={isFavorite ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-sm text-gray-600">Area</div>
                    <div className="font-semibold">{property.totalArea} m²</div>
                  </div>
                  <div className="text-center">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-sm text-gray-600">Bedrooms</div>
                    <div className="font-semibold">{property.totalRooms}</div>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div className="font-semibold">{property.totalBathrooms}</div>
                  </div>
                  <div className="text-center">
                    <Car className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-sm text-gray-600">Parking</div>
                    <div className="font-semibold">{property.parkingSpaces}</div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity: string) => {
                    const IconComponent = getAmenityIcon(amenity);
                    return (
                      <div key={amenity} className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <span className="capitalize text-gray-700">
                          {amenity.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Room Details (if applicable) */}
            {property.rooms && property.rooms.length > 0 && (
              <RoomDetails 
                rooms={property.rooms} 
                propertyName={property.name}
                propertyId={propertyId}
                propertyRules={{
                  genderRestriction: 'mixed',
                  smokingAllowed: false,
                  petsAllowed: true,
                  guestsAllowed: true
                }}
              />
            )}

            {/* Roommate Information (for shared properties) */}
            {property.rentalType === 'by_room' && (
              <RoommateInfo 
                roommates={mockRoommates}
                availableRooms={property.rooms?.filter((r: any) => !r.isOccupied).length || 0}
                totalRooms={property.rooms?.length || 0}
                propertyRules={{
                  genderRestriction: 'mixed',
                  ageRange: { min: 18, max: 35 }
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {property.rentalType === 'by_room' && property.rooms.length > 0
                      ? `${formatPrice(Math.min(...property.rooms.map((r: any) => r.calculatedPrice)))} - ${formatPrice(Math.max(...property.rooms.map((r: any) => r.calculatedPrice)))}`
                      : formatPrice(property.fullPropertyPrice)
                    }
                  </div>
                  <div className="text-gray-600">
                    {property.rentalType === 'by_room' ? 'per room/month' : 'per month'}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm">Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm">Response time: {property.responseTime}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Hoster
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Visit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hoster Info */}
            <Card>
              <CardHeader>
                <CardTitle>Hosted by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback>H</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">Property Host</div>
                    <div className="text-sm text-gray-600">Verified host</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response rate:</span>
                    <span className="font-semibold">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response time:</span>
                    <span className="font-semibold">{property.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Properties:</span>
                    <span className="font-semibold">3 active</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 mt-1 text-gray-600" />
                    <div className="text-sm">
                      <div className="font-semibold">{property.location.address}</div>
                      <div className="text-gray-600">
                        {property.location.city}, {property.location.state} {property.location.zipCode}
                      </div>
                      <div className="text-gray-600">{property.location.country}</div>
                    </div>
                  </div>
                  
                  {/* Placeholder for map */}
                  <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">Interactive map coming soon</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(PropertyDetailPage, { 
  allowedUserTypes: ['tenant', 'roomie', 'hoster', 'admin'] 
}); 