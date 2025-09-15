"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  User, 
  Users, 
  Heart, 
  Home, 
  Clock, 
  Music, 
  Coffee, 
  Book,
  Gamepad2,
  Dumbbell,
  Palette,
  Camera,
  Plane,
  ChefHat,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  Star,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface RoommateApplicationFormProps {
  roommateId: string;
  roommateName: string;
  propertyId: string;
  propertyName: string;
  roomId?: string;
  monthlyRent: number;
  onSubmit: (applicationData: any) => void;
  onCancel: () => void;
}

const RoommateApplicationForm: React.FC<RoommateApplicationFormProps> = ({
  roommateId,
  roommateName,
  propertyId,
  propertyName,
  roomId,
  monthlyRent,
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    basicInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      occupation: '',
      languages: [] as string[],
      bio: ''
    },
    
    // Lifestyle Preferences
    lifestyle: {
      sleepSchedule: '',
      socialLevel: '',
      cleanliness: '',
      workFromHome: false,
      studyAtHome: false,
      petsOwner: false,
      petTypes: [] as string[],
      smokingStatus: '',
      drinkingStatus: '',
      fitnessLevel: '',
      dietaryRestrictions: [] as string[]
    },
    
    // Living Preferences
    livingPrefs: {
      quietHours: {
        weekdays: { start: '22:00', end: '07:00' },
        weekends: { start: '23:00', end: '09:00' }
      },
      guestPolicy: '',
      sharedSpaces: {
        kitchen: '',
        livingRoom: '',
        bathroom: ''
      },
      chores: '',
      expenses: ''
    },
    
    // Interests & Hobbies
    interests: {
      categories: [] as string[],
      hobbies: [] as string[],
      musicGenres: [] as string[],
      movieGenres: [] as string[],
      activities: [] as string[]
    },
    
    // Compatibility Questions
    compatibility: {
      dealBreakers: [] as string[],
      importantQualities: [] as string[],
      conflictResolution: '',
      communicationStyle: '',
      privacyLevel: '',
      socialEvents: ''
    },
    
    // Move-in Details
    moveInDetails: {
      moveInDate: '',
      leaseDuration: '',
      budget: '',
      motivation: '',
      questions: '',
      references: [
        { name: '', relationship: '', contact: '' }
      ]
    }
  });

  const totalSteps = 6;
  const stepTitles = [
    'Basic Information',
    'Lifestyle & Habits',
    'Living Preferences',
    'Interests & Hobbies',
    'Compatibility',
    'Move-in Details'
  ];

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const toggleArrayValue = (section: string, field: string, value: string) => {
    setFormData(prev => {
      const currentArray = (prev[section as keyof typeof prev] as any)[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: newArray
        }
      };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = [
      formData.basicInfo.firstName,
      formData.basicInfo.lastName,
      formData.basicInfo.email,
      formData.basicInfo.phone,
      formData.moveInDetails.moveInDate
    ];

    if (requiredFields.some(field => !field)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const applicationData = {
      type: 'roommate',
      roommateId,
      propertyId,
      roomId,
      applicationDate: new Date().toISOString(),
      status: 'pending',
      ...formData
    };

    onSubmit(applicationData);
    toast.success('Roommate application submitted successfully!');
  };

  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Tell us about yourself</h3>
        <p className="text-gray-600">Help {roommateName} get to know you better</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.basicInfo.firstName}
            onChange={(e) => updateFormData('basicInfo', 'firstName', e.target.value)}
            placeholder="Your first name"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.basicInfo.lastName}
            onChange={(e) => updateFormData('basicInfo', 'lastName', e.target.value)}
            placeholder="Your last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.basicInfo.email}
            onChange={(e) => updateFormData('basicInfo', 'email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.basicInfo.phone}
            onChange={(e) => updateFormData('basicInfo', 'phone', e.target.value)}
            placeholder="+52 55 1234 5678"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.basicInfo.age}
            onChange={(e) => updateFormData('basicInfo', 'age', e.target.value)}
            placeholder="25"
            min="18"
            max="65"
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.basicInfo.gender}
            onValueChange={(value) => updateFormData('basicInfo', 'gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={formData.basicInfo.occupation}
            onChange={(e) => updateFormData('basicInfo', 'occupation', e.target.value)}
            placeholder="Software Developer"
          />
        </div>
      </div>

      <div>
        <Label>Languages Spoken</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {['Spanish', 'English', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese'].map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang}`}
                checked={formData.basicInfo.languages.includes(lang)}
                onCheckedChange={() => toggleArrayValue('basicInfo', 'languages', lang)}
              />
              <Label htmlFor={`lang-${lang}`} className="text-sm">{lang}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Tell us about yourself</Label>
        <Textarea
          id="bio"
          value={formData.basicInfo.bio}
          onChange={(e) => updateFormData('basicInfo', 'bio', e.target.value)}
          placeholder="Share something interesting about yourself, your interests, what you're looking for in a roommate..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderLifestyleStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Lifestyle</h3>
        <p className="text-gray-600">Help us understand your daily habits and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Sleep Schedule</Label>
          <Select
            value={formData.lifestyle.sleepSchedule}
            onValueChange={(value) => updateFormData('lifestyle', 'sleepSchedule', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="When do you usually sleep?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="early-bird">Early Bird (sleep by 10 PM, wake by 6 AM)</SelectItem>
              <SelectItem value="normal">Normal (sleep by 11 PM, wake by 7 AM)</SelectItem>
              <SelectItem value="night-owl">Night Owl (sleep after midnight)</SelectItem>
              <SelectItem value="flexible">Flexible/Variable schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Social Level</Label>
          <Select
            value={formData.lifestyle.socialLevel}
            onValueChange={(value) => updateFormData('lifestyle', 'socialLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How social are you at home?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-social">Very Social - Love hanging out and chatting</SelectItem>
              <SelectItem value="moderately-social">Moderately Social - Enjoy occasional conversations</SelectItem>
              <SelectItem value="somewhat-social">Somewhat Social - Friendly but value privacy</SelectItem>
              <SelectItem value="private">Private - Prefer minimal interaction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Cleanliness Level</Label>
          <Select
            value={formData.lifestyle.cleanliness}
            onValueChange={(value) => updateFormData('lifestyle', 'cleanliness', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How clean are you?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-clean">Very Clean - Everything organized and spotless</SelectItem>
              <SelectItem value="clean">Clean - Tidy and organized</SelectItem>
              <SelectItem value="moderately-clean">Moderately Clean - Generally tidy</SelectItem>
              <SelectItem value="relaxed">Relaxed - Comfortable with some messiness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Fitness Level</Label>
          <Select
            value={formData.lifestyle.fitnessLevel}
            onValueChange={(value) => updateFormData('lifestyle', 'fitnessLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How active are you?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-active">Very Active - Daily workouts</SelectItem>
              <SelectItem value="active">Active - Regular exercise</SelectItem>
              <SelectItem value="moderately-active">Moderately Active - Occasional exercise</SelectItem>
              <SelectItem value="sedentary">Sedentary - Prefer relaxing activities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="workFromHome"
              checked={formData.lifestyle.workFromHome}
              onCheckedChange={(checked) => updateFormData('lifestyle', 'workFromHome', checked)}
            />
            <Label htmlFor="workFromHome">I work from home</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="studyAtHome"
              checked={formData.lifestyle.studyAtHome}
              onCheckedChange={(checked) => updateFormData('lifestyle', 'studyAtHome', checked)}
            />
            <Label htmlFor="studyAtHome">I study from home</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="petsOwner"
              checked={formData.lifestyle.petsOwner}
              onCheckedChange={(checked) => updateFormData('lifestyle', 'petsOwner', checked)}
            />
            <Label htmlFor="petsOwner">I have pets</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Smoking Status</Label>
            <Select
              value={formData.lifestyle.smokingStatus}
              onValueChange={(value) => updateFormData('lifestyle', 'smokingStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select smoking status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non-smoker">Non-smoker</SelectItem>
                <SelectItem value="social-smoker">Social smoker</SelectItem>
                <SelectItem value="occasional-smoker">Occasional smoker</SelectItem>
                <SelectItem value="regular-smoker">Regular smoker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Drinking Habits</Label>
            <Select
              value={formData.lifestyle.drinkingStatus}
              onValueChange={(value) => updateFormData('lifestyle', 'drinkingStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select drinking habits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non-drinker">Non-drinker</SelectItem>
                <SelectItem value="social-drinker">Social drinker</SelectItem>
                <SelectItem value="occasional-drinker">Occasional drinker</SelectItem>
                <SelectItem value="regular-drinker">Regular drinker</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {formData.lifestyle.petsOwner && (
        <div>
          <Label>What type of pets do you have?</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {['Cat', 'Dog', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile', 'Other'].map((pet) => (
              <div key={pet} className="flex items-center space-x-2">
                <Checkbox
                  id={`pet-${pet}`}
                  checked={formData.lifestyle.petTypes.includes(pet)}
                  onCheckedChange={() => toggleArrayValue('lifestyle', 'petTypes', pet)}
                />
                <Label htmlFor={`pet-${pet}`} className="text-sm">{pet}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLivingPreferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Living Preferences</h3>
        <p className="text-gray-600">How do you prefer to share living spaces?</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Weekday Quiet Hours</Label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Label className="text-sm">From:</Label>
                <Input
                  type="time"
                  value={formData.livingPrefs.quietHours.weekdays.start}
                  onChange={(e) => updateFormData('livingPrefs', 'quietHours', {
                    ...formData.livingPrefs.quietHours,
                    weekdays: { ...formData.livingPrefs.quietHours.weekdays, start: e.target.value }
                  })}
                  className="w-32"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-sm">To:</Label>
                <Input
                  type="time"
                  value={formData.livingPrefs.quietHours.weekdays.end}
                  onChange={(e) => updateFormData('livingPrefs', 'quietHours', {
                    ...formData.livingPrefs.quietHours,
                    weekdays: { ...formData.livingPrefs.quietHours.weekdays, end: e.target.value }
                  })}
                  className="w-32"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Weekend Quiet Hours</Label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <Label className="text-sm">From:</Label>
                <Input
                  type="time"
                  value={formData.livingPrefs.quietHours.weekends.start}
                  onChange={(e) => updateFormData('livingPrefs', 'quietHours', {
                    ...formData.livingPrefs.quietHours,
                    weekends: { ...formData.livingPrefs.quietHours.weekends, start: e.target.value }
                  })}
                  className="w-32"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-sm">To:</Label>
                <Input
                  type="time"
                  value={formData.livingPrefs.quietHours.weekends.end}
                  onChange={(e) => updateFormData('livingPrefs', 'quietHours', {
                    ...formData.livingPrefs.quietHours,
                    weekends: { ...formData.livingPrefs.quietHours.weekends, end: e.target.value }
                  })}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Guest Policy</Label>
          <Select
            value={formData.livingPrefs.guestPolicy}
            onValueChange={(value) => updateFormData('livingPrefs', 'guestPolicy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How often do you have guests?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rarely">Rarely have guests</SelectItem>
              <SelectItem value="occasionally">Occasionally (weekends)</SelectItem>
              <SelectItem value="frequently">Frequently</SelectItem>
              <SelectItem value="overnight-sometimes">Overnight guests sometimes</SelectItem>
              <SelectItem value="overnight-often">Overnight guests often</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Chore Sharing</Label>
          <Select
            value={formData.livingPrefs.chores}
            onValueChange={(value) => updateFormData('livingPrefs', 'chores', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How should chores be handled?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strict-schedule">Strict cleaning schedule</SelectItem>
              <SelectItem value="flexible-sharing">Flexible sharing</SelectItem>
              <SelectItem value="individual-responsibility">Individual responsibility</SelectItem>
              <SelectItem value="hire-cleaner">Prefer to hire a cleaner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shared Space Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Kitchen Usage</Label>
            <Select
              value={formData.livingPrefs.sharedSpaces.kitchen}
              onValueChange={(value) => updateFormData('livingPrefs', 'sharedSpaces', {
                ...formData.livingPrefs.sharedSpaces,
                kitchen: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="How do you use the kitchen?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frequent-cooking">Love cooking, use kitchen frequently</SelectItem>
                <SelectItem value="occasional-cooking">Occasional cooking</SelectItem>
                <SelectItem value="minimal-cooking">Minimal cooking, mostly reheating</SelectItem>
                <SelectItem value="takeout-mostly">Mostly takeout/delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Living Room Usage</Label>
            <Select
              value={formData.livingPrefs.sharedSpaces.livingRoom}
              onValueChange={(value) => updateFormData('livingPrefs', 'sharedSpaces', {
                ...formData.livingPrefs.sharedSpaces,
                livingRoom: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="How do you use the living room?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social-hub">Social hub - love hanging out here</SelectItem>
                <SelectItem value="occasional-use">Occasional use for TV/relaxing</SelectItem>
                <SelectItem value="minimal-use">Minimal use, prefer my room</SelectItem>
                <SelectItem value="work-space">Sometimes use as work space</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInterestsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Interests & Hobbies</h3>
        <p className="text-gray-600">What do you enjoy doing in your free time?</p>
      </div>

      <div>
        <Label className="text-lg">Interest Categories</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {[
            { id: 'arts', label: 'Arts & Crafts', icon: Palette },
            { id: 'music', label: 'Music', icon: Music },
            { id: 'sports', label: 'Sports & Fitness', icon: Dumbbell },
            { id: 'cooking', label: 'Cooking', icon: ChefHat },
            { id: 'reading', label: 'Reading', icon: Book },
            { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
            { id: 'photography', label: 'Photography', icon: Camera },
            { id: 'travel', label: 'Travel', icon: Plane }
          ].map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.interests.categories.includes(id)
                  ? 'bg-purple-50 border-purple-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleArrayValue('interests', 'categories', id)}
            >
              <Icon className="w-6 h-6 mb-2 mx-auto text-purple-600" />
              <p className="text-sm font-medium text-center">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Specific Hobbies</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {[
            'Painting', 'Guitar', 'Piano', 'Singing', 'Dancing', 'Yoga', 'Running', 'Cycling',
            'Swimming', 'Hiking', 'Rock Climbing', 'Cooking', 'Baking', 'Gardening', 'Reading',
            'Writing', 'Photography', 'Video Games', 'Board Games', 'Movies', 'TV Shows',
            'Podcasts', 'Learning Languages', 'Meditation', 'Volunteering', 'Traveling'
          ].map((hobby) => (
            <div key={hobby} className="flex items-center space-x-2">
              <Checkbox
                id={`hobby-${hobby}`}
                checked={formData.interests.hobbies.includes(hobby)}
                onCheckedChange={() => toggleArrayValue('interests', 'hobbies', hobby)}
              />
              <Label htmlFor={`hobby-${hobby}`} className="text-sm">{hobby}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Music Genres</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B', 'Reggae', 'Alternative'].map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`music-${genre}`}
                  checked={formData.interests.musicGenres.includes(genre)}
                  onCheckedChange={() => toggleArrayValue('interests', 'musicGenres', genre)}
                />
                <Label htmlFor={`music-${genre}`} className="text-sm">{genre}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Movie/TV Preferences</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {['Comedy', 'Drama', 'Action', 'Horror', 'Sci-Fi', 'Romance', 'Documentary', 'Thriller', 'Animation', 'Mystery'].map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`movie-${genre}`}
                  checked={formData.interests.movieGenres.includes(genre)}
                  onCheckedChange={() => toggleArrayValue('interests', 'movieGenres', genre)}
                />
                <Label htmlFor={`movie-${genre}`} className="text-sm">{genre}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompatibilityStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Compatibility & Values</h3>
        <p className="text-gray-600">Help us understand what's important to you in a roommate relationship</p>
      </div>

      <div>
        <Label>Deal Breakers (Select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {[
            'Smoking indoors', 'Loud music/TV', 'Messy common areas', 'Not cleaning dishes',
            'Frequent overnight guests', 'Parties at home', 'Strong food odors', 'Leaving lights on',
            'Not sharing expenses fairly', 'Being too social', 'Being antisocial', 'Pet allergies'
          ].map((dealBreaker) => (
            <div key={dealBreaker} className="flex items-center space-x-2">
              <Checkbox
                id={`dealbreaker-${dealBreaker}`}
                checked={formData.compatibility.dealBreakers.includes(dealBreaker)}
                onCheckedChange={() => toggleArrayValue('compatibility', 'dealBreakers', dealBreaker)}
              />
              <Label htmlFor={`dealbreaker-${dealBreaker}`} className="text-sm">{dealBreaker}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Important Qualities in a Roommate</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {[
            'Cleanliness', 'Respect for privacy', 'Good communication', 'Reliability',
            'Friendliness', 'Quietness', 'Shared interests', 'Similar schedule',
            'Financial responsibility', 'Respectful of guests', 'Helpful', 'Independent'
          ].map((quality) => (
            <div key={quality} className="flex items-center space-x-2">
              <Checkbox
                id={`quality-${quality}`}
                checked={formData.compatibility.importantQualities.includes(quality)}
                onCheckedChange={() => toggleArrayValue('compatibility', 'importantQualities', quality)}
              />
              <Label htmlFor={`quality-${quality}`} className="text-sm">{quality}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Conflict Resolution Style</Label>
          <Select
            value={formData.compatibility.conflictResolution}
            onValueChange={(value) => updateFormData('compatibility', 'conflictResolution', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How do you handle conflicts?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct-discussion">Direct discussion</SelectItem>
              <SelectItem value="mediated-conversation">Prefer mediated conversation</SelectItem>
              <SelectItem value="written-communication">Written communication first</SelectItem>
              <SelectItem value="avoid-confrontation">Try to avoid confrontation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Communication Style</Label>
          <Select
            value={formData.compatibility.communicationStyle}
            onValueChange={(value) => updateFormData('compatibility', 'communicationStyle', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How do you communicate?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-open">Very open and chatty</SelectItem>
              <SelectItem value="friendly-when-needed">Friendly when needed</SelectItem>
              <SelectItem value="polite-but-private">Polite but private</SelectItem>
              <SelectItem value="minimal-interaction">Minimal interaction preferred</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Privacy Level</Label>
          <Select
            value={formData.compatibility.privacyLevel}
            onValueChange={(value) => updateFormData('compatibility', 'privacyLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How much privacy do you need?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-private">Very private - minimal sharing</SelectItem>
              <SelectItem value="moderately-private">Moderately private</SelectItem>
              <SelectItem value="open-to-sharing">Open to sharing experiences</SelectItem>
              <SelectItem value="very-social">Very social - enjoy shared activities</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Social Events at Home</Label>
          <Select
            value={formData.compatibility.socialEvents}
            onValueChange={(value) => updateFormData('compatibility', 'socialEvents', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How do you feel about home gatherings?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="love-hosting">Love hosting gatherings</SelectItem>
              <SelectItem value="enjoy-occasional">Enjoy occasional gatherings</SelectItem>
              <SelectItem value="small-groups-only">Small groups only</SelectItem>
              <SelectItem value="prefer-quiet">Prefer quiet home environment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderMoveInDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Move-in Details</h3>
        <p className="text-gray-600">Let's finalize the practical details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="moveInDate">Preferred Move-in Date *</Label>
          <Input
            id="moveInDate"
            type="date"
            value={formData.moveInDetails.moveInDate}
            onChange={(e) => updateFormData('moveInDetails', 'moveInDate', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="leaseDuration">Lease Duration</Label>
          <Select
            value={formData.moveInDetails.leaseDuration}
            onValueChange={(value) => updateFormData('moveInDetails', 'leaseDuration', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How long?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3-months">3 months</SelectItem>
              <SelectItem value="6-months">6 months</SelectItem>
              <SelectItem value="1-year">1 year</SelectItem>
              <SelectItem value="2-years">2 years</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="budget">Monthly Budget (MXN)</Label>
          <Input
            id="budget"
            type="number"
            value={formData.moveInDetails.budget}
            onChange={(e) => updateFormData('moveInDetails', 'budget', e.target.value)}
            placeholder="8000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="motivation">Why do you want to live with {roommateName}?</Label>
        <Textarea
          id="motivation"
          value={formData.moveInDetails.motivation}
          onChange={(e) => updateFormData('moveInDetails', 'motivation', e.target.value)}
          placeholder="Share what attracted you to this living situation and what you hope to contribute to the household..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="questions">Questions for {roommateName}</Label>
        <Textarea
          id="questions"
          value={formData.moveInDetails.questions}
          onChange={(e) => updateFormData('moveInDetails', 'questions', e.target.value)}
          placeholder="Any questions about the living situation, house rules, or anything else you'd like to know?"
          rows={3}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="refName">Full Name</Label>
              <Input
                id="refName"
                value={formData.moveInDetails.references[0].name}
                onChange={(e) => updateFormData('moveInDetails', 'references', [{
                  ...formData.moveInDetails.references[0],
                  name: e.target.value
                }])}
                placeholder="Reference name"
              />
            </div>
            <div>
              <Label htmlFor="refRelationship">Relationship</Label>
              <Input
                id="refRelationship"
                value={formData.moveInDetails.references[0].relationship}
                onChange={(e) => updateFormData('moveInDetails', 'references', [{
                  ...formData.moveInDetails.references[0],
                  relationship: e.target.value
                }])}
                placeholder="Friend, colleague, etc."
              />
            </div>
            <div>
              <Label htmlFor="refContact">Contact Info</Label>
              <Input
                id="refContact"
                value={formData.moveInDetails.references[0].contact}
                onChange={(e) => updateFormData('moveInDetails', 'references', [{
                  ...formData.moveInDetails.references[0],
                  contact: e.target.value
                }])}
                placeholder="Phone or email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
        <p className="text-sm text-blue-700">
          After submitting your application, {roommateName} will review it and may reach out for a video call or in-person meeting. 
          This is a great opportunity for both of you to ask questions and see if you're a good match!
        </p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderLifestyleStep();
      case 3:
        return renderLivingPreferencesStep();
      case 4:
        return renderInterestsStep();
      case 5:
        return renderCompatibilityStep();
      case 6:
        return renderMoveInDetailsStep();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Roommate Application</CardTitle>
              <p className="text-gray-600 mt-1">
                Applying to live with: <span className="font-semibold">{roommateName}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                At: {propertyName}
              </p>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-300">
              ${monthlyRent.toLocaleString()}/month
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Step {currentStep} of {totalSteps}</h3>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="mb-2" />
          <p className="text-sm text-gray-600">{stepTitles[currentStep - 1]}</p>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {currentStep === 1 && <User className="w-5 h-5 mr-2" />}
            {currentStep === 2 && <Home className="w-5 h-5 mr-2" />}
            {currentStep === 3 && <Clock className="w-5 h-5 mr-2" />}
            {currentStep === 4 && <Heart className="w-5 h-5 mr-2" />}
            {currentStep === 5 && <Users className="w-5 h-5 mr-2" />}
            {currentStep === 6 && <Check className="w-5 h-5 mr-2" />}
            {stepTitles[currentStep - 1]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateApplicationForm; 