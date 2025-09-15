import { Property, Room, User, UserProfile } from "./types";
import { getPropertyPhotos, roommatePhotos } from "./photo-urls";

// Extended mock properties for search
export const searchMockProperties: any[] = [
  {
    _id: 'prop_001',
    hosterId: 'user_hoster_001',
    name: 'Modern Downtown Apartment',
    description: 'Beautiful 3-bedroom apartment in the heart of downtown with modern amenities. Perfect for young professionals and students. Walking distance to metro stations and universities.',
    propertyType: 'apartment',
    furnishingType: 'furnished',
    status: 'approved',
    location: {
      address: 'Av. Insurgentes Sur 1234',
      city: 'Mexico City',
      state: 'CDMX',
      zipCode: '03100',
      country: 'Mexico',
      coordinates: { latitude: 19.3910, longitude: -99.1620 }
    },
    totalArea: 120,
    totalRooms: 3,
    totalBathrooms: 2,
    parkingSpaces: 1,
    rentalType: 'both',
    fullPropertyPrice: 25000,
    availableFrom: new Date('2024-02-01'),
    amenities: ['wifi', 'gym', 'pool', 'security', 'parking', 'laundry', 'rooftop'],
    photos: getPropertyPhotos('prop_001'),
    rooms: [
      {
        roomNumber: 1,
        name: 'Master Bedroom',
        features: 'private_bathroom_balcony',
        calculatedPrice: 12000,
        availableFrom: '2024-02-01',
        arrangement: 'mixed'
      },
      {
        roomNumber: 2,
        name: 'Second Bedroom',
        features: 'shared_bathroom',
        calculatedPrice: 8000,
        availableFrom: '2024-02-15',
        arrangement: 'female_only'
      },
      {
        roomNumber: 3,
        name: 'Third Bedroom',
        features: 'shared_bathroom',
        calculatedPrice: 5000,
        availableFrom: '2024-03-01',
        arrangement: 'male_only'
      }
    ],
    rating: 4.6,
    reviewCount: 23,
    responseTime: '< 1 hour',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z')
  },
  {
    _id: 'prop_002',
    hosterId: 'user_hoster_002',
    name: 'Cozy Student House Near UNAM',
    description: 'Perfect for students! 4-bedroom house just 10 minutes from UNAM. Quiet neighborhood, great for studying. Includes all utilities and high-speed internet.',
    propertyType: 'house',
    furnishingType: 'semi_furnished',
    status: 'active',
    location: {
      address: 'Calle Universidad 567',
      city: 'Mexico City',
      state: 'CDMX',
      zipCode: '04510',
      country: 'Mexico',
      coordinates: { latitude: 19.3326, longitude: -99.1332 }
    },
    totalArea: 200,
    totalRooms: 4,
    totalBathrooms: 3,
    parkingSpaces: 2,
    rentalType: 'by_room',
    fullPropertyPrice: 20000,
    availableFrom: '2024-03-01',
    amenities: ['wifi', 'kitchen', 'laundry', 'study_room', 'parking', 'garden'],
    photos: getPropertyPhotos('prop_002'),
    rooms: [
      {
        roomNumber: 1,
        name: 'Room A',
        features: 'private_bathroom',
        calculatedPrice: 6000,
        availableFrom: '2024-03-01',
        arrangement: 'mixed'
      },
      {
        roomNumber: 2,
        name: 'Room B',
        features: 'shared_bathroom',
        calculatedPrice: 4500,
        availableFrom: '2024-03-01',
        arrangement: 'mixed'
      },
      {
        roomNumber: 3,
        name: 'Room C',
        features: 'shared_bathroom',
        calculatedPrice: 4500,
        availableFrom: '2024-03-15',
        arrangement: 'female_only'
      },
      {
        roomNumber: 4,
        name: 'Room D',
        features: 'shared_bathroom_balcony',
        calculatedPrice: 5000,
        availableFrom: '2024-03-01',
        arrangement: 'male_only'
      }
    ],
    rating: 4.2,
    reviewCount: 15,
    responseTime: '< 2 hours',
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z'
  },
  {
    _id: 'prop_003',
    hosterId: 'user_hoster_003',
    name: 'Luxury Penthouse Polanco',
    description: 'Exclusive penthouse in the heart of Polanco with panoramic city views. Premium amenities including rooftop terrace, concierge service, and private elevator.',
    propertyType: 'apartment',
    furnishingType: 'furnished',
    status: 'active',
    location: {
      address: 'Av. Polanco 890',
      city: 'Mexico City',
      state: 'CDMX',
      zipCode: '11560',
      country: 'Mexico',
      coordinates: { latitude: 19.4326, longitude: -99.1932 }
    },
    totalArea: 180,
    totalRooms: 2,
    totalBathrooms: 2,
    parkingSpaces: 2,
    rentalType: 'full_property',
    fullPropertyPrice: 45000,
    availableFrom: '2024-02-15',
    amenities: ['wifi', 'gym', 'pool', 'security', 'parking', 'concierge', 'rooftop', 'elevator'],
    photos: getPropertyPhotos('prop_003'),
    rooms: [],
    rating: 4.9,
    reviewCount: 8,
    responseTime: '< 30 min',
    createdAt: '2024-01-10T15:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z'
  },
  {
    _id: 'prop_004',
    hosterId: 'user_hoster_004',
    name: 'Affordable Shared House Roma Norte',
    description: 'Budget-friendly shared house in trendy Roma Norte. Great for students and young professionals. Close to cafes, restaurants, and nightlife.',
    propertyType: 'house',
    furnishingType: 'unfurnished',
    status: 'active',
    location: {
      address: 'Calle Orizaba 456',
      city: 'Mexico City',
      state: 'CDMX',
      zipCode: '06700',
      country: 'Mexico',
      coordinates: { latitude: 19.4100, longitude: -99.1600 }
    },
    totalArea: 90,
    totalRooms: 3,
    totalBathrooms: 1,
    parkingSpaces: 0,
    rentalType: 'by_room',
    fullPropertyPrice: 12000,
    availableFrom: '2024-04-01',
    amenities: ['wifi', 'kitchen', 'rooftop'],
    photos: getPropertyPhotos('prop_004'),
    rooms: [
      {
        roomNumber: 1,
        name: 'Small Room',
        features: 'shared_bathroom',
        calculatedPrice: 4000,
        availableFrom: '2024-04-01',
        arrangement: 'mixed'
      },
      {
        roomNumber: 2,
        name: 'Medium Room',
        features: 'shared_bathroom',
        calculatedPrice: 4000,
        availableFrom: '2024-04-01',
        arrangement: 'mixed'
      },
      {
        roomNumber: 3,
        name: 'Large Room',
        features: 'shared_bathroom',
        calculatedPrice: 4000,
        availableFrom: '2024-04-01',
        arrangement: 'mixed'
      }
    ],
    rating: 3.8,
    reviewCount: 12,
    responseTime: '< 4 hours',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z'
  },
  {
    _id: 'prop_005',
    hosterId: 'user_hoster_005',
    name: 'Executive Apartment Santa Fe',
    description: 'Modern executive apartment in Santa Fe business district. Perfect for working professionals. Close to corporate offices and shopping centers.',
    propertyType: 'apartment',
    furnishingType: 'furnished',
    status: 'active',
    location: {
      address: 'Av. Santa Fe 1200',
      city: 'Mexico City',
      state: 'CDMX',
      zipCode: '01210',
      country: 'Mexico',
      coordinates: { latitude: 19.3600, longitude: -99.2600 }
    },
    totalArea: 85,
    totalRooms: 2,
    totalBathrooms: 1,
    parkingSpaces: 1,
    rentalType: 'full_property',
    fullPropertyPrice: 22000,
    availableFrom: '2024-03-15',
    amenities: ['wifi', 'gym', 'security', 'parking', 'elevator', 'business_center'],
    photos: getPropertyPhotos('prop_005'),
    rooms: [],
    rating: 4.4,
    reviewCount: 18,
    responseTime: '< 1 hour',
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-25T16:20:00Z'
  },
  {
    _id: 'prop_006',
    hosterId: 'user_hoster_006',
    name: 'Coliving Space Condesa',
    description: 'Modern coliving space in hip Condesa neighborhood. Designed for digital nomads and remote workers. All-inclusive with cleaning service.',
    propertyType: 'house',
    furnishingType: 'furnished',
    status: 'active',
    location: {
      address: 'Calle Amsterdam 789',
      city: 'Mexico City',
      state: 'CDMX',
      zipCode: '06140',
      country: 'Mexico',
      coordinates: { latitude: 19.4100, longitude: -99.1700 }
    },
    totalArea: 250,
    totalRooms: 6,
    totalBathrooms: 4,
    parkingSpaces: 2,
    rentalType: 'by_room',
    fullPropertyPrice: 36000,
    availableFrom: '2024-02-10',
    amenities: ['wifi', 'gym', 'coworking', 'kitchen', 'laundry', 'cleaning', 'rooftop', 'garden'],
    photos: getPropertyPhotos('prop_006'),
    rooms: [
      {
        roomNumber: 1,
        name: 'Premium Suite',
        features: 'private_bathroom_balcony',
        calculatedPrice: 8000,
        availableFrom: '2024-02-10',
        arrangement: 'mixed'
      },
      {
        roomNumber: 2,
        name: 'Standard Room A',
        features: 'shared_bathroom',
        calculatedPrice: 6000,
        availableFrom: '2024-02-15',
        arrangement: 'mixed'
      },
      {
        roomNumber: 3,
        name: 'Standard Room B',
        features: 'shared_bathroom',
        calculatedPrice: 6000,
        availableFrom: '2024-03-01',
        arrangement: 'female_only'
      },
      {
        roomNumber: 4,
        name: 'Compact Room',
        features: 'shared_bathroom',
        calculatedPrice: 5000,
        availableFrom: '2024-02-20',
        arrangement: 'mixed'
      }
    ],
    rating: 4.7,
    reviewCount: 31,
    responseTime: '< 30 min',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-28T09:45:00Z'
  }
];

// Search filter options
export const searchFilters = {
  priceRanges: [
    { value: '0-5000', label: 'Under $5,000', min: 0, max: 5000 },
    { value: '5000-10000', label: '$5,000 - $10,000', min: 5000, max: 10000 },
    { value: '10000-20000', label: '$10,000 - $20,000', min: 10000, max: 20000 },
    { value: '20000-30000', label: '$20,000 - $30,000', min: 20000, max: 30000 },
    { value: '30000-50000', label: '$30,000 - $50,000', min: 30000, max: 50000 },
    { value: '50000+', label: '$50,000+', min: 50000, max: Infinity }
  ],
  
  propertyTypes: [
    { value: 'apartment', label: 'Apartment', icon: 'Building' },
    { value: 'house', label: 'House', icon: 'Home' },
    { value: 'studio', label: 'Studio', icon: 'Square' }
  ],
  
  rentalTypes: [
    { value: 'full_property', label: 'Entire Property', description: 'Rent the whole place' },
    { value: 'by_room', label: 'Room Only', description: 'Rent a single room' },
    { value: 'both', label: 'Both Options', description: 'Either option available' }
  ],
  
  furnishingTypes: [
    { value: 'furnished', label: 'Furnished', description: 'Fully furnished with all essentials' },
    { value: 'semi_furnished', label: 'Semi-Furnished', description: 'Basic furniture provided' },
    { value: 'unfurnished', label: 'Unfurnished', description: 'Empty, bring your own furniture' }
  ],
  
  neighborhoods: [
    { value: 'polanco', label: 'Polanco', city: 'Mexico City' },
    { value: 'roma_norte', label: 'Roma Norte', city: 'Mexico City' },
    { value: 'condesa', label: 'Condesa', city: 'Mexico City' },
    { value: 'santa_fe', label: 'Santa Fe', city: 'Mexico City' },
    { value: 'del_valle', label: 'Del Valle', city: 'Mexico City' },
    { value: 'coyoacan', label: 'Coyoacán', city: 'Mexico City' }
  ],
  
  amenityCategories: [
    {
      category: 'Essential',
      amenities: [
        { id: 'wifi', name: 'WiFi', icon: 'Wifi' },
        { id: 'kitchen', name: 'Kitchen', icon: 'ChefHat' },
        { id: 'laundry', name: 'Laundry', icon: 'Shirt' },
        { id: 'parking', name: 'Parking', icon: 'Car' }
      ]
    },
    {
      category: 'Fitness & Recreation',
      amenities: [
        { id: 'gym', name: 'Gym', icon: 'Dumbbell' },
        { id: 'pool', name: 'Pool', icon: 'Waves' },
        { id: 'rooftop', name: 'Rooftop', icon: 'Sun' },
        { id: 'garden', name: 'Garden', icon: 'Trees' }
      ]
    },
    {
      category: 'Work & Study',
      amenities: [
        { id: 'coworking', name: 'Coworking Space', icon: 'Briefcase' },
        { id: 'study_room', name: 'Study Room', icon: 'BookOpen' },
        { id: 'business_center', name: 'Business Center', icon: 'Building2' }
      ]
    },
    {
      category: 'Services',
      amenities: [
        { id: 'security', name: 'Security', icon: 'Shield' },
        { id: 'concierge', name: 'Concierge', icon: 'Users' },
        { id: 'cleaning', name: 'Cleaning Service', icon: 'Sparkles' },
        { id: 'elevator', name: 'Elevator', icon: 'ArrowUp' }
      ]
    }
  ]
};

// Roommate compatibility factors
export const compatibilityFactors = [
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    options: [
      { value: 'early_bird', label: 'Early Bird', description: 'Wake up early, sleep early' },
      { value: 'night_owl', label: 'Night Owl', description: 'Stay up late, wake up late' },
      { value: 'flexible', label: 'Flexible', description: 'Adaptable schedule' }
    ]
  },
  {
    id: 'social_level',
    name: 'Social Level',
    options: [
      { value: 'very_social', label: 'Very Social', description: 'Love having friends over' },
      { value: 'moderately_social', label: 'Moderately Social', description: 'Occasional gatherings' },
      { value: 'quiet', label: 'Quiet', description: 'Prefer peaceful environment' }
    ]
  },
  {
    id: 'cleanliness',
    name: 'Cleanliness',
    options: [
      { value: 'very_clean', label: 'Very Clean', description: 'Everything spotless always' },
      { value: 'clean', label: 'Clean', description: 'Tidy and organized' },
      { value: 'relaxed', label: 'Relaxed', description: 'Lived-in is fine' }
    ]
  },
  {
    id: 'work_style',
    name: 'Work Style',
    options: [
      { value: 'work_from_home', label: 'Work from Home', description: 'Home office setup' },
      { value: 'office_worker', label: 'Office Worker', description: 'Work outside home' },
      { value: 'student', label: 'Student', description: 'Studying full-time' },
      { value: 'freelancer', label: 'Freelancer', description: 'Flexible work schedule' }
    ]
  },
  {
    id: 'guests',
    name: 'Guests Policy',
    options: [
      { value: 'frequent_guests', label: 'Frequent Guests', description: 'Often have friends over' },
      { value: 'occasional_guests', label: 'Occasional Guests', description: 'Sometimes have visitors' },
      { value: 'no_guests', label: 'No Guests', description: 'Prefer no visitors' }
    ]
  },
  {
    id: 'pets',
    name: 'Pet Preference',
    options: [
      { value: 'love_pets', label: 'Love Pets', description: 'Have or want pets' },
      { value: 'okay_with_pets', label: 'Okay with Pets', description: 'Don\'t mind pets' },
      { value: 'no_pets', label: 'No Pets', description: 'Prefer pet-free environment' }
    ]
  }
];

// Mock user profiles for roommate matching
export const mockRoommateProfiles = [
  {
    userId: 'user_roomie_001',
    name: 'Carlos Mendez',
    age: 24,
    occupation: 'Software Engineer',
    bio: 'Tech professional looking for a clean, quiet place to live. I work from home 2-3 days a week.',
    preferences: {
      lifestyle: 'early_bird',
      social_level: 'moderately_social',
      cleanliness: 'very_clean',
      work_style: 'work_from_home',
      guests: 'occasional_guests',
      pets: 'okay_with_pets'
    },
    interests: ['technology', 'fitness', 'cooking', 'movies'],
    languages: ['Spanish', 'English'],
    budget: { min: 8000, max: 15000 },
    profileImage: roommatePhotos[0]
  },
  {
    userId: 'user_roomie_002',
    name: 'Ana Silva',
    age: 22,
    occupation: 'University Student',
    bio: 'Psychology student at UNAM. Love to study in quiet environments but also enjoy good conversations.',
    preferences: {
      lifestyle: 'night_owl',
      social_level: 'quiet',
      cleanliness: 'clean',
      work_style: 'student',
      guests: 'no_guests',
      pets: 'love_pets'
    },
    interests: ['psychology', 'reading', 'yoga', 'art'],
    languages: ['Spanish', 'English', 'French'],
    budget: { min: 4000, max: 8000 },
    profileImage: roommatePhotos[1]
  },
  {
    userId: 'user_roomie_003',
    name: 'Diego Torres',
    age: 28,
    occupation: 'Marketing Manager',
    bio: 'Outgoing marketing professional who loves hosting dinner parties and meeting new people.',
    preferences: {
      lifestyle: 'flexible',
      social_level: 'very_social',
      cleanliness: 'clean',
      work_style: 'office_worker',
      guests: 'frequent_guests',
      pets: 'okay_with_pets'
    },
    interests: ['marketing', 'networking', 'cooking', 'travel'],
    languages: ['Spanish', 'English', 'Portuguese'],
    budget: { min: 10000, max: 20000 },
    profileImage: roommatePhotos[2]
  },
  {
    userId: 'user_roomie_004',
    name: 'Maria Gonzalez',
    age: 26,
    occupation: 'Graphic Designer',
    bio: 'Creative designer who loves minimalist spaces and plants. I enjoy quiet evenings with good books and weekend art projects.',
    preferences: {
      lifestyle: 'early_bird',
      social_level: 'quiet',
      cleanliness: 'very_clean',
      work_style: 'freelancer',
      guests: 'occasional_guests',
      pets: 'love_pets'
    },
    interests: ['art', 'design', 'photography', 'plants', 'reading'],
    languages: ['Spanish', 'English'],
    budget: { min: 6000, max: 12000 },
    profileImage: roommatePhotos[3]
  },
  {
    userId: 'user_roomie_005',
    name: 'Alex Thompson',
    age: 29,
    occupation: 'Data Scientist',
    bio: 'Tech professional who loves board games and cooking experiments. Looking for roommates who appreciate good food and interesting conversations.',
    preferences: {
      lifestyle: 'night_owl',
      social_level: 'moderately_social',
      cleanliness: 'clean',
      work_style: 'work_from_home',
      guests: 'frequent_guests',
      pets: 'okay_with_pets'
    },
    interests: ['technology', 'cooking', 'gaming', 'data science', 'board games'],
    languages: ['English', 'Spanish', 'German'],
    budget: { min: 12000, max: 18000 },
    profileImage: roommatePhotos[4]
  },
  {
    userId: 'user_roomie_006',
    name: 'Camila Rodriguez',
    age: 23,
    occupation: 'Medical Student',
    bio: 'Med student at UNAM with a busy schedule. I value quiet study time but also enjoy unwinding with yoga and Netflix.',
    preferences: {
      lifestyle: 'flexible',
      social_level: 'quiet',
      cleanliness: 'very_clean',
      work_style: 'student',
      guests: 'no_guests',
      pets: 'no_pets'
    },
    interests: ['medicine', 'yoga', 'netflix', 'coffee', 'studying'],
    languages: ['Spanish', 'English'],
    budget: { min: 5000, max: 9000 },
    profileImage: roommatePhotos[5]
  },
  {
    userId: 'user_roomie_007',
    name: 'James Wilson',
    age: 31,
    occupation: 'English Teacher',
    bio: 'Native English speaker teaching at international schools. Love exploring Mexico City, trying local food, and practicing Spanish.',
    preferences: {
      lifestyle: 'early_bird',
      social_level: 'very_social',
      cleanliness: 'clean',
      work_style: 'office_worker',
      guests: 'frequent_guests',
      pets: 'okay_with_pets'
    },
    interests: ['teaching', 'languages', 'travel', 'food', 'culture'],
    languages: ['English', 'Spanish', 'French'],
    budget: { min: 8000, max: 14000 },
    profileImage: roommatePhotos[6]
  },
  {
    userId: 'user_roomie_008',
    name: 'Isabella Martinez',
    age: 25,
    occupation: 'Fashion Designer',
    bio: 'Fashion designer working for local brands. I love aesthetic spaces, morning coffee rituals, and weekend market visits.',
    preferences: {
      lifestyle: 'early_bird',
      social_level: 'moderately_social',
      cleanliness: 'very_clean',
      work_style: 'office_worker',
      guests: 'occasional_guests',
      pets: 'love_pets'
    },
    interests: ['fashion', 'design', 'shopping', 'coffee', 'markets'],
    languages: ['Spanish', 'English', 'Italian'],
    budget: { min: 7000, max: 13000 },
    profileImage: roommatePhotos[7]
  },
  {
    userId: 'user_roomie_009',
    name: 'Miguel Santos',
    age: 27,
    occupation: 'Fitness Trainer',
    bio: 'Personal trainer passionate about healthy living. Early riser who loves meal prep, outdoor activities, and motivating others.',
    preferences: {
      lifestyle: 'early_bird',
      social_level: 'very_social',
      cleanliness: 'clean',
      work_style: 'office_worker',
      guests: 'frequent_guests',
      pets: 'okay_with_pets'
    },
    interests: ['fitness', 'nutrition', 'outdoor activities', 'sports', 'motivation'],
    languages: ['Spanish', 'English'],
    budget: { min: 9000, max: 15000 },
    profileImage: roommatePhotos[8]
  },
  {
    userId: 'user_roomie_010',
    name: 'Emma Johnson',
    age: 24,
    occupation: 'Digital Nomad',
    bio: 'Remote marketing consultant who travels frequently. When I\'m home, I love cozy spaces, indie music, and trying new cafes.',
    preferences: {
      lifestyle: 'flexible',
      social_level: 'moderately_social',
      cleanliness: 'clean',
      work_style: 'work_from_home',
      guests: 'occasional_guests',
      pets: 'love_pets'
    },
    interests: ['travel', 'marketing', 'music', 'cafes', 'remote work'],
    languages: ['English', 'Spanish', 'Portuguese'],
    budget: { min: 10000, max: 16000 },
    profileImage: roommatePhotos[9]
  },
  {
    userId: 'user_roomie_011',
    name: 'Ricardo Morales',
    age: 30,
    occupation: 'Chef',
    bio: 'Professional chef who loves sharing amazing meals with roommates. I work evenings but enjoy cooking breakfast for everyone on weekends.',
    preferences: {
      lifestyle: 'night_owl',
      social_level: 'very_social',
      cleanliness: 'clean',
      work_style: 'office_worker',
      guests: 'frequent_guests',
      pets: 'okay_with_pets'
    },
    interests: ['cooking', 'food', 'restaurants', 'wine', 'hospitality'],
    languages: ['Spanish', 'English'],
    budget: { min: 11000, max: 17000 },
    profileImage: roommatePhotos[10]
  },
  {
    userId: 'user_roomie_012',
    name: 'Sarah Kim',
    age: 28,
    occupation: 'UX Designer',
    bio: 'UX designer for tech startups. I love clean, functional spaces and am always happy to help with any design needs around the house.',
    preferences: {
      lifestyle: 'flexible',
      social_level: 'moderately_social',
      cleanliness: 'very_clean',
      work_style: 'work_from_home',
      guests: 'occasional_guests',
      pets: 'okay_with_pets'
    },
    interests: ['design', 'technology', 'minimalism', 'podcasts', 'hiking'],
    languages: ['English', 'Spanish', 'Korean'],
    budget: { min: 13000, max: 19000 },
    profileImage: roommatePhotos[11]
  }
];

// Search service
export const searchService = {
  async searchProperties(filters: any) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    let results = [...searchMockProperties];
    
    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(property => 
        property.name.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.city.toLowerCase().includes(query) ||
        property.location.address.toLowerCase().includes(query)
      );
    }
    
    if (filters.priceRange && filters.priceRange !== 'all') {
      const range = searchFilters.priceRanges.find(r => r.value === filters.priceRange);
      if (range) {
        results = results.filter(property => {
          const price = filters.rentalType === 'by_room' 
            ? Math.min(...(property.rooms?.map((r: any) => r.calculatedPrice) || [property.fullPropertyPrice]))
            : property.fullPropertyPrice;
          return price >= range.min && (range.max === Infinity || price <= range.max);
        });
      }
    }
    
    if (filters.propertyType && filters.propertyType !== 'all') {
      results = results.filter(property => property.propertyType === filters.propertyType);
    }
    
    if (filters.rentalType && filters.rentalType !== 'all') {
      results = results.filter(property => 
        property.rentalType === filters.rentalType || property.rentalType === 'both'
      );
    }
    
    if (filters.furnishingType && filters.furnishingType !== 'all') {
      results = results.filter(property => property.furnishingType === filters.furnishingType);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter(property => 
        filters.amenities.every((amenity: string) => property.amenities.includes(amenity))
      );
    }
    
    if (filters.minRooms) {
      results = results.filter(property => property.totalRooms >= filters.minRooms);
    }
    
    if (filters.minBathrooms) {
      results = results.filter(property => property.totalBathrooms >= filters.minBathrooms);
    }
    
    // Sort results
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_low':
            return a.fullPropertyPrice - b.fullPropertyPrice;
          case 'price_high':
            return b.fullPropertyPrice - a.fullPropertyPrice;
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
    }
    
    return {
      properties: results,
      total: results.length,
      filters: filters
    };
  },
  
  async getPropertyById(propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return searchMockProperties.find(p => p._id === propertyId) || null;
  },
  
  async findCompatibleRoommates(userPreferences: any) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simple compatibility scoring
    const scored = mockRoommateProfiles.map(profile => {
      let score = 0;
      let matches = 0;
      
      Object.keys(userPreferences).forEach(key => {
        if ((profile.preferences as any)[key]) {
          matches++;
          if ((profile.preferences as any)[key] === userPreferences[key]) {
            score += 20;
          } else {
            // Partial compatibility for some preferences
            if (key === 'social_level' || key === 'cleanliness') {
              score += 10;
            }
          }
        }
      });
      
      return {
        ...profile,
        compatibilityScore: Math.round((score / (matches * 20)) * 100)
      };
    });
    
    return scored
      .filter(profile => profile.compatibilityScore >= 40)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  },
  
  async addToFavorites(userId: string, propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In real app, this would save to database
    return { success: true };
  },
  
  async removeFromFavorites(userId: string, propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // In real app, this would remove from database
    return { success: true };
  },
  
  async getFavorites(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Mock favorites - in real app, this would come from database
    const favoriteIds = ['prop_001', 'prop_003', 'prop_006'];
    return searchMockProperties.filter(p => favoriteIds.includes(p._id));
  }
}; 