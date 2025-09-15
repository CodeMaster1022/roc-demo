// =============================================
// PROPERTY MANAGEMENT MOCK DATA
// =============================================

import { Property, Room } from "./types";
import { getPropertyPhotos } from './photo-urls';

// Room feature options with point values for pricing
export const roomFeatureOptions = [
  {
    value: "walk_in_closet_full_bathroom_terrace",
    label: "Walk-in closet, full bathroom, and terrace",
    points: 35,
    description: "Premium room with all amenities"
  },
  {
    value: "walk_in_closet_full_bathroom",
    label: "Walk-in closet and full bathroom",
    points: 32,
    description: "High-end room with private bathroom"
  },
  {
    value: "closet_full_bathroom_terrace",
    label: "Closet, full bathroom, and terrace",
    points: 30,
    description: "Great room with outdoor access"
  },
  {
    value: "closet_full_bathroom",
    label: "Closet and full bathroom",
    points: 28,
    description: "Standard room with private bathroom"
  },
  {
    value: "closet_shared_bathroom",
    label: "Closet and shared bathroom",
    points: 24,
    description: "Basic room with shared facilities"
  },
  {
    value: "service_room_full_bathroom",
    label: "Service room with full bathroom",
    points: 18,
    description: "Compact room with private bathroom"
  },
  {
    value: "service_room_shared_bathroom",
    label: "Service room with shared bathroom",
    points: 15,
    description: "Basic service room"
  }
];

// Property amenities mock data
export const propertyAmenities = [
  {
    id: "1",
    name: { en: "Swimming Pool", es: "Piscina" },
    icon: "waves",
    category: "recreation"
  },
  {
    id: "2", 
    name: { en: "Gym", es: "Gimnasio" },
    icon: "dumbbell",
    category: "recreation"
  },
  {
    id: "3",
    name: { en: "Laundry Room", es: "Cuarto de Lavado" },
    icon: "washing-machine",
    category: "utilities"
  },
  {
    id: "4",
    name: { en: "Parking", es: "Estacionamiento" },
    icon: "car",
    category: "parking"
  },
  {
    id: "5",
    name: { en: "WiFi", es: "WiFi" },
    icon: "wifi",
    category: "utilities"
  },
  {
    id: "6",
    name: { en: "Air Conditioning", es: "Aire Acondicionado" },
    icon: "snowflake",
    category: "utilities"
  },
  {
    id: "7",
    name: { en: "Rooftop Terrace", es: "Terraza en Azotea" },
    icon: "building",
    category: "recreation"
  },
  {
    id: "8",
    name: { en: "Security", es: "Seguridad" },
    icon: "shield",
    category: "security"
  },
  {
    id: "9",
    name: { en: "Elevator", es: "Elevador" },
    icon: "arrow-up",
    category: "accessibility"
  },
  {
    id: "10",
    name: { en: "Garden", es: "Jardín" },
    icon: "tree-pine",
    category: "recreation"
  }
];

// Coverage areas mock data
export const coverageAreas = [
  {
    id: "1",
    name: "Roma Norte",
    city: "Mexico City",
    state: "CDMX"
  },
  {
    id: "2",
    name: "Condesa",
    city: "Mexico City", 
    state: "CDMX"
  },
  {
    id: "3",
    name: "Polanco",
    city: "Mexico City",
    state: "CDMX"
  },
  {
    id: "4",
    name: "Santa Fe",
    city: "Mexico City",
    state: "CDMX"
  },
  {
    id: "5",
    name: "Providencia",
    city: "Guadalajara",
    state: "Jalisco"
  }
];

// Form options
export const propertyTypeOptions = [
  { value: "house", label: "House", icon: "home" },
  { value: "apartment", label: "Apartment", icon: "building" }
];

export const furnishingOptions = [
  { value: "furnished", label: "Furnished", description: "Fully equipped with furniture" },
  { value: "semi_furnished", label: "Semi-furnished", description: "Basic furniture included" },
  { value: "unfurnished", label: "Unfurnished", description: "No furniture included" }
];

export const rentalTypeOptions = [
  { 
    value: "full_property", 
    label: "Full Property", 
    description: "Rent the entire property to one tenant" 
  },
  { 
    value: "by_room", 
    label: "By Room", 
    description: "Rent individual rooms to different tenants" 
  },
  { 
    value: "both", 
    label: "Both Options", 
    description: "Allow both full property and room rentals" 
  }
];

export const contractTypeOptions = [
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
  { value: "12_months", label: "12 Months" },
  { value: "custom", label: "Custom Duration" }
];

// Pricing calculation utility
export const calculateRoomPrices = (rooms: any[], totalPropertyPrice: number) => {
  // Calculate total points
  const totalPoints = rooms.reduce((sum, room) => {
    const feature = roomFeatureOptions.find(f => f.value === room.features);
    return sum + (feature?.points || 0);
  }, 0);

  // Calculate price for each room
  return rooms.map(room => {
    const feature = roomFeatureOptions.find(f => f.value === room.features);
    const points = feature?.points || 0;
    const calculatedPrice = totalPoints > 0 ? (points / totalPoints) * totalPropertyPrice : 0;
    
    return {
      ...room,
      calculatedPrice: Math.round(calculatedPrice),
      points
    };
  });
};

// Mock Properties with detailed information
export const mockProperties = [
  {
    _id: 'prop_001',
    hosterId: 'user_hoster_001',
    name: 'Modern Downtown Apartment',
    description: 'Beautiful 3-bedroom apartment in the heart of downtown with modern amenities',
    propertyType: 'apartment',
    furnishingType: 'furnished',
    status: 'active',
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
    availableFrom: '2024-02-01',
    amenities: ['wifi', 'gym', 'pool', 'security', 'parking'],
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
    analytics: {
      views: 1247,
      favorites: 89,
      applications: 15,
      bookings: 2,
      revenue: 50000,
      occupancyRate: 67,
      averageStay: 8.5,
      rating: 4.6,
      responseRate: 95
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    _id: 'prop_002',
    hosterId: 'user_hoster_001',
    name: 'Cozy Student House',
    description: 'Perfect for students, near universities with all amenities included',
    propertyType: 'house',
    furnishingType: 'semi_furnished',
    status: 'pending',
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
    amenities: ['wifi', 'kitchen', 'laundry', 'study_room'],
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
    analytics: {
      views: 234,
      favorites: 12,
      applications: 3,
      bookings: 0,
      revenue: 0,
      occupancyRate: 0,
      averageStay: 0,
      rating: 0,
      responseRate: 100
    },
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z'
  },
  {
    _id: 'prop_003',
    hosterId: 'user_hoster_001',
    name: 'Luxury Penthouse',
    description: 'Exclusive penthouse with panoramic city views and premium amenities',
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
    amenities: ['wifi', 'gym', 'pool', 'security', 'parking', 'concierge', 'rooftop'],
    photos: getPropertyPhotos('prop_003'),
    rooms: [],
    analytics: {
      views: 892,
      favorites: 67,
      applications: 8,
      bookings: 1,
      revenue: 45000,
      occupancyRate: 100,
      averageStay: 12,
      rating: 4.9,
      responseRate: 98
    },
    createdAt: '2024-01-10T15:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z'
  },
  {
    _id: 'prop_004',
    hosterId: 'user_hoster_001',
    name: 'Budget Friendly Rooms',
    description: 'Affordable rooms for students and young professionals',
    propertyType: 'house',
    furnishingType: 'unfurnished',
    status: 'inactive',
    location: {
      address: 'Calle Reforma 123',
      city: 'Mexico City',
      state: 'CDMX',
      zipCode: '06600',
      country: 'Mexico',
      coordinates: { latitude: 19.4285, longitude: -99.1277 }
    },
    totalArea: 90,
    totalRooms: 3,
    totalBathrooms: 1,
    parkingSpaces: 0,
    rentalType: 'by_room',
    fullPropertyPrice: 12000,
    availableFrom: '2024-04-01',
    amenities: ['wifi', 'kitchen'],
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
    analytics: {
      views: 156,
      favorites: 8,
      applications: 2,
      bookings: 0,
      revenue: 0,
      occupancyRate: 0,
      averageStay: 0,
      rating: 0,
      responseRate: 75
    },
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z'
  }
];

// Mock Applications
export const mockApplications = [
  {
    _id: 'app_001',
    propertyId: 'prop_001',
    roomId: null, // Full property application
    applicantId: 'user_tenant_001',
    applicantName: 'Maria Rodriguez',
    applicantEmail: 'maria.rodriguez@email.com',
    applicantPhone: '+52 55 1234 5678',
    status: 'pending',
    applicationDate: '2024-01-22T10:00:00Z',
    moveInDate: '2024-02-15T00:00:00Z',
    contractLength: 12,
    monthlyBudget: 25000,
    message: 'I am very interested in this property. I work as a software engineer and can provide references.',
    documents: [
      { type: 'id', url: '/documents/maria_id.pdf', verified: true },
      { type: 'income', url: '/documents/maria_income.pdf', verified: true },
      { type: 'references', url: '/documents/maria_refs.pdf', verified: false }
    ],
    score: 85
  },
  {
    _id: 'app_002',
    propertyId: 'prop_001',
    roomId: 'room_001_1', // Room application
    applicantId: 'user_roomie_001',
    applicantName: 'Carlos Mendez',
    applicantEmail: 'carlos.mendez@email.com',
    applicantPhone: '+52 55 9876 5432',
    status: 'approved',
    applicationDate: '2024-01-20T14:30:00Z',
    moveInDate: '2024-02-01T00:00:00Z',
    contractLength: 6,
    monthlyBudget: 12000,
    message: 'Looking for a room close to work. Clean and responsible tenant.',
    documents: [
      { type: 'id', url: '/documents/carlos_id.pdf', verified: true },
      { type: 'income', url: '/documents/carlos_income.pdf', verified: true }
    ],
    score: 92
  },
  {
    _id: 'app_003',
    propertyId: 'prop_001',
    roomId: 'room_001_2',
    applicantId: 'user_roomie_002',
    applicantName: 'Ana Silva',
    applicantEmail: 'ana.silva@email.com',
    applicantPhone: '+52 55 5555 1234',
    status: 'rejected',
    applicationDate: '2024-01-18T09:15:00Z',
    moveInDate: '2024-02-10T00:00:00Z',
    contractLength: 3,
    monthlyBudget: 8000,
    message: 'Student looking for affordable accommodation.',
    documents: [
      { type: 'id', url: '/documents/ana_id.pdf', verified: true },
      { type: 'student', url: '/documents/ana_student.pdf', verified: true }
    ],
    score: 65
  },
  {
    _id: 'app_004',
    propertyId: 'prop_002',
    roomId: 'room_002_1',
    applicantId: 'user_roomie_003',
    applicantName: 'Diego Torres',
    applicantEmail: 'diego.torres@email.com',
    applicantPhone: '+52 55 7777 8888',
    status: 'pending',
    applicationDate: '2024-01-25T16:45:00Z',
    moveInDate: '2024-03-01T00:00:00Z',
    contractLength: 12,
    monthlyBudget: 6000,
    message: 'Graduate student at UNAM, looking for long-term accommodation.',
    documents: [
      { type: 'id', url: '/documents/diego_id.pdf', verified: false },
      { type: 'student', url: '/documents/diego_student.pdf', verified: true },
      { type: 'references', url: '/documents/diego_refs.pdf', verified: false }
    ],
    score: 78
  },
  {
    _id: 'app_005',
    propertyId: 'prop_003',
    roomId: null,
    applicantId: 'user_tenant_002',
    applicantName: 'Roberto Kim',
    applicantEmail: 'roberto.kim@email.com',
    applicantPhone: '+52 55 3333 4444',
    status: 'approved',
    applicationDate: '2024-01-21T11:20:00Z',
    moveInDate: '2024-02-15T00:00:00Z',
    contractLength: 12,
    monthlyBudget: 45000,
    message: 'Executive looking for luxury accommodation. Excellent credit and references.',
    documents: [
      { type: 'id', url: '/documents/roberto_id.pdf', verified: true },
      { type: 'income', url: '/documents/roberto_income.pdf', verified: true },
      { type: 'references', url: '/documents/roberto_refs.pdf', verified: true },
      { type: 'credit', url: '/documents/roberto_credit.pdf', verified: true }
    ],
    score: 98
  }
];

// Property Dashboard Analytics
export const mockDashboardAnalytics = {
  overview: {
    totalProperties: 4,
    activeProperties: 2,
    totalApplications: 26,
    totalRevenue: 95000,
    occupancyRate: 75,
    averageRating: 4.5
  },
  monthlyMetrics: [
    { month: 'Oct 2023', revenue: 20000, applications: 8, views: 450 },
    { month: 'Nov 2023', revenue: 25000, applications: 12, views: 680 },
    { month: 'Dec 2023', revenue: 30000, applications: 15, views: 890 },
    { month: 'Jan 2024', revenue: 20000, applications: 18, views: 1200 }
  ],
  applicationTrends: [
    { date: '2024-01-15', applications: 2 },
    { date: '2024-01-16', applications: 1 },
    { date: '2024-01-17', applications: 3 },
    { date: '2024-01-18', applications: 4 },
    { date: '2024-01-19', applications: 2 },
    { date: '2024-01-20', applications: 5 },
    { date: '2024-01-21', applications: 3 },
    { date: '2024-01-22', applications: 6 }
  ],
  topPerformingProperties: [
    { propertyId: 'prop_001', name: 'Modern Downtown Apartment', revenue: 50000, applications: 15 },
    { propertyId: 'prop_003', name: 'Luxury Penthouse', revenue: 45000, applications: 8 },
    { propertyId: 'prop_002', name: 'Cozy Student House', revenue: 0, applications: 3 }
  ]
};

// Mock property creation service
export const mockPropertyService = {
  async createProperty(propertyData: any): Promise<Property> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newProperty: Property = {
      _id: `property_${Date.now()}`,
      hosterId: propertyData.hosterId,
      name: propertyData.name,
      description: propertyData.description,
      propertyType: propertyData.propertyType,
      furnishingType: propertyData.furnishingType,
      location: {
        address: propertyData.location.address,
        city: propertyData.location.city,
        state: propertyData.location.state,
        zipCode: propertyData.location.zipCode,
        country: propertyData.location.country || "Mexico",
        coordinates: {
          latitude: propertyData.location.coordinates?.latitude || 19.4326,
          longitude: propertyData.location.coordinates?.longitude || -99.1332
        }
      },
      totalArea: propertyData.totalArea,
      totalRooms: propertyData.totalRooms,
      totalBathrooms: propertyData.totalBathrooms,
      parkingSpaces: propertyData.parkingSpaces || 0,
      rentalType: propertyData.rentalType,
      fullPropertyPrice: propertyData.fullPropertyPrice,
      availableFrom: new Date(propertyData.availableFrom),
      photos: propertyData.photos || [],
      amenities: propertyData.amenities || [],
      rules: {
        petsAllowed: propertyData.rules?.petsAllowed || false,
        smokingAllowed: propertyData.rules?.smokingAllowed || false,
        gatheringsAllowed: propertyData.rules?.gatheringsAllowed || false
      },
      status: "pending_review",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newProperty;
  },

  async createRooms(propertyId: string, rooms: any[]): Promise<Room[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return rooms.map((room, index) => ({
      _id: `room_${Date.now()}_${index}`,
      propertyId,
      roomNumber: room.roomNumber || index + 1,
      name: room.name || `Room ${index + 1}`,
      features: room.features,
      furnishingType: room.furnishingType,
      price: room.price,
      availableFrom: new Date(room.availableFrom),
      isAvailable: true,
      arrangement: room.arrangement || "mixed",
      photos: room.photos || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  },

  async getPropertiesByHoster(hosterId: string) {
    return mockProperties.filter(p => p.hosterId === hosterId);
  },

  async getPropertyById(propertyId: string) {
    return mockProperties.find(p => p._id === propertyId) || null;
  },

  async updateProperty(propertyId: string, updates: any) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const propertyIndex = mockProperties.findIndex(p => p._id === propertyId);
    if (propertyIndex !== -1) {
      mockProperties[propertyIndex] = { 
        ...mockProperties[propertyIndex], 
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return mockProperties[propertyIndex];
    }
    throw new Error('Property not found');
  },

  async deleteProperty(propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const propertyIndex = mockProperties.findIndex(p => p._id === propertyId);
    if (propertyIndex !== -1) {
      mockProperties.splice(propertyIndex, 1);
      return true;
    }
    return false;
  },

  async getApplicationsByProperty(propertyId: string) {
    return mockApplications.filter(app => app.propertyId === propertyId);
  },

  async updateApplicationStatus(applicationId: string, status: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const appIndex = mockApplications.findIndex(app => app._id === applicationId);
    if (appIndex !== -1) {
      mockApplications[appIndex].status = status;
      return mockApplications[appIndex];
    }
    throw new Error('Application not found');
  },

  async getDashboardAnalytics(hosterId: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockDashboardAnalytics;
  },

  async getPropertyAnalytics(propertyId: string) {
    const property = mockProperties.find(p => p._id === propertyId);
    if (!property) throw new Error('Property not found');
    
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      ...property.analytics,
      viewsHistory: [
        { date: '2024-01-15', views: 45 },
        { date: '2024-01-16', views: 52 },
        { date: '2024-01-17', views: 38 },
        { date: '2024-01-18', views: 67 },
        { date: '2024-01-19', views: 43 },
        { date: '2024-01-20', views: 71 },
        { date: '2024-01-21', views: 58 }
      ],
      applicationHistory: mockApplications
        .filter(app => app.propertyId === propertyId)
        .map(app => ({
          date: app.applicationDate.split('T')[0],
          status: app.status,
          applicantName: app.applicantName
        }))
    };
  }
};

// Sample property data for testing
export const samplePropertyData = {
  name: "Beautiful Apartment in Roma Norte",
  description: "Spacious and modern apartment perfect for young professionals and students.",
  propertyType: "apartment",
  furnishingType: "furnished",
  location: {
    address: "Calle Orizaba 123",
    city: "Mexico City",
    state: "CDMX",
    zipCode: "06700",
    country: "Mexico",
    coordinates: {
      latitude: 19.4150,
      longitude: -99.1620
    }
  },
  totalArea: 120,
  totalRooms: 3,
  totalBathrooms: 2,
  parkingSpaces: 1,
  rentalType: "both",
  fullPropertyPrice: 25000,
  availableFrom: "2024-04-01",
  amenities: ["1", "2", "3", "4", "5"],
  rules: {
    petsAllowed: true,
    smokingAllowed: false,
    gatheringsAllowed: true
  }
};

// Days of week options
export const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" }
];

// Time slots for gatherings
export const timeSlots = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "23:00", label: "11:00 PM" }
]; 