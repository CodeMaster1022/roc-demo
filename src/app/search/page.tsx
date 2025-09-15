"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart,
  Star,
  Users,
  Home,
  Building,
  DollarSign,
  Bed,
  Bath,
  Car,
  Wifi,
  Dumbbell,
  Shield,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';
import { searchService, searchFilters } from '@/lib/search-mock-data';
import { toast } from 'sonner';

const SearchContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: 'all',
    propertyType: 'all',
    rentalType: 'all',
    furnishingType: 'all',
    amenities: [] as string[],
    minRooms: 0,
    minBathrooms: 0,
    sortBy: 'newest'
  });
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    performSearch();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (searchQuery || Object.values(filters).some(f => f !== 'all' && f !== 0 && (Array.isArray(f) ? f.length > 0 : true))) {
      performSearch();
    }
  }, [filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const results = await searchService.searchProperties({
        query: searchQuery,
        ...filters
      });
      
      setProperties(results.properties);
      setTotal(results.total);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      // In real app, get current user ID
      const userFavorites = await searchService.getFavorites('current_user');
      setFavorites(userFavorites.map((p: any) => p._id));
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const handleSearch = () => {
    performSearch();
    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const toggleFavorite = async (propertyId: string) => {
    try {
      const isFavorite = favorites.includes(propertyId);
      
      if (isFavorite) {
        await searchService.removeFromFavorites('current_user', propertyId);
        setFavorites(prev => prev.filter(id => id !== propertyId));
        toast.success('Removed from favorites');
      } else {
        await searchService.addToFavorites('current_user', propertyId);
        setFavorites(prev => [...prev, propertyId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const clearFilters = () => {
    setFilters({
      priceRange: 'all',
      propertyType: 'all',
      rentalType: 'all',
      furnishingType: 'all',
      amenities: [],
      minRooms: 0,
      minBathrooms: 0,
      sortBy: 'newest'
    });
    setSearchQuery('');
  };

  const getPropertyPrice = (property: any) => {
    if (property.rentalType === 'by_room' && property.rooms?.length > 0) {
      const minPrice = Math.min(...property.rooms.map((r: any) => r.calculatedPrice));
      return `From $${minPrice.toLocaleString()}`;
    }
    return `$${property.fullPropertyPrice.toLocaleString()}`;
  };

  const PropertyCard = ({ property }: { property: any }) => {
    const isFavorite = favorites.includes(property._id);
    
    return (
      <Card className={`hover:shadow-lg transition-all duration-200 ${viewMode === 'list' ? 'flex-row' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : 'w-full h-64'} bg-gray-200 rounded-t-lg overflow-hidden`}>
          {property.photos && property.photos.length > 0 ? (
            <img
              src={property.photos[0].url}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(property._id)}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>
          
          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-gray-900">
              {property.propertyType === 'apartment' ? <Building className="w-3 h-3 mr-1" /> : <Home className="w-3 h-3 mr-1" />}
              {property.propertyType}
            </Badge>
          </div>
          
          {/* Photo Count */}
          {property.photos && property.photos.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
              +{property.photos.length - 1} photos
            </div>
          )}
        </div>
        
        <CardContent className="p-6 flex-1">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
              {property.name}
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {getPropertyPrice(property)}
              </div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.location.address}, {property.location.city}</span>
          </div>
          
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
          
          {/* Property Details */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.totalRooms} rooms
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {property.totalBathrooms} baths
            </div>
            {property.parkingSpaces > 0 && (
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-1" />
                {property.parkingSpaces} parking
              </div>
            )}
            <div className="text-gray-400">•</div>
            <div>{property.totalArea}m²</div>
          </div>
          
          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 4).map((amenity: string) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity === 'wifi' && <Wifi className="w-3 h-3 mr-1" />}
                {amenity === 'gym' && <Dumbbell className="w-3 h-3 mr-1" />}
                {amenity === 'security' && <Shield className="w-3 h-3 mr-1" />}
                {amenity.replace('_', ' ')}
              </Badge>
            ))}
            {property.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 4} more
              </Badge>
            )}
          </div>
          
          {/* Rating and Response Time */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{property.rating}</span>
              <span className="text-gray-600 text-sm ml-1">({property.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {property.responseTime}
            </div>
          </div>
          
          {/* Available Rooms (for by_room properties) */}
          {property.rentalType !== 'full_property' && property.rooms && property.rooms.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900 mb-2">Available Rooms:</div>
              <div className="space-y-1">
                {property.rooms.slice(0, 2).map((room: any) => (
                  <div key={room.roomNumber} className="flex justify-between text-sm">
                    <span className="text-gray-600">{room.name}</span>
                    <span className="font-medium">${room.calculatedPrice.toLocaleString()}/month</span>
                  </div>
                ))}
                {property.rooms.length > 2 && (
                  <div className="text-sm text-gray-500">+{property.rooms.length - 2} more rooms</div>
                )}
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
              onClick={() => router.push(`/properties/${property._id}/contact`)}
              className="flex-1"
            >
              Contact Host
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by location, property name, or neighborhood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>
            
            {/* Search Button */}
            <Button 
              onClick={handleSearch}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
            
            <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                {searchFilters.priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {searchFilters.propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.rentalType} onValueChange={(value) => handleFilterChange('rentalType', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rental Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Options</SelectItem>
                {searchFilters.rentalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(filters.priceRange !== 'all' || filters.propertyType !== 'all' || filters.rentalType !== 'all' || filters.amenities.length > 0) && (
              <Button variant="ghost" onClick={clearFilters} className="text-red-600 hover:text-red-700">
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Furnishing Type */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Furnishing</label>
                  <Select value={filters.furnishingType} onValueChange={(value) => handleFilterChange('furnishingType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {searchFilters.furnishingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Minimum Rooms */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Minimum Rooms</label>
                  <Select value={filters.minRooms.toString()} onValueChange={(value) => handleFilterChange('minRooms', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Minimum Bathrooms */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Minimum Bathrooms</label>
                  <Select value={filters.minBathrooms.toString()} onValueChange={(value) => handleFilterChange('minBathrooms', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Amenities */}
              <div className="mt-6">
                <label className="text-sm font-medium mb-4 block">Amenities</label>
                <div className="space-y-4">
                  {searchFilters.amenityCategories.map((category) => (
                    <div key={category.category}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{category.category}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {category.amenities.map((amenity) => (
                          <div key={amenity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity.id}
                              checked={filters.amenities.includes(amenity.id)}
                              onCheckedChange={() => handleAmenityToggle(amenity.id)}
                            />
                            <label htmlFor={amenity.id} className="text-sm">
                              {amenity.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Searching...' : `${total} Properties Found`}
            </h2>
            {searchQuery && (
              <p className="text-gray-600 mt-1">
                Results for "{searchQuery}"
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="w-48">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-t-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <Button onClick={clearFilters}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-6'
          }>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        
        {/* Load More / Pagination */}
        {properties.length > 0 && properties.length < total && (
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8">
              Load More Properties
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

// Loading fallback component
const SearchPageFallback = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="bg-gray-200 h-64 rounded-t-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

const SearchPage: React.FC = () => {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage; 