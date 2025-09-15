"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  User, 
  Home, 
  Eye, 
  MessageSquare, 
  Calendar, 
  Phone,
  Mail,
  Download,
  RefreshCw,
  Bell,
  MapPin,
  DollarSign,
  Users,
  Shield,
  Camera,
  Signature,
  CreditCard,
  Send,
  Archive,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationTrackerProps {
  applicationId: string;
  userRole: 'applicant' | 'hoster' | 'admin';
  onStatusUpdate?: (status: string) => void;
  className?: string;
}

interface ApplicationStatus {
  id: string;
  status: 'submitted' | 'under_review' | 'documents_requested' | 'interview_scheduled' | 'approved' | 'rejected' | 'contract_sent' | 'contract_signed' | 'completed';
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  actionRequired?: boolean;
  estimatedCompletion?: string;
  nextSteps?: string[];
  documents?: string[];
  metadata?: any;
}

interface ApplicationData {
  id: string;
  propertyName: string;
  propertyAddress: string;
  applicantName: string;
  applicantEmail: string;
  monthlyRent: number;
  applicationDate: string;
  currentStatus: string;
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'property' | 'roommate';
  estimatedDecisionDate: string;
  timeline: ApplicationStatus[];
  documents: {
    required: string[];
    submitted: string[];
    verified: string[];
    pending: string[];
  };
  communications: {
    id: string;
    type: 'email' | 'sms' | 'call' | 'message';
    from: string;
    to: string;
    subject: string;
    message: string;
    timestamp: string;
    read: boolean;
  }[];
  interviews: {
    id: string;
    type: 'video' | 'phone' | 'in-person';
    scheduledDate: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes?: string;
  }[];
  score: {
    overall: number;
    income: number;
    references: number;
    background: number;
    compatibility: number;
  };
}

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applicationId,
  userRole,
  onStatusUpdate,
  className = ''
}) => {
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCommunications, setShowCommunications] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock application data
  const mockApplicationData: ApplicationData = {
    id: applicationId,
    propertyName: 'Modern Downtown Apartment',
    propertyAddress: 'Av. Insurgentes Sur 1234, Mexico City',
    applicantName: 'John Doe',
    applicantEmail: 'john.doe@email.com',
    monthlyRent: 12000,
    applicationDate: '2024-02-01T10:30:00Z',
    currentStatus: 'under_review',
    progress: 65,
    priority: 'medium',
    type: 'property',
    estimatedDecisionDate: '2024-02-10T18:00:00Z',
    timeline: [
      {
        id: 'status_1',
        status: 'submitted',
        timestamp: '2024-02-01T10:30:00Z',
        title: 'Application Submitted',
        description: 'Your rental application has been successfully submitted',
        actor: 'System',
        nextSteps: ['Document verification', 'Initial review by property owner']
      },
      {
        id: 'status_2',
        status: 'under_review',
        timestamp: '2024-02-01T14:15:00Z',
        title: 'Under Review',
        description: 'Property owner is reviewing your application',
        actor: 'Property Owner',
        actionRequired: false,
        estimatedCompletion: '2024-02-08T18:00:00Z',
        nextSteps: ['Background check', 'Reference verification', 'Income verification']
      },
      {
        id: 'status_3',
        status: 'documents_requested',
        timestamp: '2024-02-02T09:00:00Z',
        title: 'Additional Documents Requested',
        description: 'Please upload additional income verification documents',
        actor: 'Property Owner',
        actionRequired: true,
        documents: ['Recent bank statements', 'Employment letter'],
        nextSteps: ['Upload requested documents', 'Wait for verification']
      }
    ],
    documents: {
      required: ['Government ID', 'Proof of Income', 'References', 'Bank Statements'],
      submitted: ['Government ID', 'Proof of Income', 'References'],
      verified: ['Government ID', 'References'],
      pending: ['Proof of Income', 'Bank Statements']
    },
    communications: [
      {
        id: 'comm_1',
        type: 'email',
        from: 'owner@property.com',
        to: 'john.doe@email.com',
        subject: 'Additional Documents Required',
        message: 'Hi John, we need additional bank statements to complete your application review.',
        timestamp: '2024-02-02T09:00:00Z',
        read: true
      },
      {
        id: 'comm_2',
        type: 'message',
        from: 'system',
        to: 'john.doe@email.com',
        subject: 'Application Status Update',
        message: 'Your application is now under review. Expected decision by Feb 10th.',
        timestamp: '2024-02-01T14:15:00Z',
        read: true
      }
    ],
    interviews: [
      {
        id: 'interview_1',
        type: 'video',
        scheduledDate: '2024-02-05T15:00:00Z',
        status: 'scheduled',
        notes: 'Video interview to discuss housing preferences and answer questions'
      }
    ],
    score: {
      overall: 78,
      income: 85,
      references: 90,
      background: 75,
      compatibility: 65
    }
  };

  useEffect(() => {
    loadApplicationData();
    
    if (autoRefresh) {
      const interval = setInterval(loadApplicationData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [applicationId, autoRefresh]);

  const loadApplicationData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApplicationData(mockApplicationData);
    } catch (error) {
      console.error('Error loading application data:', error);
      toast.error('Failed to load application data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'under_review':
        return <Eye className="w-4 h-4 text-yellow-600" />;
      case 'documents_requested':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'contract_sent':
        return <Signature className="w-4 h-4 text-indigo-600" />;
      case 'contract_signed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'completed':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'documents_requested':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'contract_sent':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'contract_signed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleRefresh = () => {
    loadApplicationData();
    toast.success('Application data refreshed');
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(newStatus);
    }
    toast.success('Status updated successfully');
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-16">
          <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Application Not Found</h3>
          <p className="text-gray-600 mb-8">
            The application you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Application Header */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-blue-900 mb-2">
                Application Tracking
              </CardTitle>
              <div className="space-y-1">
                <p className="text-blue-800 font-semibold">{applicationData.propertyName}</p>
                <div className="flex items-center text-blue-700 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{applicationData.propertyAddress}</span>
                </div>
                <div className="flex items-center text-blue-700 text-sm">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>${applicationData.monthlyRent.toLocaleString()}/month</span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <Badge className={getStatusColor(applicationData.currentStatus)}>
                {getStatusIcon(applicationData.currentStatus)}
                <span className="ml-1 capitalize">{applicationData.currentStatus.replace('_', ' ')}</span>
              </Badge>
              <Badge className={getPriorityColor(applicationData.priority)}>
                {applicationData.priority.toUpperCase()}
              </Badge>
              <div className="text-sm text-blue-700">
                ID: {applicationData.id.toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-900">Application Progress</span>
              <span className="text-sm text-blue-700">{applicationData.progress}% Complete</span>
            </div>
            <Progress value={applicationData.progress} className="h-3" />
            <p className="text-xs text-blue-600 mt-1">
              Expected decision by {new Date(applicationData.estimatedDecisionDate).toLocaleDateString()}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Quick Actions
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50 text-green-700' : ''}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Dialog open={showCommunications} onOpenChange={setShowCommunications}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages ({applicationData.communications.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Communications History</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {applicationData.communications.map((comm) => (
                    <div key={comm.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {comm.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                          {comm.type === 'sms' && <MessageSquare className="w-4 h-4 text-green-600" />}
                          {comm.type === 'call' && <Phone className="w-4 h-4 text-purple-600" />}
                          <span className="font-medium">{comm.subject}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comm.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comm.message}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        From: {comm.from} • To: {comm.to}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showDocuments} onOpenChange={setShowDocuments}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Documents ({applicationData.documents.submitted.length}/{applicationData.documents.required.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Document Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {applicationData.documents.required.map((doc) => {
                    const isSubmitted = applicationData.documents.submitted.includes(doc);
                    const isVerified = applicationData.documents.verified.includes(doc);
                    const isPending = applicationData.documents.pending.includes(doc);
                    
                    return (
                      <div key={doc} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {isVerified ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : isPending ? (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          ) : isSubmitted ? (
                            <Eye className="w-5 h-5 text-blue-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-medium">{doc}</span>
                        </div>
                        <Badge className={
                          isVerified ? 'bg-green-100 text-green-800' :
                          isPending ? 'bg-yellow-100 text-yellow-800' :
                          isSubmitted ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {isVerified ? 'Verified' : isPending ? 'Pending' : isSubmitted ? 'Submitted' : 'Missing'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Call
            </Button>

            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Application Score (for hosters/admins) */}
      {userRole !== 'applicant' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Application Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{applicationData.score.overall}</div>
                <div className="text-sm text-gray-600">Overall</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{applicationData.score.income}</div>
                <div className="text-sm text-gray-600">Income</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{applicationData.score.references}</div>
                <div className="text-sm text-gray-600">References</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{applicationData.score.background}</div>
                <div className="text-sm text-gray-600">Background</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{applicationData.score.compatibility}</div>
                <div className="text-sm text-gray-600">Compatibility</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Application Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {applicationData.timeline.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline Line */}
                {index < applicationData.timeline.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    event.actionRequired ? 'bg-orange-100 border-2 border-orange-300' : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    {getStatusIcon(event.status)}
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <div className="flex items-center space-x-2">
                        {event.actionRequired && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <Bell className="w-3 h-3 mr-1" />
                            Action Required
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(event.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{event.description}</p>
                    
                    {event.estimatedCompletion && (
                      <div className="text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Expected completion: {new Date(event.estimatedCompletion).toLocaleDateString()}
                      </div>
                    )}
                    
                    {event.nextSteps && event.nextSteps.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">Next Steps:</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {event.nextSteps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {event.documents && event.documents.length > 0 && (
                      <div className="bg-orange-50 p-3 rounded-lg mt-3">
                        <h5 className="font-medium text-orange-900 mb-2">Required Documents:</h5>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {event.documents.map((doc, docIndex) => (
                            <li key={docIndex} className="flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interviews */}
      {applicationData.interviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Scheduled Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationData.interviews.map((interview) => (
                <div key={interview.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {interview.type === 'video' && <Camera className="w-4 h-4 text-blue-600" />}
                      {interview.type === 'phone' && <Phone className="w-4 h-4 text-green-600" />}
                      {interview.type === 'in-person' && <Users className="w-4 h-4 text-purple-600" />}
                      <span className="font-medium capitalize">{interview.type} Interview</span>
                    </div>
                    <Badge className={
                      interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                      interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {interview.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(interview.scheduledDate).toLocaleDateString()}
                      </span>
                      <span>
                        <Clock className="w-4 h-4 inline mr-1" />
                        {new Date(interview.scheduledDate).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {interview.notes && (
                    <p className="text-sm text-gray-700 mt-2">{interview.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {applicationData.timeline.some(event => event.actionRequired) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-900">
              <AlertCircle className="w-5 h-5 mr-2" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applicationData.timeline
                .filter(event => event.actionRequired)
                .map((event) => (
                  <div key={event.id} className="bg-white p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">{event.title}</h4>
                    <p className="text-orange-700 text-sm mb-3">{event.description}</p>
                    {event.documents && (
                      <div className="flex flex-wrap gap-2">
                        {event.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-orange-700 border-orange-300">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationTracker; 