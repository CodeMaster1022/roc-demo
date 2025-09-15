"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users,
  Heart,
  Star,
  MessageSquare,
  Filter,
  Sliders,
  User,
  Briefcase,
  Globe,
  DollarSign,
  Clock,
  Home,
  Coffee,
  Music,
  BookOpen,
  Gamepad2,
  Dumbbell,
  Palette,
  Camera,
  Code,
  ChevronDown,
  ChevronUp,
  Search,
  Target
} from 'lucide-react';
import { searchService, compatibilityFactors } from '@/lib/search-mock-data';
import { useAuth, withAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

const RoommatesPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [roommates, setRoommates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>({});

  useEffect(() => {
    // Load default roommates without preferences
    findRoommates({});
  }, []);

  const findRoommates = async (preferences: any) => {
    setLoading(true);
    try {
      const matches = await searchService.findCompatibleRoommates(preferences);
      setRoommates(matches);
    } catch (error) {
      console.error('Error finding roommates:', error);
      toast.error('Failed to find roommates');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (factorId: string, value: string) => {
    const newPreferences = { ...userPreferences, [factorId]: value };
    setUserPreferences(newPreferences);
    
    // Auto-search when preferences change
    if (Object.keys(newPreferences).length > 0) {
      findRoommates(newPreferences);
    }
  };

  const clearPreferences = () => {
    setUserPreferences({});
    findRoommates({});
  };

  const getInterestIcon = (interest: string) => {
    const iconMap: { [key: string]: any } = {
      technology: Code,
      fitness: Dumbbell,
      cooking: Coffee,
      movies: Camera,
      music: Music,
      reading: BookOpen,
      gaming: Gamepad2,
      art: Palette,
      default: Heart
    };
    return iconMap[interest] || iconMap.default;
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Compatible Roommates</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover potential roommates based on lifestyle compatibility, interests, and preferences. 
            Our matching algorithm helps you find people you'll actually enjoy living with.
          </p>
        </div>

        {/* Preferences Panel */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Compatibility Preferences
                </CardTitle>
                <CardDescription>
                  Set your preferences to find the most compatible roommates
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPreferences(!showPreferences)}
              >
                <Sliders className="w-4 h-4 mr-2" />
                {showPreferences ? 'Hide' : 'Show'} Preferences
                {showPreferences ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardHeader>
          
          {showPreferences && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compatibilityFactors.map((factor) => (
                  <div key={factor.id}>
                    <label className="text-sm font-medium mb-3 block">{factor.name}</label>
                    <Select
                      value={userPreferences[factor.id] || ''}
                      onValueChange={(value) => handlePreferenceChange(factor.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {factor.options.map((option) => (
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
                ))}
              </div>
              
              {Object.keys(userPreferences).length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {Object.keys(userPreferences).length} preference{Object.keys(userPreferences).length !== 1 ? 's' : ''} set
                  </div>
                  <Button variant="ghost" onClick={clearPreferences} className="text-red-600 hover:text-red-700">
                    Clear All Preferences
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Finding matches...' : `${roommates.length} Compatible Roommates`}
            </h2>
            {Object.keys(userPreferences).length > 0 && (
              <p className="text-gray-600 mt-1">
                Matched based on your preferences
              </p>
            )}
          </div>
        </div>

        {/* Roommate Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : roommates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Compatible Roommates Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your preferences or check back later as new users join the platform.
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={clearPreferences}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Preferences
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/search')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roommates.map((roommate) => (
              <Card key={roommate.userId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={roommate.profileImage} />
                        <AvatarFallback>
                          {roommate.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{roommate.name}</h3>
                        <p className="text-sm text-gray-600">{roommate.age} years old</p>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {roommate.occupation}
                        </div>
                      </div>
                    </div>
                    
                    {/* Compatibility Score */}
                    <div className="text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getCompatibilityColor(roommate.compatibilityScore)}`}>
                        <Star className="w-3 h-3 mr-1" />
                        {roommate.compatibilityScore}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getCompatibilityLabel(roommate.compatibilityScore)}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {roommate.bio}
                  </p>

                  {/* Budget */}
                  <div className="flex items-center mb-4 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-600">Budget: </span>
                    <span className="font-semibold ml-1">
                      ${roommate.budget.min.toLocaleString()} - ${roommate.budget.max.toLocaleString()}
                    </span>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Globe className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Languages:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {roommate.languages.map((lang: string) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <Heart className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-600">Interests:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roommate.interests.slice(0, 4).map((interest: string) => {
                        const IconComponent = getInterestIcon(interest);
                        return (
                          <div key={interest} className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                            <IconComponent className="w-3 h-3 mr-1 text-gray-600" />
                            <span className="text-xs text-gray-700 capitalize">{interest}</span>
                          </div>
                        );
                      })}
                      {roommate.interests.length > 4 && (
                        <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                          <span className="text-xs text-gray-700">+{roommate.interests.length - 4} more</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lifestyle Preferences */}
                  {Object.keys(userPreferences).length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Lifestyle Match</h4>
                      <div className="space-y-2">
                        {Object.keys(userPreferences).map((key) => {
                          const factor = compatibilityFactors.find(f => f.id === key);
                          if (!factor || !roommate.preferences[key]) return null;
                          
                          const isMatch = roommate.preferences[key] === userPreferences[key];
                          return (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="text-gray-600">{factor.name}:</span>
                              <span className={`font-medium ${isMatch ? 'text-green-600' : 'text-gray-500'}`}>
                                {factor.options.find(o => o.value === roommate.preferences[key])?.label}
                                {isMatch && ' ✓'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="py-8">
              <div className="text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tips for Finding Great Roommates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Be Specific</h4>
                    <p className="text-sm text-gray-600">
                      Set clear preferences to find truly compatible matches
                    </p>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Start Conversations</h4>
                    <p className="text-sm text-gray-600">
                      Message potential roommates to get to know them better
                    </p>
                  </div>
                  <div className="text-center">
                    <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Meet in Person</h4>
                    <p className="text-sm text-gray-600">
                      Arrange a meeting before making any commitments
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default withAuth(RoommatesPage, { 
  allowedUserTypes: ['tenant', 'roomie'] 
}); 