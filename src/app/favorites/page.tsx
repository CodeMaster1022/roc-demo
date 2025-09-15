"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  Star,
  MapPin,
  Home,
  Building,
  Bed,
  Bath,
  Car,
  Eye,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { searchService } from '@/lib/search-mock-data';
import { useAuth, withAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

const FavoritesPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userFavorites = await searchService.getFavorites(user._id);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) return;
    
    try {
      await searchService.removeFromFavorites(user._id, propertyId);
      setFavorites(prev => prev.filter(p => p._id !== propertyId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  const getPropertyPrice = (property: any) => {
    if (property.rentalType === 'by_room' && property.rooms?.length > 0) {
      const minPrice = Math.min(...property.rooms.map((r: any) => r.calculatedPrice));
      return `From $${minPrice.toLocaleString()}`;
    }
    return `$${property.fullPropertyPrice.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 mt-1">
              {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
          
          <Button
            onClick={() => router.push('/search')}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
          >
            <Search className="w-4 h-4 mr-2" />
            Find More Properties
          </Button>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Favorites Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start exploring properties and save the ones you love by clicking the heart icon.
                Your favorites will appear here.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => router.push('/search')}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/roommates')}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Find Roommates
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <Card key={property._id} className="hover:shadow-lg transition-shadow group">
                <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
                  {property.photos && property.photos.length > 0 ? (
                    <img
                      src={property.photos[0].url}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Remove Favorite Button */}
                  <button
                    onClick={() => removeFavorite(property._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                  
                  {/* Favorite Indicator */}
                  <div className="absolute top-3 left-3">
                    <Heart className="w-6 h-6 text-red-500 fill-current" />
                  </div>
                  
                  {/* Property Type Badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/90 text-gray-900">
                      {property.propertyType === 'apartment' ? <Building className="w-3 h-3 mr-1" /> : <Home className="w-3 h-3 mr-1" />}
                      {property.propertyType}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 flex-1">
                      {property.name}
                    </h3>
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-purple-600">
                        {getPropertyPrice(property)}
                      </div>
                      <div className="text-sm text-gray-600">per month</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location.address}, {property.location.city}</span>
                  </div>
                  
                  {/* Property Details */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.totalRooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.totalBathrooms}
                    </div>
                    {property.parkingSpaces > 0 && (
                      <div className="flex items-center">
                        <Car className="w-4 h-4 mr-1" />
                        {property.parkingSpaces}
                      </div>
                    )}
                    <div className="text-gray-400">•</div>
                    <div>{property.totalArea}m²</div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-600 text-sm ml-1">({property.reviewCount} reviews)</span>
                  </div>
                  
                  {/* Available Rooms Info */}
                  {property.rentalType !== 'full_property' && property.rooms && property.rooms.length > 0 && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm font-medium text-purple-900 mb-1">
                        {property.rooms.length} rooms available
                      </div>
                      <div className="text-sm text-purple-700">
                        Starting from ${Math.min(...property.rooms.map((r: any) => r.calculatedPrice)).toLocaleString()}/month
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/properties/${property._id}`)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFavorite(property._id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ready to Find Your Perfect Home?
                </h3>
                <p className="text-gray-600 mb-6">
                  Browse more properties or find compatible roommates to share your space.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => router.push('/search')}
                    className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Explore More Properties
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/roommates')}
                  >
                    Find Roommates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default withAuth(FavoritesPage, { 
  allowedUserTypes: ['tenant', 'roomie'] 
}); 