"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/contexts/auth-context';
import Navbar from '@/components/layout/navbar';
import PropertyApprovalWorkflow from '@/components/admin/property-approval-workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Home,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Settings,
  BarChart3,
  Activity,
  Shield,
  Flag,
  MessageSquare,
  Calendar,
  Download,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Bell,
  Star,
  Zap
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'properties' | 'users' | 'analytics' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Mock dashboard data
  const mockDashboardData = {
    stats: {
      totalProperties: 1247,
      activeProperties: 892,
      pendingApprovals: 43,
      totalUsers: 5832,
      activeHosts: 1456,
      totalRevenue: 2847593,
      monthlyGrowth: 12.5,
      avgApprovalTime: 2.3
    },
    recentActivity: [
      {
        id: 'activity_1',
        type: 'property_approved',
        message: 'Property "Modern Downtown Loft" approved',
        timestamp: '2024-05-10T14:30:00Z',
        user: 'Admin User',
        priority: 'normal'
      },
      {
        id: 'activity_2',
        type: 'user_flagged',
        message: 'User account flagged for suspicious activity',
        timestamp: '2024-05-10T13:15:00Z',
        user: 'Security System',
        priority: 'high'
      },
      {
        id: 'activity_3',
        type: 'property_rejected',
        message: 'Property submission rejected - missing documents',
        timestamp: '2024-05-10T11:45:00Z',
        user: 'Review Admin',
        priority: 'normal'
      }
    ],
    alerts: [
      {
        id: 'alert_1',
        type: 'critical',
        message: '15 properties require immediate attention',
        count: 15,
        action: 'Review Now'
      },
      {
        id: 'alert_2',
        type: 'warning',
        message: 'System maintenance scheduled for tonight',
        count: 1,
        action: 'View Details'
      },
      {
        id: 'alert_3',
        type: 'info',
        message: 'New feature deployment completed',
        count: 3,
        action: 'Learn More'
      }
    ],
    quickActions: [
      {
        id: 'action_1',
        title: 'Review Properties',
        description: 'Review pending property submissions',
        icon: Home,
        color: 'bg-blue-600',
        count: 43
      },
      {
        id: 'action_2',
        title: 'User Management',
        description: 'Manage user accounts and permissions',
        icon: Users,
        color: 'bg-green-600',
        count: 12
      },
      {
        id: 'action_3',
        title: 'System Reports',
        description: 'Generate and download reports',
        icon: BarChart3,
        color: 'bg-purple-600',
        count: 5
      },
      {
        id: 'action_4',
        title: 'Content Moderation',
        description: 'Review flagged content and reports',
        icon: Flag,
        color: 'bg-orange-600',
        count: 8
      }
    ],
    performanceMetrics: {
      approvalRate: 87.3,
      avgResponseTime: 2.1,
      userSatisfaction: 4.6,
      systemUptime: 99.9,
      monthlyActiveUsers: 4521,
      conversionRate: 23.4
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockDashboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalProperties.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{dashboardData.stats.monthlyGrowth}% this month
                </p>
              </div>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {dashboardData.stats.activeHosts} active hosts
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">
                  {dashboardData.stats.pendingApprovals}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Avg: {dashboardData.stats.avgApprovalTime} days
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(dashboardData.stats.totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +{dashboardData.stats.monthlyGrowth}% growth
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.alerts.map((alert: any) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                      {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        {alert.count > 1 && (
                          <p className="text-sm text-gray-600">{alert.count} items</p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {alert.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.quickActions.map((action: any) => {
              const IconComponent = action.icon;
              return (
                <Card key={action.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs text-gray-600">{action.description}</p>
                        {action.count > 0 && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {action.count} pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Approval Rate</span>
                <span className="text-lg font-bold text-green-600">
                  {dashboardData.performanceMetrics.approvalRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Response Time</span>
                <span className="text-lg font-bold text-blue-600">
                  {dashboardData.performanceMetrics.avgResponseTime} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">User Satisfaction</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-bold text-yellow-600">
                    {dashboardData.performanceMetrics.userSatisfaction}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">System Uptime</span>
                <span className="text-lg font-bold text-green-600">
                  {dashboardData.performanceMetrics.systemUptime}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.priority === 'high' ? 'bg-red-500' :
                    activity.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()} • {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.profile?.firstName}! Here's what's happening with ROC today.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={loadDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex space-x-1">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'properties', label: 'Property Approvals', icon: Home },
                { key: 'users', label: 'User Management', icon: Users },
                { key: 'analytics', label: 'Analytics', icon: TrendingUp },
                { key: 'settings', label: 'Settings', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={currentView === key ? 'default' : 'ghost'}
                  onClick={() => setCurrentView(key as any)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {key === 'properties' && dashboardData?.stats.pendingApprovals > 0 && (
                    <Badge className="ml-1 bg-red-600 text-xs">
                      {dashboardData.stats.pendingApprovals}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {currentView === 'overview' && dashboardData && renderOverview()}
        {currentView === 'properties' && <PropertyApprovalWorkflow />}
        {currentView === 'users' && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 mb-4">User management features coming soon!</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </CardContent>
          </Card>
        )}
        {currentView === 'analytics' && (
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">Detailed analytics and reporting features coming soon!</p>
              <Button>
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        )}
        {currentView === 'settings' && (
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-600 mb-4">System configuration and settings coming soon!</p>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Configure System
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default withAuth(AdminDashboardPage, { 
  allowedUserTypes: ['admin'] 
}); 