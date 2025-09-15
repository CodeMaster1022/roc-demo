"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/navbar';
import { useAuth } from '@/contexts/auth-context';
import { 
  Home, 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search,
  Heart,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import Link from 'next/link';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();

  const getWelcomeMessage = () => {
    const firstName = profile?.firstName || 'User';
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                     new Date().getHours() < 18 ? 'afternoon' : 'evening';
    
    return `Good ${timeOfDay}, ${firstName}!`;
  };

  const getUserTypeDescription = () => {
    switch (user?.userType) {
      case 'hoster':
        return 'Manage your properties, review applications, and track your rental income.';
      case 'tenant':
        return 'Search for properties, manage your applications, and find your perfect home.';
      case 'roomie':
        return 'Find rooms in shared properties, connect with roommates, and apply for rentals.';
      case 'admin':
        return 'Oversee platform operations, manage users, and monitor business metrics.';
      default:
        return 'Welcome to your ROC dashboard.';
    }
  };

  const renderHosterDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">+1 from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,250</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground">2 pending applications</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderTenantDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">1 under review</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorites</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">3 new this week</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Searches</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,245</div>
          <p className="text-xs text-muted-foreground">+18% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">324</div>
          <p className="text-xs text-muted-foreground">15 pending approval</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$89,450</div>
          <p className="text-xs text-muted-foreground">+22% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">78%</div>
          <p className="text-xs text-muted-foreground">Platform average</p>
        </CardContent>
      </Card>
    </div>
  );

  const getQuickActions = () => {
    switch (user?.userType) {
      case 'hoster':
        return [
          { label: 'Add Property', href: '/properties/add', icon: Building },
          { label: 'View Applications', href: '/tenants', icon: Users },
          { label: 'Analytics', href: '/analytics', icon: BarChart3 }
        ];
      case 'tenant':
      case 'roomie':
        return [
          { label: 'Search Properties', href: '/search', icon: Search },
          { label: 'My Applications', href: '/applications', icon: FileText },
          { label: 'Favorites', href: '/favorites', icon: Heart }
        ];
      case 'admin':
        return [
          { label: 'Manage Properties', href: '/admin/properties', icon: Building },
          { label: 'User Management', href: '/admin/users', icon: Users },
          { label: 'Platform Insights', href: '/admin/analytics', icon: BarChart3 }
        ];
      default:
        return [];
    }
  };

  const renderDashboardContent = () => {
    switch (user?.userType) {
      case 'hoster':
        return renderHosterDashboard();
      case 'tenant':
      case 'roomie':
        return renderTenantDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="mt-2 text-gray-600">{getUserTypeDescription()}</p>
        </div>

        {/* Dashboard Metrics */}
        {renderDashboardContent()}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getQuickActions().map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link key={action.href} href={action.href}>
                        <Button 
                          variant="outline" 
                          className="h-20 w-full flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300"
                        >
                          <Icon className="h-6 w-6 text-purple-600" />
                          <span className="text-sm font-medium">{action.label}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Status */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Your account verification and setup progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verification</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user?.emailVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Verification</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user?.phoneVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.phoneVerified ? 'Verified' : 'Not Added'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">KYC Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user?.kycStatus === 'verified' 
                      ? 'bg-green-100 text-green-800' 
                      : user?.kycStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.kycStatus === 'verified' ? 'Verified' : 
                     user?.kycStatus === 'pending' ? 'Pending' : 'Required'}
                  </span>
                </div>

                <div className="pt-4">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 