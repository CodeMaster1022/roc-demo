// =============================================
// MOCK DATA FOR ROC RENTAL PLATFORM
// =============================================

import { User, UserProfile, UserType } from "./types";

// Mock users for testing
export const mockUsers: User[] = [
  {
    _id: "1",
    email: "maria.garcia@email.com",
    userType: "hoster",
    status: "active",
    emailVerified: true,
    phoneVerified: true,
    kycStatus: "verified",
    lastLogin: new Date("2024-03-15T10:30:00Z"),
    createdAt: new Date("2024-01-15T00:00:00Z"),
    updatedAt: new Date("2024-03-15T10:30:00Z")
  },
  {
    _id: "2",
    email: "juan.rodriguez@email.com",
    userType: "tenant",
    status: "active",
    emailVerified: true,
    phoneVerified: true,
    kycStatus: "verified",
    lastLogin: new Date("2024-03-15T14:20:00Z"),
    createdAt: new Date("2024-02-01T00:00:00Z"),
    updatedAt: new Date("2024-03-15T14:20:00Z")
  },
  {
    _id: "3",
    email: "ana.lopez@student.unam.mx",
    userType: "roomie",
    status: "active",
    emailVerified: true,
    phoneVerified: true,
    kycStatus: "verified",
    lastLogin: new Date("2024-03-15T16:45:00Z"),
    createdAt: new Date("2024-02-10T00:00:00Z"),
    updatedAt: new Date("2024-03-15T16:45:00Z")
  },
  {
    _id: "4",
    email: "admin@roc.com",
    userType: "admin",
    status: "active",
    emailVerified: true,
    phoneVerified: false,
    kycStatus: "verified",
    lastLogin: new Date("2024-03-15T09:00:00Z"),
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-03-15T09:00:00Z")
  }
];

// Mock user profiles
export const mockUserProfiles: UserProfile[] = [
  {
    _id: "profile_1",
    userId: "1",
    firstName: "María",
    lastName: "García",
    dateOfBirth: new Date("1985-05-15"),
    gender: "female",
    phone: "+52 55 1234 5678",
    profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b9a1f3b0?w=150&h=150&fit=crop&crop=face",
    address: {
      street: "Av. Reforma 123",
      city: "Mexico City",
      state: "CDMX",
      zipCode: "06600",
      country: "Mexico",
      coordinates: {
        latitude: 19.4326,
        longitude: -99.1332
      }
    },
    createdAt: new Date("2024-01-15T00:00:00Z"),
    updatedAt: new Date("2024-03-10T00:00:00Z")
  },
  {
    _id: "profile_2",
    userId: "2",
    firstName: "Juan",
    lastName: "Rodríguez",
    dateOfBirth: new Date("1990-08-22"),
    gender: "male",
    phone: "+52 55 2345 6789",
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    address: {
      street: "Calle Insurgentes 456",
      city: "Mexico City",
      state: "CDMX",
      zipCode: "03100",
      country: "Mexico",
      coordinates: {
        latitude: 19.3910,
        longitude: -99.1620
      }
    },
    occupation: "professional",
    company: "Tech Solutions SA",
    workEmail: "juan.rodriguez@techsolutions.com",
    jobTitle: "Software Engineer",
    workStartDate: new Date("2020-03-01"),
    incomeRange: "50000-75000",
    preferences: {
      petFriendly: true,
      smokeFriendly: false,
      gatheringFriendly: true,
      preferredGender: "no_preference"
    },
    createdAt: new Date("2024-02-01T00:00:00Z"),
    updatedAt: new Date("2024-03-10T00:00:00Z")
  },
  {
    _id: "profile_3",
    userId: "3",
    firstName: "Ana",
    lastName: "López",
    dateOfBirth: new Date("2002-11-03"),
    gender: "female",
    phone: "+52 55 3456 7890",
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    occupation: "student",
    university: "Universidad Nacional Autónoma de México",
    universityEmail: "ana.lopez@student.unam.mx",
    incomeRange: "0-10000",
    guardian: {
      name: "Carlos López",
      phone: "+52 55 4567 8901",
      email: "carlos.lopez@email.com",
      relationship: "father",
      incomeRange: "75000-100000",
      willMakePayments: true
    },
    personalityTraits: ["social", "clean", "student"],
    preferences: {
      petFriendly: false,
      smokeFriendly: false,
      gatheringFriendly: true,
      preferredGender: "female"
    },
    createdAt: new Date("2024-02-10T00:00:00Z"),
    updatedAt: new Date("2024-03-10T00:00:00Z")
  },
  {
    _id: "profile_4",
    userId: "4",
    firstName: "Admin",
    lastName: "User",
    dateOfBirth: new Date("1980-01-01"),
    gender: "other",
    phone: "+52 55 0000 0000",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z")
  }
];

// Mock authentication functions
export const mockAuthService = {
  async login(email: string, password: string): Promise<{ user: User; profile: UserProfile }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    // In a real app, you'd verify the password hash
    if (password.length < 6) {
      throw new Error("Invalid credentials");
    }
    
    // Find user profile
    const profile = mockUserProfiles.find(p => p.userId === user._id);
    if (!profile) {
      throw new Error("User profile not found");
    }
    
    return { user, profile };
  },

  async register(data: {
    email: string;
    password: string;
    userType: UserType;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ user: User; profile: UserProfile }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    
    // Create new user
    const newUser: User = {
      _id: `user_${Date.now()}`,
      email: data.email,
      userType: data.userType,
      status: "pending_verification",
      emailVerified: false,
      phoneVerified: false,
      kycStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create new profile
    const newProfile: UserProfile = {
      _id: `profile_${Date.now()}`,
      userId: newUser._id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mock data (in memory only)
    mockUsers.push(newUser);
    mockUserProfiles.push(newProfile);
    
    return { user: newUser, profile: newProfile };
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const profileIndex = mockUserProfiles.findIndex(p => p.userId === userId);
    if (profileIndex === -1) {
      throw new Error("Profile not found");
    }
    
    // Update profile
    mockUserProfiles[profileIndex] = {
      ...mockUserProfiles[profileIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return mockUserProfiles[profileIndex];
  }
};

// User type options for forms
export const userTypeOptions = [
  {
    value: "tenant",
    label: "Tenant",
    description: "I want to rent entire properties"
  },
  {
    value: "roomie",
    label: "Roomie", 
    description: "I want to rent rooms in shared properties"
  },
  {
    value: "hoster",
    label: "Hoster",
    description: "I want to list my properties for rent"
  }
];

// Income range options
export const incomeRangeOptions = [
  { value: "0-10000", label: "$0 - $10,000 MXN" },
  { value: "10000-25000", label: "$10,000 - $25,000 MXN" },
  { value: "25000-50000", label: "$25,000 - $50,000 MXN" },
  { value: "50000-75000", label: "$50,000 - $75,000 MXN" },
  { value: "75000-100000", label: "$75,000 - $100,000 MXN" },
  { value: "100000+", label: "$100,000+ MXN" }
];

// Occupation options
export const occupationOptions = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Professional" },
  { value: "entrepreneur", label: "Entrepreneur" }
];

// Gender options
export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" }
];

// Guardian relationship options
export const relationshipOptions = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "uncle", label: "Uncle" },
  { value: "aunt", label: "Aunt" },
  { value: "other", label: "Other" }
]; 