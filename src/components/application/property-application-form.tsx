"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Briefcase, 
  Home, 
  FileText, 
  Upload, 
  Check, 
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface PropertyApplicationFormProps {
  propertyId: string;
  propertyName: string;
  roomId?: string;
  roomName?: string;
  monthlyRent: number;
  onSubmit: (applicationData: any) => void;
  onCancel: () => void;
}

const PropertyApplicationForm: React.FC<PropertyApplicationFormProps> = ({
  propertyId,
  propertyName,
  roomId,
  roomName,
  monthlyRent,
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      idNumber: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    },
    // Employment Information
    employment: {
      employmentStatus: '',
      jobTitle: '',
      company: '',
      workAddress: '',
      monthlyIncome: '',
      employmentLength: '',
      supervisorContact: {
        name: '',
        phone: '',
        email: ''
      }
    },
    // Housing History
    housingHistory: {
      currentAddress: '',
      currentLandlord: {
        name: '',
        phone: '',
        email: ''
      },
      rentAmount: '',
      moveInDate: '',
      reasonForLeaving: ''
    },
    // References
    references: [
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' },
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' }
    ],
    // Lifestyle & Preferences
    lifestyle: {
      smokingStatus: '',
      petOwnership: '',
      guestPolicy: '',
      noiseLevel: '',
      cleanlinessLevel: '',
      moveInDate: '',
      leaseDuration: ''
    },
    // Additional Information
    additional: {
      motivation: '',
      specialRequests: '',
      backgroundCheck: false,
      creditCheck: false,
      termsAccepted: false
    },
    // Documents
    documents: {
      idDocument: null,
      incomeProof: null,
      employmentLetter: null,
      references: null
    }
  });

  const totalSteps = 6;
  const stepTitles = [
    'Personal Information',
    'Employment Details',
    'Housing History',
    'References',
    'Lifestyle & Preferences',
    'Review & Submit'
  ];

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const updateNestedFormData = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [field]: value
        }
      }
    }));
  };

  const updateReferenceData = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = [
      formData.personalInfo.firstName,
      formData.personalInfo.lastName,
      formData.personalInfo.email,
      formData.personalInfo.phone,
      formData.employment.employmentStatus,
      formData.employment.monthlyIncome,
      formData.additional.termsAccepted
    ];

    if (requiredFields.some(field => !field)) {
      toast.error('Please fill in all required fields');
      return;
    }

    const applicationData = {
      propertyId,
      roomId,
      applicationDate: new Date().toISOString(),
      status: 'pending',
      ...formData
    };

    onSubmit(applicationData);
    toast.success('Application submitted successfully!');
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.personalInfo.firstName}
            onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.personalInfo.lastName}
            onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.personalInfo.phone}
            onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
            placeholder="+52 55 1234 5678"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => updateFormData('personalInfo', 'dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.personalInfo.nationality}
            onChange={(e) => updateFormData('personalInfo', 'nationality', e.target.value)}
            placeholder="Mexican"
          />
        </div>
        <div>
          <Label htmlFor="idNumber">ID Number</Label>
          <Input
            id="idNumber"
            value={formData.personalInfo.idNumber}
            onChange={(e) => updateFormData('personalInfo', 'idNumber', e.target.value)}
            placeholder="CURP or Passport"
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="emergencyName">Full Name</Label>
            <Input
              id="emergencyName"
              value={formData.personalInfo.emergencyContact.name}
              onChange={(e) => updateNestedFormData('personalInfo', 'emergencyContact', 'name', e.target.value)}
              placeholder="Contact person name"
            />
          </div>
          <div>
            <Label htmlFor="emergencyRelationship">Relationship</Label>
            <Select
              value={formData.personalInfo.emergencyContact.relationship}
              onValueChange={(value) => updateNestedFormData('personalInfo', 'emergencyContact', 'relationship', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="spouse">Spouse/Partner</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="emergencyPhone">Phone Number</Label>
            <Input
              id="emergencyPhone"
              value={formData.personalInfo.emergencyContact.phone}
              onChange={(e) => updateNestedFormData('personalInfo', 'emergencyContact', 'phone', e.target.value)}
              placeholder="+52 55 1234 5678"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmploymentStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employmentStatus">Employment Status *</Label>
          <Select
            value={formData.employment.employmentStatus}
            onValueChange={(value) => updateFormData('employment', 'employmentStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time Employee</SelectItem>
              <SelectItem value="part-time">Part-time Employee</SelectItem>
              <SelectItem value="freelancer">Freelancer/Contractor</SelectItem>
              <SelectItem value="self-employed">Self-employed</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="monthlyIncome">Monthly Income (MXN) *</Label>
          <Input
            id="monthlyIncome"
            type="number"
            value={formData.employment.monthlyIncome}
            onChange={(e) => updateFormData('employment', 'monthlyIncome', e.target.value)}
            placeholder="25000"
            required
          />
        </div>
      </div>

      {formData.employment.employmentStatus && !['unemployed', 'retired'].includes(formData.employment.employmentStatus) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.employment.jobTitle}
                onChange={(e) => updateFormData('employment', 'jobTitle', e.target.value)}
                placeholder="Software Developer"
              />
            </div>
            <div>
              <Label htmlFor="company">Company/Organization</Label>
              <Input
                id="company"
                value={formData.employment.company}
                onChange={(e) => updateFormData('employment', 'company', e.target.value)}
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="workAddress">Work Address</Label>
            <Input
              id="workAddress"
              value={formData.employment.workAddress}
              onChange={(e) => updateFormData('employment', 'workAddress', e.target.value)}
              placeholder="Full work address"
            />
          </div>

          <div>
            <Label htmlFor="employmentLength">Length of Employment</Label>
            <Select
              value={formData.employment.employmentLength}
              onValueChange={(value) => updateFormData('employment', 'employmentLength', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                <SelectItem value="6-months-1-year">6 months - 1 year</SelectItem>
                <SelectItem value="1-2-years">1 - 2 years</SelectItem>
                <SelectItem value="2-5-years">2 - 5 years</SelectItem>
                <SelectItem value="more-than-5-years">More than 5 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Supervisor Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="supervisorName">Supervisor Name</Label>
                <Input
                  id="supervisorName"
                  value={formData.employment.supervisorContact.name}
                  onChange={(e) => updateNestedFormData('employment', 'supervisorContact', 'name', e.target.value)}
                  placeholder="Manager/Supervisor name"
                />
              </div>
              <div>
                <Label htmlFor="supervisorPhone">Phone</Label>
                <Input
                  id="supervisorPhone"
                  value={formData.employment.supervisorContact.phone}
                  onChange={(e) => updateNestedFormData('employment', 'supervisorContact', 'phone', e.target.value)}
                  placeholder="+52 55 1234 5678"
                />
              </div>
              <div>
                <Label htmlFor="supervisorEmail">Email</Label>
                <Input
                  id="supervisorEmail"
                  type="email"
                  value={formData.employment.supervisorContact.email}
                  onChange={(e) => updateNestedFormData('employment', 'supervisorContact', 'email', e.target.value)}
                  placeholder="supervisor@company.com"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Income Requirements</h4>
            <p className="text-sm text-blue-700 mt-1">
              Monthly income should be at least 3x the rent amount (${(monthlyRent * 3).toLocaleString()}) for this property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHousingHistoryStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="currentAddress">Current Address</Label>
        <Textarea
          id="currentAddress"
          value={formData.housingHistory.currentAddress}
          onChange={(e) => updateFormData('housingHistory', 'currentAddress', e.target.value)}
          placeholder="Full current address"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rentAmount">Current Rent Amount (MXN)</Label>
          <Input
            id="rentAmount"
            type="number"
            value={formData.housingHistory.rentAmount}
            onChange={(e) => updateFormData('housingHistory', 'rentAmount', e.target.value)}
            placeholder="15000"
          />
        </div>
        <div>
          <Label htmlFor="moveInDate">Move-in Date</Label>
          <Input
            id="moveInDate"
            type="date"
            value={formData.housingHistory.moveInDate}
            onChange={(e) => updateFormData('housingHistory', 'moveInDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reasonForLeaving">Reason for Leaving Current Place</Label>
        <Textarea
          id="reasonForLeaving"
          value={formData.housingHistory.reasonForLeaving}
          onChange={(e) => updateFormData('housingHistory', 'reasonForLeaving', e.target.value)}
          placeholder="Explain why you're looking for a new place"
          rows={3}
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2" />
          Current Landlord Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="landlordName">Landlord Name</Label>
            <Input
              id="landlordName"
              value={formData.housingHistory.currentLandlord.name}
              onChange={(e) => updateNestedFormData('housingHistory', 'currentLandlord', 'name', e.target.value)}
              placeholder="Landlord full name"
            />
          </div>
          <div>
            <Label htmlFor="landlordPhone">Phone</Label>
            <Input
              id="landlordPhone"
              value={formData.housingHistory.currentLandlord.phone}
              onChange={(e) => updateNestedFormData('housingHistory', 'currentLandlord', 'phone', e.target.value)}
              placeholder="+52 55 1234 5678"
            />
          </div>
          <div>
            <Label htmlFor="landlordEmail">Email</Label>
            <Input
              id="landlordEmail"
              type="email"
              value={formData.housingHistory.currentLandlord.email}
              onChange={(e) => updateNestedFormData('housingHistory', 'currentLandlord', 'email', e.target.value)}
              placeholder="landlord@email.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderReferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Personal References</h3>
        <p className="text-gray-600">Please provide two personal references who can vouch for your character.</p>
      </div>

      {formData.references.map((reference, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">Reference {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`refName${index}`}>Full Name</Label>
                <Input
                  id={`refName${index}`}
                  value={reference.name}
                  onChange={(e) => updateReferenceData(index, 'name', e.target.value)}
                  placeholder="Reference full name"
                />
              </div>
              <div>
                <Label htmlFor={`refRelationship${index}`}>Relationship</Label>
                <Select
                  value={reference.relationship}
                  onValueChange={(value) => updateReferenceData(index, 'relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="former-landlord">Former Landlord</SelectItem>
                    <SelectItem value="professor">Professor/Teacher</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="family">Family Member</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`refPhone${index}`}>Phone</Label>
                <Input
                  id={`refPhone${index}`}
                  value={reference.phone}
                  onChange={(e) => updateReferenceData(index, 'phone', e.target.value)}
                  placeholder="+52 55 1234 5678"
                />
              </div>
              <div>
                <Label htmlFor={`refEmail${index}`}>Email</Label>
                <Input
                  id={`refEmail${index}`}
                  type="email"
                  value={reference.email}
                  onChange={(e) => updateReferenceData(index, 'email', e.target.value)}
                  placeholder="reference@email.com"
                />
              </div>
              <div>
                <Label htmlFor={`refYears${index}`}>Years Known</Label>
                <Select
                  value={reference.yearsKnown}
                  onValueChange={(value) => updateReferenceData(index, 'yearsKnown', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How long have you known them?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="more-than-5">More than 5 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderLifestyleStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="smokingStatus">Smoking Status</Label>
          <Select
            value={formData.lifestyle.smokingStatus}
            onValueChange={(value) => updateFormData('lifestyle', 'smokingStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select smoking status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="non-smoker">Non-smoker</SelectItem>
              <SelectItem value="occasional">Occasional smoker</SelectItem>
              <SelectItem value="regular">Regular smoker</SelectItem>
              <SelectItem value="social">Social smoker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="petOwnership">Pet Ownership</Label>
          <Select
            value={formData.lifestyle.petOwnership}
            onValueChange={(value) => updateFormData('lifestyle', 'petOwnership', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Do you have pets?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-pets">No pets</SelectItem>
              <SelectItem value="cat">Cat(s)</SelectItem>
              <SelectItem value="dog">Dog(s)</SelectItem>
              <SelectItem value="both">Both cats and dogs</SelectItem>
              <SelectItem value="other">Other pets</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="guestPolicy">Guest Policy</Label>
          <Select
            value={formData.lifestyle.guestPolicy}
            onValueChange={(value) => updateFormData('lifestyle', 'guestPolicy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How often do you have guests?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rarely">Rarely have guests</SelectItem>
              <SelectItem value="occasionally">Occasionally (weekends)</SelectItem>
              <SelectItem value="frequently">Frequently</SelectItem>
              <SelectItem value="overnight">Overnight guests sometimes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="noiseLevel">Noise Level</Label>
          <Select
            value={formData.lifestyle.noiseLevel}
            onValueChange={(value) => updateFormData('lifestyle', 'noiseLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Your typical noise level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-quiet">Very quiet</SelectItem>
              <SelectItem value="quiet">Quiet</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="lively">Lively/Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="cleanlinessLevel">Cleanliness Level</Label>
          <Select
            value={formData.lifestyle.cleanlinessLevel}
            onValueChange={(value) => updateFormData('lifestyle', 'cleanlinessLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Your cleanliness standard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-clean">Very clean/organized</SelectItem>
              <SelectItem value="clean">Clean and tidy</SelectItem>
              <SelectItem value="moderate">Moderately clean</SelectItem>
              <SelectItem value="relaxed">Relaxed about cleanliness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="leaseDuration">Preferred Lease Duration</Label>
          <Select
            value={formData.lifestyle.leaseDuration}
            onValueChange={(value) => updateFormData('lifestyle', 'leaseDuration', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="How long do you want to stay?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6-months">6 months</SelectItem>
              <SelectItem value="1-year">1 year</SelectItem>
              <SelectItem value="2-years">2 years</SelectItem>
              <SelectItem value="long-term">Long-term (2+ years)</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
        <Input
          id="moveInDate"
          type="date"
          value={formData.lifestyle.moveInDate}
          onChange={(e) => updateFormData('lifestyle', 'moveInDate', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="motivation">Why do you want to live here?</Label>
        <Textarea
          id="motivation"
          value={formData.additional.motivation}
          onChange={(e) => updateFormData('additional', 'motivation', e.target.value)}
          placeholder="Tell us why you're interested in this property and what makes you a good tenant..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
        <Textarea
          id="specialRequests"
          value={formData.additional.specialRequests}
          onChange={(e) => updateFormData('additional', 'specialRequests', e.target.value)}
          placeholder="Any special accommodations, modifications, or requests..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Review Your Application</h3>
        <p className="text-gray-600">Please review all information before submitting.</p>
      </div>

      {/* Application Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Application Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Property</Label>
              <p className="font-semibold">{propertyName}</p>
              {roomName && <p className="text-sm text-gray-600">{roomName}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Monthly Rent</Label>
              <p className="font-semibold text-green-600">${monthlyRent.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Applicant</Label>
              <p className="font-semibold">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Preferred Move-in</Label>
              <p className="font-semibold">
                {formData.lifestyle.moveInDate ? new Date(formData.lifestyle.moveInDate).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Checkboxes */}
      <Card>
        <CardHeader>
          <CardTitle>Verification & Consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="backgroundCheck"
              checked={formData.additional.backgroundCheck}
              onCheckedChange={(checked) => updateFormData('additional', 'backgroundCheck', checked)}
            />
            <div>
              <Label htmlFor="backgroundCheck" className="text-sm font-medium">
                Background Check Consent
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                I consent to a background check being performed as part of the application process.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="creditCheck"
              checked={formData.additional.creditCheck}
              onCheckedChange={(checked) => updateFormData('additional', 'creditCheck', checked)}
            />
            <div>
              <Label htmlFor="creditCheck" className="text-sm font-medium">
                Credit Check Consent
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                I consent to a credit check being performed as part of the application process.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="termsAccepted"
              checked={formData.additional.termsAccepted}
              onCheckedChange={(checked) => updateFormData('additional', 'termsAccepted', checked)}
            />
            <div>
              <Label htmlFor="termsAccepted" className="text-sm font-medium">
                Terms and Conditions *
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                I agree to the terms and conditions, privacy policy, and understand that all information provided is accurate and complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Reminder */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Upload className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900">Required Documents</h4>
              <p className="text-sm text-orange-700 mt-1">
                Please ensure you have the following documents ready to upload after submission:
              </p>
              <ul className="text-sm text-orange-700 mt-2 space-y-1 list-disc list-inside">
                <li>Government-issued ID (passport, driver's license, or national ID)</li>
                <li>Proof of income (recent pay stubs or employment letter)</li>
                <li>Bank statements (last 3 months)</li>
                <li>Reference contact information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderEmploymentStep();
      case 3:
        return renderHousingHistoryStep();
      case 4:
        return renderReferencesStep();
      case 5:
        return renderLifestyleStep();
      case 6:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Property Application</CardTitle>
              <p className="text-gray-600 mt-1">
                Applying for: <span className="font-semibold">{propertyName}</span>
                {roomName && <span className="text-sm"> - {roomName}</span>}
              </p>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-300">
              ${monthlyRent.toLocaleString()}/month
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Step {currentStep} of {totalSteps}</h3>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="mb-2" />
          <p className="text-sm text-gray-600">{stepTitles[currentStep - 1]}</p>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {currentStep === 1 && <User className="w-5 h-5 mr-2" />}
            {currentStep === 2 && <Briefcase className="w-5 h-5 mr-2" />}
            {currentStep === 3 && <Home className="w-5 h-5 mr-2" />}
            {currentStep === 4 && <Users className="w-5 h-5 mr-2" />}
            {currentStep === 5 && <FileText className="w-5 h-5 mr-2" />}
            {currentStep === 6 && <Check className="w-5 h-5 mr-2" />}
            {stepTitles[currentStep - 1]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
              disabled={!formData.additional.termsAccepted}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyApplicationForm; 