// =============================================
// TYPES FOR ROC RENTAL PLATFORM
// =============================================

export type UserType = "tenant" | "roomie" | "hoster" | "admin";

export type UserStatus = "active" | "inactive" | "suspended" | "pending_verification";

export type KycStatus = "pending" | "in_progress" | "verified" | "rejected";

export type Occupation = "student" | "professional" | "entrepreneur";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type PropertyType = "house" | "apartment";

export type FurnishingType = "furnished" | "semi_furnished" | "unfurnished";

export interface User {
  _id: string;
  email: string;
  userType: UserType;
  status: UserStatus;
  profile?: UserProfile;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: KycStatus;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Guardian {
  name: string;
  phone: string;
  email: string;
  relationship: "father" | "mother" | "uncle" | "aunt" | "other";
  relationshipOther?: string;
  incomeRange: string;
  willMakePayments: boolean;
}

export interface UserPreferences {
  petFriendly: boolean;
  smokeFriendly: boolean;
  gatheringFriendly: boolean;
  preferredGender: "male" | "female" | "mixed" | "no_preference";
}

export interface UserProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: Gender;
  phone?: string;
  profilePhoto?: string;
  address?: Address;
  
  // Occupation-specific fields
  occupation?: Occupation;
  university?: string;
  universityEmail?: string;
  company?: string;
  workEmail?: string;
  jobTitle?: string;
  workStartDate?: Date;
  businessName?: string;
  businessDescription?: string;
  businessWebsite?: string;
  
  incomeRange?: string;
  guardian?: Guardian;
  personalityTraits?: string[];
  preferences?: UserPreferences;
  
  createdAt: Date;
  updatedAt: Date;
}

// Auth-related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// UI-related types
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  description?: string;
}

// Language support
export type Language = "en" | "es";

export interface MultilingualText {
  en: string;
  es: string;
}

// Property-related types (for future use)
export interface Property {
  _id: string;
  hosterId: string;
  name: string;
  description: string;
  propertyType: PropertyType;
  furnishingType: FurnishingType;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  totalArea: number;
  totalRooms: number;
  totalBathrooms: number;
  parkingSpaces: number;
  rentalType: "full_property" | "by_room" | "both";
  fullPropertyPrice: number;
  availableFrom: Date;
  photos: Array<{
    url: string;
    caption: string;
    isPrimary: boolean;
    order: number;
  }>;
  amenities: string[];
  rules: {
    petsAllowed: boolean;
    smokingAllowed: boolean;
    gatheringsAllowed: boolean;
  };
  status: "draft" | "pending_review" | "under_review" | "returned" | "rejected" | "approved" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  _id: string;
  propertyId: string;
  roomNumber: number;
  name: string;
  features: string;
  furnishingType: FurnishingType;
  price: number;
  availableFrom: Date;
  isAvailable: boolean;
  arrangement: "mixed" | "male_only" | "female_only";
  photos: Array<{
    url: string;
    caption: string;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
} 