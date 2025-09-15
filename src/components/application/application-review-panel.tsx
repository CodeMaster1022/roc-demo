"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  User, 
  Briefcase, 
  Home, 
  Users, 
  Heart,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MapPin,
  Check,
  X,
  MessageSquare,
  FileText,
  Star,
  AlertCircle,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationReviewPanelProps {
  application: any;
  onStatusUpdate: (applicationId: string, status: string, notes?: string) => void;
  onScheduleInterview: (applicationId: string, interviewData: any) => void;
  className?: string;
}

const ApplicationReviewPanel: React.FC<ApplicationReviewPanelProps> = ({
  application,
  onStatusUpdate,
  onScheduleInterview,
  className = ''
}) => {
  const [reviewNotes, setReviewNotes] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    type: 'video',
    notes: ''
  });

  const handleApprove = () => {
    onStatusUpdate(application.id, 'approved', reviewNotes);
    setShowApproveDialog(false);
    setReviewNotes('');
    toast.success('Application approved successfully');
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    onStatusUpdate(application.id, 'rejected', reviewNotes);
    setShowRejectDialog(false);
    setReviewNotes('');
    toast.success('Application rejected');
  };

  const handleScheduleInterview = () => {
    if (!interviewData.date || !interviewData.time) {
      toast.error('Please select date and time for the interview');
      return;
    }
    
    onScheduleInterview(application.id, interviewData);
    onStatusUpdate(application.id, 'interview_scheduled', `Interview scheduled for ${interviewData.date} at ${interviewData.time}`);
    setShowInterviewDialog(false);
    setInterviewData({ date: '', time: '', type: 'video', notes: '' });
    toast.success('Interview scheduled successfully');
  };

  const calculateCompatibilityScore = () => {
    // Mock compatibility calculation based on application data
    let score = 0;
    let maxScore = 0;

    // Income compatibility (30 points)
    maxScore += 30;
    if (application.employment?.monthlyIncome) {
      const income = parseInt(application.employment.monthlyIncome);
      const rentRatio = income / application.monthlyRent;
      if (rentRatio >= 3) score += 30;
      else if (rentRatio >= 2.5) score += 20;
      else if (rentRatio >= 2) score += 10;
    }

    // Lifestyle compatibility (25 points)
    maxScore += 25;
    if (application.lifestyle?.cleanlinessLevel === 'very-clean') score += 10;
    if (application.lifestyle?.smokingStatus === 'non-smoker') score += 8;
    if (application.lifestyle?.petOwnership === 'no-pets') score += 7;

    // Employment stability (20 points)
    maxScore += 20;
    if (application.employment?.employmentStatus === 'full-time') score += 15;
    if (application.employment?.employmentLength === 'more-than-5-years') score += 5;

    // References and background (15 points)
    maxScore += 15;
    if (application.references?.length >= 2) score += 10;
    if (application.additional?.backgroundCheck) score += 3;
    if (application.additional?.creditCheck) score += 2;

    // Application completeness (10 points)
    maxScore += 10;
    if (application.additional?.motivation) score += 5;
    if (application.personalInfo?.emergencyContact?.name) score += 5;

    return Math.round((score / maxScore) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Review';
  };

  const compatibilityScore = calculateCompatibilityScore();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Application Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face" />
                <AvatarFallback>
                  {application.personalInfo?.firstName?.[0]}{application.personalInfo?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                </h2>
                <p className="text-gray-600">{application.personalInfo?.occupation || 'Not specified'}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Applied {new Date(application.applicationDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${application.monthlyRent?.toLocaleString()}/month
                  </div>
                </div>
              </div>
            </div>
            
            {/* Compatibility Score */}
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-2 rounded-full ${getScoreColor(compatibilityScore)}`}>
                <Star className="w-4 h-4 mr-1" />
                <span className="font-semibold">{compatibilityScore}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{getScoreLabel(compatibilityScore)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve Application
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Application</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>Are you sure you want to approve this application?</p>
                  <div>
                    <Label htmlFor="approveNotes">Approval Notes (Optional)</Label>
                    <Textarea
                      id="approveNotes"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Welcome message or next steps..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Application</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>Please provide a reason for rejecting this application:</p>
                  <div>
                    <Label htmlFor="rejectNotes">Reason for Rejection *</Label>
                    <Textarea
                      id="rejectNotes"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Please provide a professional reason for rejection..."
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleReject} variant="destructive">
                      Reject
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Interview</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="interviewDate">Date</Label>
                      <input
                        id="interviewDate"
                        type="date"
                        value={interviewData.date}
                        onChange={(e) => setInterviewData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="interviewTime">Time</Label>
                      <input
                        id="interviewTime"
                        type="time"
                        value={interviewData.time}
                        onChange={(e) => setInterviewData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="interviewType">Interview Type</Label>
                    <select
                      id="interviewType"
                      value={interviewData.type}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="video">Video Call</option>
                      <option value="phone">Phone Call</option>
                      <option value="in-person">In-Person</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="interviewNotes">Notes</Label>
                    <Textarea
                      id="interviewNotes"
                      value={interviewData.notes}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes or instructions for the applicant..."
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleScheduleInterview}>
                      Schedule Interview
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message Applicant
            </Button>

            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Download Application
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Application Details Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {application.personalInfo?.email}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Phone</Label>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {application.personalInfo?.phone}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Age</Label>
                <p>{application.personalInfo?.age || 'Not specified'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Nationality</Label>
                <p>{application.personalInfo?.nationality || 'Not specified'}</p>
              </div>
            </div>
            
            {application.personalInfo?.emergencyContact && (
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium text-gray-600 mb-2 block">Emergency Contact</Label>
                <div className="space-y-1">
                  <p className="font-medium">{application.personalInfo.emergencyContact.name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {application.personalInfo.emergencyContact.relationship}
                  </p>
                  <p className="text-sm">{application.personalInfo.emergencyContact.phone}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Employment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Status</Label>
                <p className="capitalize font-medium">
                  {application.employment?.employmentStatus?.replace('-', ' ')}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Monthly Income</Label>
                <p className="text-lg font-semibold text-green-600">
                  ${parseInt(application.employment?.monthlyIncome || '0').toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Rent-to-income ratio: {((application.monthlyRent / parseInt(application.employment?.monthlyIncome || '1')) * 100).toFixed(1)}%
                </p>
              </div>
              {application.employment?.jobTitle && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Position</Label>
                  <p>{application.employment.jobTitle}</p>
                  <p className="text-sm text-gray-600">{application.employment.company}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lifestyle & Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Lifestyle & Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium text-gray-600">Cleanliness</Label>
              <p className="capitalize">{application.lifestyle?.cleanlinessLevel?.replace('-', ' ')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Smoking</Label>
              <p className="capitalize">{application.lifestyle?.smokingStatus?.replace('-', ' ')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Pets</Label>
              <p className="capitalize">{application.lifestyle?.petOwnership?.replace('-', ' ')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Social Level</Label>
              <p className="capitalize">{application.lifestyle?.socialLevel?.replace('_', ' ')}</p>
            </div>
          </div>

          {application.additional?.motivation && (
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-gray-600 mb-2 block">
                Why they want to live here:
              </Label>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">
                {application.additional.motivation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* References */}
      {application.references && application.references.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              References
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.references.map((reference: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{reference.name}</h4>
                  <p className="text-sm text-gray-600 capitalize mb-2">
                    {reference.relationship}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>{reference.phone}</p>
                    <p>{reference.email}</p>
                    {reference.yearsKnown && (
                      <p className="text-gray-500">
                        Known for: {reference.yearsKnown.replace('-', ' ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {application.timeline?.map((event: any, index: number) => (
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

      {/* Red Flags Alert */}
      {compatibilityScore < 60 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Review Carefully</h4>
                <p className="text-sm text-red-700 mt-1">
                  This application has a low compatibility score. Please review the following concerns before making a decision:
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  {parseInt(application.employment?.monthlyIncome || '0') / application.monthlyRent < 3 && (
                    <li>• Income may not meet 3x rent requirement</li>
                  )}
                  {!application.references?.length && (
                    <li>• No references provided</li>
                  )}
                  {!application.additional?.backgroundCheck && (
                    <li>• Background check not consented</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationReviewPanel; 