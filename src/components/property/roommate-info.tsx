"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MessageSquare, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Heart, 
  Coffee, 
  Music, 
  BookOpen, 
  Gamepad2, 
  Dumbbell, 
  Palette, 
  Camera,
  Code,
  Star,
  MapPin,
  Clock,
  Users,
  Shield,
  Info
} from 'lucide-react';

interface Roommate {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  occupation: string;
  bio: string;
  profileImage: string;
  roomNumber: number;
  moveInDate: string;
  languages: string[];
  interests: string[];
  lifestyle: {
    sleepSchedule: 'early_bird' | 'night_owl' | 'flexible';
    socialLevel: 'very_social' | 'moderately_social' | 'quiet';
    cleanliness: 'very_clean' | 'clean' | 'relaxed';
    workFromHome: boolean;
    petsOwner: boolean;
  };
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  lastActive: string;
}

interface RoommateInfoProps {
  roommates: Roommate[];
  availableRooms: number;
  totalRooms: number;
  propertyRules?: {
    genderRestriction?: 'mixed' | 'female_only' | 'male_only';
    ageRange?: { min: number; max: number };
    occupationPreference?: string[];
  };
}

const RoommateInfo: React.FC<RoommateInfoProps> = ({ 
  roommates, 
  availableRooms, 
  totalRooms,
  propertyRules 
}) => {
  const [selectedRoommate, setSelectedRoommate] = useState<string | null>(null);

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

  const getLifestyleLabel = (key: string, value: any) => {
    const labels: { [key: string]: { [value: string]: string } } = {
      sleepSchedule: {
        early_bird: 'Early Bird',
        night_owl: 'Night Owl',
        flexible: 'Flexible Schedule'
      },
      socialLevel: {
        very_social: 'Very Social',
        moderately_social: 'Moderately Social',
        quiet: 'Prefers Quiet'
      },
      cleanliness: {
        very_clean: 'Very Clean',
        clean: 'Clean & Tidy',
        relaxed: 'Relaxed'
      }
    };
    return labels[key]?.[value] || value;
  };

  const getLifestyleColor = (key: string, value: any) => {
    const colors: { [key: string]: { [value: string]: string } } = {
      sleepSchedule: {
        early_bird: 'bg-yellow-100 text-yellow-800',
        night_owl: 'bg-purple-100 text-purple-800',
        flexible: 'bg-green-100 text-green-800'
      },
      socialLevel: {
        very_social: 'bg-red-100 text-red-800',
        moderately_social: 'bg-blue-100 text-blue-800',
        quiet: 'bg-gray-100 text-gray-800'
      },
      cleanliness: {
        very_clean: 'bg-emerald-100 text-emerald-800',
        clean: 'bg-teal-100 text-teal-800',
        relaxed: 'bg-orange-100 text-orange-800'
      }
    };
    return colors[key]?.[value] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Current Roommates</h2>
          <p className="text-gray-600">
            {roommates.length} of {totalRooms} rooms occupied • {availableRooms} available
          </p>
        </div>
        
        {propertyRules && (
          <div className="text-right">
            <Badge variant="outline" className="mb-1">
              {propertyRules.genderRestriction === 'mixed' ? 'Mixed Gender' : 
               propertyRules.genderRestriction === 'female_only' ? 'Female Only' : 'Male Only'}
            </Badge>
            {propertyRules.ageRange && (
              <div className="text-sm text-gray-600">
                Age range: {propertyRules.ageRange.min}-{propertyRules.ageRange.max}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Roommates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roommates.map((roommate) => (
          <Card key={roommate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={roommate.profileImage} />
                      <AvatarFallback>
                        {roommate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {roommate.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{roommate.name}</h3>
                    <p className="text-sm text-gray-600">{roommate.age} years old</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {roommate.occupation}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    Room {roommate.roomNumber}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    {roommate.rating} ({roommate.reviewCount})
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Bio */}
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {roommate.bio}
              </p>

              {/* Lifestyle Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getLifestyleColor('sleepSchedule', roommate.lifestyle.sleepSchedule)}>
                  <Clock className="w-3 h-3 mr-1" />
                  {getLifestyleLabel('sleepSchedule', roommate.lifestyle.sleepSchedule)}
                </Badge>
                <Badge className={getLifestyleColor('socialLevel', roommate.lifestyle.socialLevel)}>
                  <Users className="w-3 h-3 mr-1" />
                  {getLifestyleLabel('socialLevel', roommate.lifestyle.socialLevel)}
                </Badge>
                <Badge className={getLifestyleColor('cleanliness', roommate.lifestyle.cleanliness)}>
                  {getLifestyleLabel('cleanliness', roommate.lifestyle.cleanliness)}
                </Badge>
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center mb-2">
                  <Globe className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Languages:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {roommate.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <div className="flex items-center mb-2">
                  <Heart className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Interests:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roommate.interests.slice(0, 4).map((interest) => {
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

              <Separator />

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Moved in: {new Date(roommate.moveInDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Active: {roommate.lastActive}</span>
                  </div>
                </div>
                {roommate.lifestyle.workFromHome && (
                  <div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-3 h-3 mr-1" />
                      <span>Works from home</span>
                    </div>
                  </div>
                )}
                {roommate.lifestyle.petsOwner && (
                  <div>
                    <div className="flex items-center text-gray-600">
                      <Heart className="w-3 h-3 mr-1" />
                      <span>Has pets</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedRoommate(
                    selectedRoommate === roommate.id ? null : roommate.id
                  )}
                >
                  <Info className="w-4 h-4 mr-2" />
                  {selectedRoommate === roommate.id ? 'Less' : 'More'}
                </Button>
              </div>

              {/* Expanded Info */}
              {selectedRoommate === roommate.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Lifestyle Details</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sleep Schedule:</span>
                        <span className="font-medium">
                          {getLifestyleLabel('sleepSchedule', roommate.lifestyle.sleepSchedule)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Social Level:</span>
                        <span className="font-medium">
                          {getLifestyleLabel('socialLevel', roommate.lifestyle.socialLevel)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cleanliness:</span>
                        <span className="font-medium">
                          {getLifestyleLabel('cleanliness', roommate.lifestyle.cleanliness)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">All Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {roommate.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs capitalize">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty Rooms */}
      {availableRooms > 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {availableRooms} Room{availableRooms > 1 ? 's' : ''} Available
            </h3>
            <p className="text-gray-600 mb-4">
              Looking for compatible roommates to join this shared living space
            </p>
            <div className="flex justify-center space-x-3">
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Apply for Room
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Visit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compatibility Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 rounded-full p-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Living Together Successfully</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Communicate openly about schedules and preferences</p>
                <p>• Respect shared spaces and personal belongings</p>
                <p>• Establish house rules for guests and cleaning</p>
                <p>• Be considerate of noise levels and different lifestyles</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoommateInfo; 