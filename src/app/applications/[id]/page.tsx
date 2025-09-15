"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, withAuth } from '@/contexts/auth-context';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Briefcase,
  Home,
  Users,
  FileText,
  Phone,
  Mail,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const ApplicationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const applicationId = params.id as string;
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock application data - in real app would fetch from API
  const mockApplicationData = {
    id: 'app_001',
    propertyId: 'prop_001',
    propertyName: 'Modern Downtown Apartment',
    roomName: 'Master Bedroom',
    monthlyRent: 12000,
    applicationDate: '2024-02-01T10:30:00Z',
    status: 'pending',
    lastUpdated: '2024-02-01T10:30:00Z',
    location: 'Av. Insurgentes Sur 1234, Mexico City',
    notes: 'Application under review by property owner.',
    
    // Personal Information
    personalInfo: {
      firstName: user?.profile?.firstName || 'John',
      lastName: user?.profile?.lastName || 'Doe',
      email: user?.email || 'john.doe@email.com',
      phone: '+52 55 1234 5678',
      dateOfBirth: '1995-03-15',
      nationality: 'Mexican',
      idNumber: 'CURP123456789',
      emergencyContact: {
        name: 'Maria Doe',
        relationship: 'parent',
        phone: '+52 55 9876 5432'
      }
    },
    
    // Employment Information
    employment: {
      employmentStatus: 'full-time',
      jobTitle: 'Software Developer',
      company: 'Tech Solutions Inc.',
      workAddress: 'Av. Reforma 456, Mexico City',
      monthlyIncome: '35000',
      employmentLength: '2-5-years',
      supervisorContact: {
        name: 'Carlos Manager',
        phone: '+52 55 1111 2222',
        email: 'carlos.manager@techsolutions.com'
      }
    },
    
    // Housing History
    housingHistory: {
      currentAddress: 'Calle Roma Norte 123, Apt 4B, Mexico City',
      currentLandlord: {
        name: 'Ana Rodriguez',
        phone: '+52 55 3333 4444',
        email: 'ana.rodriguez@email.com'
      },
      rentAmount: '8000',
      moveInDate: '2022-01-15',
      reasonForLeaving: 'Looking for a larger space closer to work'
    },
    
    // References
    references: [
      {
        name: 'Sofia Martinez',
        relationship: 'friend',
        phone: '+52 55 5555 6666',
        email: 'sofia.martinez@email.com',
        yearsKnown: '3-5'
      },
      {
        name: 'Diego Lopez',
        relationship: 'colleague',
        phone: '+52 55 7777 8888',
        email: 'diego.lopez@email.com',
        yearsKnown: '1-2'
      }
    ],
    
    // Lifestyle & Preferences
    lifestyle: {
      smokingStatus: 'non-smoker',
      petOwnership: 'no-pets',
      guestPolicy: 'occasionally',
      noiseLevel: 'quiet',
      cleanlinessLevel: 'very-clean',
      moveInDate: '2024-03-01',
      leaseDuration: '1-year'
    },
    
    // Additional Information
    additional: {
      motivation: 'I am looking for a modern, well-located apartment close to my workplace. I am a responsible tenant who takes good care of properties and maintains excellent relationships with neighbors and landlords.',
      specialRequests: 'Would appreciate if parking space could be included.',
      backgroundCheck: true,
      creditCheck: true,
      termsAccepted: true
    },
    
    // Timeline
    timeline: [
      {
        date: '2024-02-01T10:30:00Z',
        status: 'submitted',
        message: 'Application submitted successfully',
        actor: 'applicant'
      },
      {
        date: '2024-02-01T14:15:00Z',
        status: 'received',
        message: 'Application received by property owner',
        actor: 'system'
      }
    ]
  };

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setApplication(mockApplicationData);
    } catch (error) {
      console.error('Error loading application:', error);
      toast.error('Failed to load application details');
      router.push('/applications');
    } finally {
      setLoading(false);
    }
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
        return <Clock className="w-5 h-5" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'under_review':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const handleContactHoster = () => {
    toast.info('Messaging feature coming soon!');
  };

  const handleWithdrawApplication = () => {
    if (confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      toast.success('Application withdrawn successfully');
      router.push('/applications');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Application Not Found</h3>
              <p className="text-gray-600 mb-8">
                The application you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => router.push('/applications')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Applications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>
          
          <div className="flex space-x-3">
            {application.status === 'pending' && (
              <Button variant="outline" onClick={handleWithdrawApplication}>
                <Trash2 className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            )}
            <Button variant="outline" onClick={handleContactHoster}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Hoster
            </Button>
          </div>
        </div>

        {/* Application Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{application.propertyName}</CardTitle>
                {application.roomName && (
                  <p className="text-gray-600 mt-1">{application.roomName}</p>
                )}
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{application.location}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-semibold">${application.monthlyRent.toLocaleString()}/month</span>
                  </div>
                </div>
              </div>
              <Badge className={`${getStatusColor(application.status)} flex items-center text-base px-3 py-1`}>
                {getStatusIcon(application.status)}
                <span className="ml-2 capitalize">{application.status.replace('_', ' ')}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Applied</span>
                </div>
                <p className="text-sm">{new Date(application.applicationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Last Updated</span>
                </div>
                <p className="text-sm">{new Date(application.lastUpdated).toLocaleDateString()}</p>
              </div>
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Application ID</span>
                </div>
                <p className="text-sm font-mono">{application.id.toUpperCase()}</p>
              </div>
            </div>
            
            {application.notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">{application.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="font-semibold">{application.personalInfo.firstName} {application.personalInfo.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {application.personalInfo.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {application.personalInfo.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p>{new Date(application.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nationality</label>
                  <p>{application.personalInfo.nationality}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ID Number</label>
                  <p className="font-mono">{application.personalInfo.idNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Emergency Contact
                  </label>
                  <p className="font-semibold">{application.personalInfo.emergencyContact.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{application.personalInfo.emergencyContact.relationship}</p>
                  <p className="text-sm">{application.personalInfo.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Employment Status</label>
                  <p className="capitalize font-semibold">{application.employment.employmentStatus.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Title</label>
                  <p>{application.employment.jobTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p>{application.employment.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Work Address</label>
                  <p className="text-sm">{application.employment.workAddress}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                  <p className="text-lg font-semibold text-green-600">
                    ${parseInt(application.employment.monthlyIncome).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Employment Length</label>
                  <p className="capitalize">{application.employment.employmentLength.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Supervisor Contact</label>
                  <p className="font-semibold">{application.employment.supervisorContact.name}</p>
                  <p className="text-sm">{application.employment.supervisorContact.phone}</p>
                  <p className="text-sm">{application.employment.supervisorContact.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Housing History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Housing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Address</label>
                  <p>{application.housingHistory.currentAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Rent</label>
                  <p className="font-semibold text-green-600">
                    ${parseInt(application.housingHistory.rentAmount).toLocaleString()}/month
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Move-in Date</label>
                  <p>{new Date(application.housingHistory.moveInDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Landlord</label>
                  <p className="font-semibold">{application.housingHistory.currentLandlord.name}</p>
                  <p className="text-sm">{application.housingHistory.currentLandlord.phone}</p>
                  <p className="text-sm">{application.housingHistory.currentLandlord.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reason for Leaving</label>
                  <p className="text-sm">{application.housingHistory.reasonForLeaving}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {application.references.map((reference: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Reference {index + 1}</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p>{reference.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Relationship</label>
                      <p className="capitalize">{reference.relationship}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contact</label>
                      <p className="text-sm">{reference.phone}</p>
                      <p className="text-sm">{reference.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Years Known</label>
                      <p className="capitalize">{reference.yearsKnown.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle & Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lifestyle & Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Smoking</label>
                <p className="capitalize">{application.lifestyle.smokingStatus.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Pets</label>
                <p className="capitalize">{application.lifestyle.petOwnership.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Guests</label>
                <p className="capitalize">{application.lifestyle.guestPolicy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Noise Level</label>
                <p className="capitalize">{application.lifestyle.noiseLevel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Cleanliness</label>
                <p className="capitalize">{application.lifestyle.cleanlinessLevel.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Move-in Date</label>
                <p>{new Date(application.lifestyle.moveInDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Lease Duration</label>
                <p className="capitalize">{application.lifestyle.leaseDuration.replace('-', ' ')}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Why do you want to live here?</label>
                <p className="text-sm mt-1">{application.additional.motivation}</p>
              </div>
              {application.additional.specialRequests && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Special Requests</label>
                  <p className="text-sm mt-1">{application.additional.specialRequests}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.timeline.map((event: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium capitalize">{event.status.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">{event.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                    </p>
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

export default withAuth(ApplicationDetailPage, { 
  allowedUserTypes: ['tenant', 'roomie'] 
}); 