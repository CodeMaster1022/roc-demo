"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Eye, 
  Users, 
  DollarSign,
  Star,
  Heart,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Home,
  Clock,
  Target,
  Percent
} from 'lucide-react';
import { withAuth } from '@/contexts/auth-context';
import { mockPropertyService } from '@/lib/property-mock-data';
import { toast } from 'sonner';

const PropertyAnalyticsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (propertyId) {
      loadPropertyAndAnalytics();
    }
  }, [propertyId]);

  const loadPropertyAndAnalytics = async () => {
    try {
      setLoading(true);
      const [propertyData, analyticsData] = await Promise.all([
        mockPropertyService.getPropertyById(propertyId),
        mockPropertyService.getPropertyAnalytics(propertyId)
      ]);
      
      setProperty(propertyData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load property analytics');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceIndicator = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return { color: 'text-green-600', icon: TrendingUp, status: 'excellent' };
    if (percentage >= 75) return { color: 'text-blue-600', icon: TrendingUp, status: 'good' };
    if (percentage >= 50) return { color: 'text-yellow-600', icon: Activity, status: 'average' };
    return { color: 'text-red-600', icon: TrendingDown, status: 'needs improvement' };
  };

  const calculateConversionRate = () => {
    if (!analytics || analytics.views === 0) return 0;
    return ((analytics.applications / analytics.views) * 100).toFixed(1);
  };

  const getOccupancyStatus = (rate: number) => {
    if (rate >= 90) return { color: 'bg-green-100 text-green-800', label: 'Excellent' };
    if (rate >= 75) return { color: 'bg-blue-100 text-blue-800', label: 'Good' };
    if (rate >= 50) return { color: 'bg-yellow-100 text-yellow-800', label: 'Average' };
    return { color: 'bg-red-100 text-red-800', label: 'Low' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!property || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Not Available</h3>
              <p className="text-gray-600 mb-6">Unable to load analytics data for this property.</p>
              <Button onClick={() => router.push('/properties')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Properties
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const conversionRate = calculateConversionRate();
  const occupancyStatus = getOccupancyStatus(analytics.occupancyRate);
  const viewsIndicator = getPerformanceIndicator(analytics.views, 1000);
  const applicationsIndicator = getPerformanceIndicator(analytics.applications, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/properties')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Analytics</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <span className="font-medium">{property.name}</span>
                <span className="mx-2">•</span>
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location.city}</span>
              </div>
            </div>
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{analytics.views.toLocaleString()}</div>
                <div className="flex items-center">
                  <viewsIndicator.icon className={`h-4 w-4 ${viewsIndicator.color}`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {viewsIndicator.status}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{analytics.applications}</div>
                <div className="flex items-center">
                  <applicationsIndicator.icon className={`h-4 w-4 ${applicationsIndicator.color}`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                MXN this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{analytics.occupancyRate}%</div>
                <Badge className={occupancyStatus.color}>
                  {occupancyStatus.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Current occupancy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Views Trend
              </CardTitle>
              <CardDescription>Daily views over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.viewsHistory?.map((day: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(day.views / 80) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium w-8 text-right">{day.views}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Application Status
              </CardTitle>
              <CardDescription>Breakdown of application statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.applicationHistory && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Approved</span>
                      </div>
                      <span className="text-sm font-medium">
                        {analytics.applicationHistory.filter((app: any) => app.status === 'approved').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="text-sm font-medium">
                        {analytics.applicationHistory.filter((app: any) => app.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Rejected</span>
                      </div>
                      <span className="text-sm font-medium">
                        {analytics.applicationHistory.filter((app: any) => app.status === 'rejected').length}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Favorites</span>
                <span className="font-semibold">{analytics.favorites}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bookings</span>
                <span className="font-semibold">{analytics.bookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="font-semibold">{analytics.responseRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Stay</span>
                <span className="font-semibold">{analytics.averageStay} months</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Rating & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.rating || 0}
                </div>
                <div className="flex justify-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(analytics.rating || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on tenant reviews
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Monthly Views Goal</span>
                  <span>{analytics.views}/1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((analytics.views / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Application Goal</span>
                  <span>{analytics.applications}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((analytics.applications / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Occupancy Goal</span>
                  <span>{analytics.occupancyRate}%/90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((analytics.occupancyRate / 90) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        {analytics.applicationHistory && analytics.applicationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Applications
              </CardTitle>
              <CardDescription>Latest applications for this property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.applicationHistory.slice(0, 5).map((app: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{app.applicantName}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(app.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className={
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/properties/${propertyId}/applications`)}
                >
                  View All Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights and Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Insights & Recommendations
            </CardTitle>
            <CardDescription>AI-powered suggestions to improve your property performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Performance Insights</h4>
                
                {analytics.views < 500 && (
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Low Visibility</p>
                      <p className="text-sm text-yellow-700">
                        Your property has fewer views than average. Consider updating photos or description.
                      </p>
                    </div>
                  </div>
                )}
                
                {parseFloat(conversionRate.toString()) < 2 && analytics.views > 100 && (
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Low Conversion Rate</p>
                      <p className="text-sm text-blue-700">
                        Your conversion rate is {conversionRate}%. Consider adjusting pricing or improving amenities.
                      </p>
                    </div>
                  </div>
                )}
                
                {analytics.occupancyRate >= 90 && (
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Star className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Excellent Occupancy</p>
                      <p className="text-sm text-green-700">
                        Your property maintains excellent occupancy rates. Consider raising prices slightly.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Recommended Actions</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Update property photos monthly</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Respond to inquiries within 2 hours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Keep property description up-to-date</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Monitor competitor pricing weekly</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default withAuth(PropertyAnalyticsPage, { 
  allowedUserTypes: ['hoster'] 
}); 