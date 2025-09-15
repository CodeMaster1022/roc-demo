"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterData, User, UserProfile } from '@/lib/types';
import { mockAuthService } from '@/lib/mock-data';

// Auth actions
type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; profile: UserProfile } }
  | { type: 'UPDATE_PROFILE'; payload: UserProfile }
  | { type: 'LOGOUT' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true,
        isLoading: false
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: action.payload,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedUser = localStorage.getItem('roc_user');
        const storedProfile = localStorage.getItem('roc_profile');
        
        if (storedUser && storedProfile) {
          const user = JSON.parse(storedUser);
          const profile = JSON.parse(storedProfile);
          
          // Convert date strings back to Date objects
          user.createdAt = new Date(user.createdAt);
          user.updatedAt = new Date(user.updatedAt);
          if (user.lastLogin) user.lastLogin = new Date(user.lastLogin);
          
          profile.createdAt = new Date(profile.createdAt);
          profile.updatedAt = new Date(profile.updatedAt);
          if (profile.dateOfBirth) profile.dateOfBirth = new Date(profile.dateOfBirth);
          if (profile.workStartDate) profile.workStartDate = new Date(profile.workStartDate);
          
          dispatch({ type: 'SET_USER', payload: { user, profile } });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkExistingSession();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { user, profile } = await mockAuthService.login(credentials.email, credentials.password);
      
      // Store in localStorage
      localStorage.setItem('roc_user', JSON.stringify(user));
      localStorage.setItem('roc_profile', JSON.stringify(profile));
      
      dispatch({ type: 'SET_USER', payload: { user, profile } });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { user, profile } = await mockAuthService.register(data);
      
      // Store in localStorage
      localStorage.setItem('roc_user', JSON.stringify(user));
      localStorage.setItem('roc_profile', JSON.stringify(profile));
      
      dispatch({ type: 'SET_USER', payload: { user, profile } });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('roc_user');
    localStorage.removeItem('roc_profile');
    dispatch({ type: 'LOGOUT' });
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const updatedProfile = await mockAuthService.updateProfile(state.user._id, updates);
      
      // Update localStorage
      localStorage.setItem('roc_profile', JSON.stringify(updatedProfile));
      
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedProfile });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
interface WithAuthProps {
  allowedUserTypes?: string[];
  redirectTo?: string;
}

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) => {
  const { allowedUserTypes, redirectTo = '/auth/login' } = options;

  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = redirectTo;
      }

      if (!isLoading && isAuthenticated && user && allowedUserTypes) {
        if (!allowedUserTypes.includes(user.userType)) {
          window.location.href = '/unauthorized';
        }
      }
    }, [isAuthenticated, user, isLoading]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (allowedUserTypes && user && !allowedUserTypes.includes(user.userType)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}; 