"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  Home, 
  Building, 
  Users, 
  Search,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, profile, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const getInitials = () => {
    if (!profile) return 'U';
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: Home }
    ];

    switch (user.userType) {
      case 'hoster':
        return [
          ...baseItems,
          { href: '/properties', label: 'My Properties', icon: Building },
          { href: '/tenants', label: 'Tenants', icon: Users },
          { href: '/analytics', label: 'Analytics', icon: BarChart3 }
        ];
      case 'tenant':
      case 'roomie':
        return [
          ...baseItems,
          { href: '/search', label: 'Search', icon: Search },
          { href: '/roommates', label: 'Find Roommates', icon: Users },
          { href: '/favorites', label: 'Favorites', icon: User },
          { href: '/applications', label: 'My Applications', icon: Building }
        ];
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Admin Dashboard', icon: Home },
          { href: '/admin/properties', label: 'Properties', icon: Building },
          { href: '/admin/users', label: 'Users', icon: Users },
          { href: '/admin/analytics', label: 'Insights', icon: BarChart3 }
        ];
      default:
        return baseItems;
    }
  };

  const getUserTypeLabel = () => {
    if (!user) return '';
    switch (user.userType) {
      case 'hoster': return 'Hoster';
      case 'tenant': return 'Tenant';
      case 'roomie': return 'Roomie';
      case 'admin': return 'Admin';
      default: return '';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                <h1 className="text-2xl font-bold">ROC</h1>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.profilePhoto} alt={profile?.firstName} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.firstName} {profile?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {getUserTypeLabel()}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Mobile Navigation */}
                <div className="md:hidden">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 