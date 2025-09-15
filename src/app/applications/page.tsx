"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Plus
} from 'lucide-react';
import { useAuth, withAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

const ApplicationsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock applications data
  const mockApplications = [
    {
      id: 'app_001',
      propertyId: 'prop_001',
      propertyName: 'Modern Downtown Apartment',
      roomName: 'Master Bedroom',
      monthlyRent: 12000,
      applicationDate: '2024-02-01',
      status: 'pending',
      lastUpdated: '2024-02-01',
      applicantName: `${user?.profile?.firstName} ${user?.profile?.lastName}` || 'John Doe',
      location: 'Av. Insurgentes Sur 1234, Mexico City',
      notes: 'Application under review by property owner.'
    },
    {
      id: 'app_002',
      propertyId: 'prop_006',
      propertyName: 'Coliving Space Condesa',
      roomName: 'Standard Room A',
      monthlyRent: 6000,
      applicationDate: '2024-01-25',
      status: 'approved',
      lastUpdated: '2024-01-28',
      applicantName: `${user?.profile?.firstName} ${user?.profile?.lastName}` || 'John Doe',
      location: 'Calle Amsterdam 789, Mexico City',
      notes: 'Congratulations! Your application has been approved. Please review the lease agreement.'
    },
    {
      id: 'app_003',
      propertyId: 'prop_002',
      propertyName: 'Cozy Student House Near UNAM',
      roomName: 'Room B',
      monthlyRent: 4500,
      applicationDate: '2024-01-20',
      status: 'rejected',
      lastUpdated: '2024-01-22',
      applicantName: `${user?.profile?.firstName} ${user?.profile?.lastName}` || 'John Doe',
      location: 'Calle Universidad 567, Mexico City',
      notes: 'Unfortunately, another applicant was selected. Thank you for your interest.'
    }
  ];

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check for success message from URL params
      const status = searchParams.get('status');
      if (status === 'submitted') {
        toast.success('Application submitted successfully!');
      }
      
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.roomName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'under_review':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleViewApplication = (applicationId: string) => {
    router.push(`/applications/${applicationId}`);
  };

  const handleContactHoster = (propertyId: string) => {
    // In a real app, this would open a messaging interface
    toast.info('Messaging feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
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
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-1">
              Track your rental applications and their status
            </p>
          </div>
          <Button onClick={() => router.push('/search')}>
            <Plus className="w-4 h-4 mr-2" />
            Apply for More Properties
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by property name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {applications.length === 0 ? 'No Applications Yet' : 'No Applications Found'}
              </h3>
              <p className="text-gray-600 mb-8">
                {applications.length === 0 
                  ? "You haven't submitted any rental applications yet. Start by searching for properties!"
                  : "No applications match your current filters. Try adjusting your search criteria."
                }
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => router.push('/search')}>
                  <Home className="w-4 h-4 mr-2" />
                  Browse Properties
                </Button>
                {applications.length > 0 && (
                  <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg line-clamp-2">{application.propertyName}</CardTitle>
                      {application.roomName && (
                        <p className="text-sm text-gray-600 mt-1">{application.roomName}</p>
                      )}
                    </div>
                    <Badge className={`${getStatusColor(application.status)} flex items-center`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Location */}
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">{application.location}</p>
                  </div>

                  {/* Rent */}
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      ${application.monthlyRent.toLocaleString()}/month
                    </span>
                  </div>

                  {/* Application Date */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Applied on {new Date(application.applicationDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Notes */}
                  {application.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{application.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewApplication(application.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactHoster(application.propertyId)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Special Actions for Approved */}
                  {application.status === 'approved' && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Review Lease Agreement
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {applications.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {applications.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {applications.filter(app => app.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default withAuth(ApplicationsPage, { 
  allowedUserTypes: ['tenant', 'roomie'] 
}); 