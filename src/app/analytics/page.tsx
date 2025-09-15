"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/contexts/auth-context';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Users,
  Calendar,
  Eye,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Zap,
  RefreshCw,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    totalProperties: number;
    occupancyRate: number;
    averageRent: number;
    totalTenants: number;
    averageRating: number;
  };
  revenue: {
    monthly: { month: string; amount: number; growth: number }[];
    byProperty: { propertyName: string; revenue: number; percentage: number }[];
    projectedRevenue: number;
  };
  occupancy: {
    current: number;
    trend: { month: string; rate: number }[];
    byProperty: { propertyName: string; occupied: number; total: number }[];
  };
  performance: {
    views: { total: number; thisMonth: number; growth: number };
    inquiries: { total: number; thisMonth: number; conversionRate: number };
    applications: { total: number; thisMonth: number; approvalRate: number };
    bookings: { total: number; thisMonth: number; completionRate: number };
  };
  properties: {
    id: string;
    name: string;
    type: string;
    location: string;
    monthlyRevenue: number;
    occupancyRate: number;
    averageRating: number;
    totalViews: number;
    totalInquiries: number;
    status: 'excellent' | 'good' | 'needs_attention';
    insights: string[];
  }[];
  insights: {
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    description: string;
    action?: string;
  }[];
  goals: {
    revenue: { target: number; current: number; progress: number };
    occupancy: { target: number; current: number; progress: number };
    rating: { target: number; current: number; progress: number };
  };
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData = {
    overview: {
      totalRevenue: 1250000,
      monthlyRevenue: 87500,
      revenueGrowth: 12.5,
      totalProperties: 5,
      occupancyRate: 87.5,
      averageRent: 17500,
      totalTenants: 12,
      averageRating: 4.6
    },
    revenue: {
      monthly: [
        { month: 'Oct 2023', amount: 75000, growth: 8.2 },
        { month: 'Nov 2023', amount: 78000, growth: 4.0 },
        { month: 'Dec 2023', amount: 82000, growth: 5.1 },
        { month: 'Jan 2024', amount: 80000, growth: -2.4 },
        { month: 'Feb 2024', amount: 85000, growth: 6.3 },
        { month: 'Mar 2024', amount: 87500, growth: 2.9 }
      ],
      byProperty: [
        { propertyName: 'Modern Downtown Apartment', revenue: 36000, percentage: 41.1 },
        { propertyName: 'Luxury Condo Polanco', revenue: 25000, percentage: 28.6 },
        { propertyName: 'Student House Near UNAM', revenue: 13500, percentage: 15.4 },
        { propertyName: 'Shared House Roma Norte', revenue: 9000, percentage: 10.3 },
        { propertyName: 'Executive Apartment Santa Fe', revenue: 4000, percentage: 4.6 }
      ],
      projectedRevenue: 105000
    },
    occupancy: {
      current: 87.5,
      trend: [
        { month: 'Oct', rate: 85.0 },
        { month: 'Nov', rate: 87.5 },
        { month: 'Dec', rate: 92.5 },
        { month: 'Jan', rate: 85.0 },
        { month: 'Feb', rate: 87.5 },
        { month: 'Mar', rate: 87.5 }
      ],
      byProperty: [
        { propertyName: 'Modern Downtown Apartment', occupied: 3, total: 3 },
        { propertyName: 'Luxury Condo Polanco', occupied: 1, total: 1 },
        { propertyName: 'Student House Near UNAM', occupied: 3, total: 4 },
        { propertyName: 'Shared House Roma Norte', occupied: 2, total: 3 },
        { propertyName: 'Executive Apartment Santa Fe', occupied: 1, total: 1 }
      ]
    },
    performance: {
      views: { total: 15420, thisMonth: 2340, growth: 18.5 },
      inquiries: { total: 1250, thisMonth: 190, conversionRate: 8.1 },
      applications: { total: 340, thisMonth: 52, approvalRate: 73.1 },
      bookings: { total: 87, thisMonth: 14, completionRate: 89.7 }
    },
    properties: [
      {
        id: 'prop_001',
        name: 'Modern Downtown Apartment',
        type: 'Apartment',
        location: 'Downtown, Mexico City',
        monthlyRevenue: 36000,
        occupancyRate: 100,
        averageRating: 4.8,
        totalViews: 5420,
        totalInquiries: 340,
        status: 'excellent',
        insights: ['Highest revenue generator', 'Perfect occupancy rate', 'Excellent tenant ratings']
      },
      {
        id: 'prop_002',
        name: 'Luxury Condo Polanco',
        type: 'Condo',
        location: 'Polanco, Mexico City',
        monthlyRevenue: 25000,
        occupancyRate: 100,
        averageRating: 4.9,
        totalViews: 3200,
        totalInquiries: 180,
        status: 'excellent',
        insights: ['Premium location', 'High-end amenities', 'Consistent bookings']
      },
      {
        id: 'prop_003',
        name: 'Student House Near UNAM',
        type: 'House',
        location: 'University Area, Mexico City',
        monthlyRevenue: 13500,
        occupancyRate: 75,
        averageRating: 4.2,
        totalViews: 2800,
        totalInquiries: 220,
        status: 'good',
        insights: ['Popular with students', 'Seasonal demand', 'One room available']
      },
      {
        id: 'prop_004',
        name: 'Shared House Roma Norte',
        type: 'House',
        location: 'Roma Norte, Mexico City',
        monthlyRevenue: 9000,
        occupancyRate: 67,
        averageRating: 4.5,
        totalViews: 2100,
        totalInquiries: 150,
        status: 'needs_attention',
        insights: ['Below target occupancy', 'Great location potential', 'Consider pricing adjustment']
      },
      {
        id: 'prop_005',
        name: 'Executive Apartment Santa Fe',
        type: 'Apartment',
        location: 'Santa Fe, Mexico City',
        monthlyRevenue: 4000,
        occupancyRate: 100,
        averageRating: 4.3,
        totalViews: 1900,
        totalInquiries: 90,
        status: 'good',
        insights: ['Business district location', 'Corporate clientele', 'Stable occupancy']
      }
    ],
    insights: [
      {
        type: 'success',
        title: 'Revenue Growth',
        description: 'Your monthly revenue has increased by 12.5% compared to last quarter.',
        action: 'View detailed breakdown'
      },
      {
        type: 'warning',
        title: 'Occupancy Alert',
        description: 'Roma Norte property has been below 70% occupancy for 2 months.',
        action: 'Review pricing strategy'
      },
      {
        type: 'info',
        title: 'Market Opportunity',
        description: 'Student housing demand is increasing by 15% in your area.',
        action: 'Explore expansion'
      },
      {
        type: 'success',
        title: 'Tenant Satisfaction',
        description: 'Your average rating improved to 4.6/5 this month.',
        action: 'View reviews'
      }
    ],
    goals: {
      revenue: { target: 100000, current: 87500, progress: 87.5 },
      occupancy: { target: 90, current: 87.5, progress: 97.2 },
      rating: { target: 4.5, current: 4.6, progress: 102.2 }
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your property performance and business insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadAnalyticsData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analyticsData.overview.totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 ml-1">
                      +{analyticsData.overview.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analyticsData.overview.monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Avg: ${analyticsData.overview.averageRent.toLocaleString()}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.overview.occupancyRate}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {analyticsData.overview.totalTenants} active tenants
                  </p>
                </div>
                <Home className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.overview.averageRating}/5.0
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 ml-1">Excellent</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Monthly Revenue Goal</span>
                  <span className="text-sm text-gray-600">
                    ${analyticsData.goals.revenue.current.toLocaleString()} / ${analyticsData.goals.revenue.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(analyticsData.goals.revenue.progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">{analyticsData.goals.revenue.progress.toFixed(1)}% complete</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Occupancy Goal</span>
                  <span className="text-sm text-gray-600">
                    {analyticsData.goals.occupancy.current}% / {analyticsData.goals.occupancy.target}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(analyticsData.goals.occupancy.progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">{analyticsData.goals.occupancy.progress.toFixed(1)}% complete</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Rating Goal</span>
                  <span className="text-sm text-gray-600">
                    {analyticsData.goals.rating.current}/5.0 / {analyticsData.goals.rating.target}/5.0
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(analyticsData.goals.rating.progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">{analyticsData.goals.rating.progress.toFixed(1)}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <Badge variant="outline" className="text-green-600">
                  +{analyticsData.performance.views.growth}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.performance.views.total.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-xs text-gray-500 mt-1">
                {analyticsData.performance.views.thisMonth.toLocaleString()} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <Badge variant="outline" className="text-blue-600">
                  {analyticsData.performance.inquiries.conversionRate}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.performance.inquiries.total.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Inquiries</p>
              <p className="text-xs text-gray-500 mt-1">
                {analyticsData.performance.inquiries.thisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <Badge variant="outline" className="text-green-600">
                  {analyticsData.performance.applications.approvalRate}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.performance.applications.total}
              </p>
              <p className="text-sm text-gray-600">Applications</p>
              <p className="text-xs text-gray-500 mt-1">
                {analyticsData.performance.applications.thisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Badge variant="outline" className="text-green-600">
                  {analyticsData.performance.bookings.completionRate}%
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.performance.bookings.total}
              </p>
              <p className="text-sm text-gray-600">Bookings</p>
              <p className="text-xs text-gray-500 mt-1">
                {analyticsData.performance.bookings.thisMonth} this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Occupancy Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.revenue.monthly.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">${item.amount.toLocaleString()}</span>
                      <Badge variant="outline" className={item.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.growth >= 0 ? '+' : ''}{item.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Projected Next Month</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${analyticsData.revenue.projectedRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Revenue by Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.revenue.byProperty.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium truncate">{item.propertyName}</span>
                      <span className="text-sm">${item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">{item.percentage}% of total revenue</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Property Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{property.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{property.type}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.location}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(property.status)}>
                      {property.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="font-semibold text-green-600">
                        ${property.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Occupancy Rate</p>
                      <p className="font-semibold">{property.occupancyRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold ml-1">{property.averageRating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Performance</p>
                      <p className="text-sm">
                        {property.totalViews.toLocaleString()} views • {property.totalInquiries} inquiries
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {property.insights.map((insight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {insight}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.insights.map((insight, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                      {insight.action && (
                        <Button variant="outline" size="sm" className="mt-2">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default withAuth(AnalyticsPage, { 
  allowedUserTypes: ['hoster'] 
}); 