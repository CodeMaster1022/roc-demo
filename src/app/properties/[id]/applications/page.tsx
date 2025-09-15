"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Download,
  Eye,
  Filter,
  Search,
  MessageSquare,
  User,
  Home,
  MapPin
} from 'lucide-react';
import { withAuth } from '@/contexts/auth-context';
import { mockPropertyService, mockApplications } from '@/lib/property-mock-data';
import { toast } from 'sonner';

const PropertyApplicationsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  useEffect(() => {
    if (propertyId) {
      loadPropertyAndApplications();
    }
  }, [propertyId]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const loadPropertyAndApplications = async () => {
    try {
      setLoading(true);
      const [propertyData, applicationsData] = await Promise.all([
        mockPropertyService.getPropertyById(propertyId),
        mockPropertyService.getApplicationsByProperty(propertyId)
      ]);
      
      setProperty(propertyData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load property applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Sort by application date (newest first)
    filtered.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      case 'under_review': return Eye;
      default: return Clock;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await mockPropertyService.updateApplicationStatus(applicationId, newStatus);
      toast.success(`Application ${newStatus} successfully`);
      loadPropertyAndApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const getApplicationStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
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
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h3>
              <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
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

  const stats = getApplicationStats();

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
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location.address}, {property.location.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Accepted applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Declined applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {applications.length === 0 ? 'No Applications Yet' : 'No Applications Found'}
                </h3>
                <p className="text-gray-600">
                  {applications.length === 0 
                    ? 'Applications will appear here when tenants apply for your property.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => {
              const StatusIcon = getStatusIcon(application.status);
              
              return (
                <Card key={application._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Applicant Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.applicantName}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {application.applicantEmail}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {application.applicantPhone}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className={`text-lg font-bold ${getScoreColor(application.score)}`}>
                                {application.score}
                              </div>
                              <div className="text-xs text-gray-500">Score</div>
                            </div>
                            <Badge className={`${getStatusColor(application.status)} border`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {application.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Application Details */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-600">Applied</div>
                            <div className="font-medium">
                              {new Date(application.applicationDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Move-in Date</div>
                            <div className="font-medium">
                              {new Date(application.moveInDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Contract Length</div>
                            <div className="font-medium">{application.contractLength} months</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Budget</div>
                            <div className="font-medium">${application.monthlyBudget.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Message */}
                        {application.message && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-start">
                              <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{application.message}</p>
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-900 mb-2">Documents</div>
                          <div className="flex flex-wrap gap-2">
                            {application.documents.map((doc: any, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className={doc.verified ? 'border-green-200 text-green-800' : 'border-yellow-200 text-yellow-800'}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                {doc.type}
                                {doc.verified && <CheckCircle className="w-3 h-3 ml-1" />}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Room Info (if applicable) */}
                        {application.roomId && (
                          <div className="text-sm text-gray-600 mb-4">
                            <span className="font-medium">Room:</span> Specific room application
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="lg:w-48 flex lg:flex-col gap-2">
                        {application.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleStatusChange(application._id, 'approved')}
                              className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(application._id, 'rejected')}
                              variant="outline"
                              className="flex-1 lg:flex-none border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 lg:flex-none"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                              <DialogDescription>
                                Complete application information for {application.applicantName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Name</label>
                                  <p className="text-sm text-gray-900">{application.applicantName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Email</label>
                                  <p className="text-sm text-gray-900">{application.applicantEmail}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Phone</label>
                                  <p className="text-sm text-gray-900">{application.applicantPhone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Score</label>
                                  <p className={`text-sm font-semibold ${getScoreColor(application.score)}`}>
                                    {application.score}/100
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-gray-700">Message</label>
                                <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                                  {application.message}
                                </p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-gray-700">Documents</label>
                                <div className="mt-2 space-y-2">
                                  {application.documents.map((doc: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                      <div className="flex items-center">
                                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm capitalize">{doc.type}</span>
                                        {doc.verified && (
                                          <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                        )}
                                      </div>
                                      <Button variant="ghost" size="sm">
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default withAuth(PropertyApplicationsPage, { 
  allowedUserTypes: ['hoster'] 
}); 