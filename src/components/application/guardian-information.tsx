"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  User, 
  Phone, 
  Mail, 
  Home, 
  Briefcase, 
  CreditCard, 
  FileText, 
  AlertCircle, 
  Check,
  Plus,
  X,
  Users,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

interface GuardianInformationProps {
  onGuardianDataChange: (guardianData: any) => void;
  className?: string;
}

interface Guardian {
  id: string;
  relationship: string;
  isPrimary: boolean;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternatePhone: string;
    dateOfBirth: string;
    nationality: string;
    idNumber: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    sameAsStudent: boolean;
  };
  employment: {
    status: string;
    jobTitle: string;
    company: string;
    workAddress: string;
    monthlyIncome: string;
    employmentLength: string;
    supervisorContact: {
      name: string;
      phone: string;
      email: string;
    };
  };
  financialInfo: {
    willingToCoSign: boolean;
    monthlySupport: string;
    bankName: string;
    accountType: string;
    creditScore: string;
    hasOtherDependents: boolean;
    numberOfDependents: string;
  };
  authorization: {
    emergencyContact: boolean;
    financialDecisions: boolean;
    medicalDecisions: boolean;
    academicInformation: boolean;
    propertyVisits: boolean;
  };
}

const GuardianInformation: React.FC<GuardianInformationProps> = ({
  onGuardianDataChange,
  className = ''
}) => {
  const [guardians, setGuardians] = useState<Guardian[]>([{
    id: 'guardian_1',
    relationship: '',
    isPrimary: true,
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      alternatePhone: '',
      dateOfBirth: '',
      nationality: '',
      idNumber: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Mexico',
      sameAsStudent: false
    },
    employment: {
      status: '',
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
    financialInfo: {
      willingToCoSign: false,
      monthlySupport: '',
      bankName: '',
      accountType: '',
      creditScore: '',
      hasOtherDependents: false,
      numberOfDependents: ''
    },
    authorization: {
      emergencyContact: true,
      financialDecisions: false,
      medicalDecisions: false,
      academicInformation: false,
      propertyVisits: true
    }
  }]);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateGuardianData = (guardianId: string, section: string, field: string, value: any) => {
    setGuardians(prev => {
      const updated = prev.map(guardian => 
        guardian.id === guardianId 
          ? {
              ...guardian,
              [section]: {
                ...(guardian[section as keyof Guardian] as any),
                [field]: value
              }
            }
          : guardian
      );
      onGuardianDataChange(updated);
      return updated;
    });
  };

  const updateNestedGuardianData = (guardianId: string, section: string, subsection: string, field: string, value: any) => {
    setGuardians(prev => {
      const updated = prev.map(guardian => 
        guardian.id === guardianId 
          ? {
              ...guardian,
              [section]: {
                ...(guardian[section as keyof Guardian] as any),
                [subsection]: {
                  ...(guardian[section as keyof Guardian] as any)[subsection],
                  [field]: value
                }
              }
            }
          : guardian
      );
      onGuardianDataChange(updated);
      return updated;
    });
  };

  const addGuardian = () => {
    const newGuardian: Guardian = {
      id: `guardian_${Date.now()}`,
      relationship: '',
      isPrimary: false,
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        dateOfBirth: '',
        nationality: '',
        idNumber: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Mexico',
        sameAsStudent: false
      },
      employment: {
        status: '',
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
      financialInfo: {
        willingToCoSign: false,
        monthlySupport: '',
        bankName: '',
        accountType: '',
        creditScore: '',
        hasOtherDependents: false,
        numberOfDependents: ''
      },
      authorization: {
        emergencyContact: false,
        financialDecisions: false,
        medicalDecisions: false,
        academicInformation: false,
        propertyVisits: false
      }
    };

    setGuardians(prev => {
      const updated = [...prev, newGuardian];
      onGuardianDataChange(updated);
      return updated;
    });
    toast.success('Guardian added successfully');
  };

  const removeGuardian = (guardianId: string) => {
    if (guardians.length === 1) {
      toast.error('At least one guardian is required');
      return;
    }

    setGuardians(prev => {
      const updated = prev.filter(g => g.id !== guardianId);
      // If we removed the primary guardian, make the first one primary
      if (updated.length > 0 && !updated.some(g => g.isPrimary)) {
        updated[0].isPrimary = true;
      }
      onGuardianDataChange(updated);
      return updated;
    });
    toast.success('Guardian removed');
  };

  const setPrimaryGuardian = (guardianId: string) => {
    setGuardians(prev => {
      const updated = prev.map(guardian => ({
        ...guardian,
        isPrimary: guardian.id === guardianId
      }));
      onGuardianDataChange(updated);
      return updated;
    });
    toast.success('Primary guardian updated');
  };

  const validateStep = (step: number) => {
    const primaryGuardian = guardians.find(g => g.isPrimary);
    if (!primaryGuardian) return false;

    switch (step) {
      case 1:
        return primaryGuardian.personalInfo.firstName && 
               primaryGuardian.personalInfo.lastName && 
               primaryGuardian.personalInfo.email && 
               primaryGuardian.personalInfo.phone &&
               primaryGuardian.relationship;
      case 2:
        return primaryGuardian.address.street && 
               primaryGuardian.address.city && 
               primaryGuardian.address.state;
      case 3:
        return primaryGuardian.employment.status && 
               primaryGuardian.employment.monthlyIncome;
      case 4:
        return true; // Authorization step is optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields before continuing');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      {guardians.map((guardian, index) => (
        <Card key={guardian.id} className={guardian.isPrimary ? 'border-blue-300 bg-blue-50' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Guardian {index + 1}
                {guardian.isPrimary && (
                  <Badge className="ml-2 bg-blue-600">Primary</Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {!guardian.isPrimary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrimaryGuardian(guardian.id)}
                  >
                    Set as Primary
                  </Button>
                )}
                {guardians.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeGuardian(guardian.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`relationship-${guardian.id}`}>Relationship to Student *</Label>
              <Select
                value={guardian.relationship}
                onValueChange={(value) => updateGuardianData(guardian.id, 'relationship', '', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="father">Father</SelectItem>
                  <SelectItem value="mother">Mother</SelectItem>
                  <SelectItem value="step-parent">Step-parent</SelectItem>
                  <SelectItem value="grandparent">Grandparent</SelectItem>
                  <SelectItem value="legal-guardian">Legal Guardian</SelectItem>
                  <SelectItem value="uncle-aunt">Uncle/Aunt</SelectItem>
                  <SelectItem value="sibling">Adult Sibling</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`firstName-${guardian.id}`}>First Name *</Label>
                <Input
                  id={`firstName-${guardian.id}`}
                  value={guardian.personalInfo.firstName}
                  onChange={(e) => updateNestedGuardianData(guardian.id, 'personalInfo', '', 'firstName', e.target.value)}
                  placeholder="Guardian's first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`lastName-${guardian.id}`}>Last Name *</Label>
                <Input
                  id={`lastName-${guardian.id}`}
                  value={guardian.personalInfo.lastName}
                  onChange={(e) => updateNestedGuardianData(guardian.id, 'personalInfo', '', 'lastName', e.target.value)}
                  placeholder="Guardian's last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`email-${guardian.id}`}>Email Address *</Label>
                <Input
                  id={`email-${guardian.id}`}
                  type="email"
                  value={guardian.personalInfo.email}
                  onChange={(e) => updateNestedGuardianData(guardian.id, 'personalInfo', '', 'email', e.target.value)}
                  placeholder="guardian@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`phone-${guardian.id}`}>Phone Number *</Label>
                <Input
                  id={`phone-${guardian.id}`}
                  value={guardian.personalInfo.phone}
                  onChange={(e) => updateNestedGuardianData(guardian.id, 'personalInfo', '', 'phone', e.target.value)}
                  placeholder="+52 55 1234 5678"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`alternatePhone-${guardian.id}`}>Alternate Phone</Label>
                <Input
                  id={`alternatePhone-${guardian.id}`}
                  value={guardian.personalInfo.alternatePhone}
                  onChange={(e) => updateNestedGuardianData(guardian.id, 'personalInfo', '', 'alternatePhone', e.target.value)}
                  placeholder="+52 55 9876 5432"
                />
              </div>
              <div>
                <Label htmlFor={`dateOfBirth-${guardian.id}`}>Date of Birth</Label>
                <Input
                  id={`dateOfBirth-${guardian.id}`}
                  type="date"
                  value={guardian.personalInfo.dateOfBirth}
                  onChange={(e) => updateNestedGuardianData(guardian.id, 'personalInfo', '', 'dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`nationality-${guardian.id}`}>Nationality</Label>
                <Input
                  id={`nationality-${guardian.id}`}
                  value={guardian.personalInfo.nationality}
                  onChange={(e) => updateNestedGuardianData(guardian.id, 'personalInfo', '', 'nationality', e.target.value)}
                  placeholder="Mexican"
                />
              </div>
              <div>
                <Label htmlFor={`idNumber-${guardian.id}`}>ID Number</Label>
                <Input
                  id={`idNumber-${guardian.id}`}
                  value={guardian.personalInfo.idNumber}
                  onChange={(e) => updateNestedGuardianData(guardian.id, 'personalInfo', '', 'idNumber', e.target.value)}
                  placeholder="CURP or Passport"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addGuardian} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Another Guardian
      </Button>
    </div>
  );

  const renderAddressStep = () => (
    <div className="space-y-6">
      {guardians.map((guardian, index) => (
        <Card key={guardian.id} className={guardian.isPrimary ? 'border-blue-300 bg-blue-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              {guardian.personalInfo.firstName || `Guardian ${index + 1}`} - Address Information
              {guardian.isPrimary && (
                <Badge className="ml-2 bg-blue-600">Primary</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id={`sameAsStudent-${guardian.id}`}
                checked={guardian.address.sameAsStudent}
                onCheckedChange={(checked) => updateNestedGuardianData(guardian.id, 'address', '', 'sameAsStudent', checked)}
              />
              <Label htmlFor={`sameAsStudent-${guardian.id}`}>
                Same address as student
              </Label>
            </div>

            {!guardian.address.sameAsStudent && (
              <>
                <div>
                  <Label htmlFor={`street-${guardian.id}`}>Street Address *</Label>
                  <Input
                    id={`street-${guardian.id}`}
                    value={guardian.address.street}
                    onChange={(e) => updateNestedGuardianData(guardian.id, 'address', '', 'street', e.target.value)}
                    placeholder="Full street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`city-${guardian.id}`}>City *</Label>
                    <Input
                      id={`city-${guardian.id}`}
                      value={guardian.address.city}
                      onChange={(e) => updateNestedGuardianData(guardian.id, 'address', '', 'city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`state-${guardian.id}`}>State/Province *</Label>
                    <Input
                      id={`state-${guardian.id}`}
                      value={guardian.address.state}
                      onChange={(e) => updateNestedGuardianData(guardian.id, 'address', '', 'state', e.target.value)}
                      placeholder="State or Province"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`zipCode-${guardian.id}`}>ZIP/Postal Code</Label>
                    <Input
                      id={`zipCode-${guardian.id}`}
                      value={guardian.address.zipCode}
                      onChange={(e) => updateNestedGuardianData(guardian.id, 'address', '', 'zipCode', e.target.value)}
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`country-${guardian.id}`}>Country</Label>
                  <Select
                    value={guardian.address.country}
                    onValueChange={(value) => updateNestedGuardianData(guardian.id, 'address', '', 'country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmploymentStep = () => (
    <div className="space-y-6">
      {guardians.map((guardian, index) => (
        <Card key={guardian.id} className={guardian.isPrimary ? 'border-blue-300 bg-blue-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              {guardian.personalInfo.firstName || `Guardian ${index + 1}`} - Employment & Financial Information
              {guardian.isPrimary && (
                <Badge className="ml-2 bg-blue-600">Primary</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employment Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Employment Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`employmentStatus-${guardian.id}`}>Employment Status *</Label>
                  <Select
                    value={guardian.employment.status}
                    onValueChange={(value) => updateNestedGuardianData(guardian.id, 'employment', '', 'status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time Employee</SelectItem>
                      <SelectItem value="part-time">Part-time Employee</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`monthlyIncome-${guardian.id}`}>Monthly Income (MXN) *</Label>
                  <Input
                    id={`monthlyIncome-${guardian.id}`}
                    type="number"
                    value={guardian.employment.monthlyIncome}
                    onChange={(e) => updateNestedGuardianData(guardian.id, 'employment', '', 'monthlyIncome', e.target.value)}
                    placeholder="50000"
                    required
                  />
                </div>
              </div>

              {guardian.employment.status && !['retired', 'unemployed'].includes(guardian.employment.status) && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`jobTitle-${guardian.id}`}>Job Title</Label>
                      <Input
                        id={`jobTitle-${guardian.id}`}
                        value={guardian.employment.jobTitle}
                        onChange={(e) => updateNestedGuardianData(guardian.id, 'employment', '', 'jobTitle', e.target.value)}
                        placeholder="Manager, Engineer, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`company-${guardian.id}`}>Company/Organization</Label>
                      <Input
                        id={`company-${guardian.id}`}
                        value={guardian.employment.company}
                        onChange={(e) => updateNestedGuardianData(guardian.id, 'employment', '', 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`workAddress-${guardian.id}`}>Work Address</Label>
                    <Input
                      id={`workAddress-${guardian.id}`}
                      value={guardian.employment.workAddress}
                      onChange={(e) => updateNestedGuardianData(guardian.id, 'employment', '', 'workAddress', e.target.value)}
                      placeholder="Work location"
                    />
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Financial Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Financial Information
              </h4>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`willingToCoSign-${guardian.id}`}
                    checked={guardian.financialInfo.willingToCoSign}
                    onCheckedChange={(checked) => updateNestedGuardianData(guardian.id, 'financialInfo', '', 'willingToCoSign', checked)}
                  />
                  <Label htmlFor={`willingToCoSign-${guardian.id}`}>
                    Willing to co-sign the lease agreement
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`hasOtherDependents-${guardian.id}`}
                    checked={guardian.financialInfo.hasOtherDependents}
                    onCheckedChange={(checked) => updateNestedGuardianData(guardian.id, 'financialInfo', '', 'hasOtherDependents', checked)}
                  />
                  <Label htmlFor={`hasOtherDependents-${guardian.id}`}>
                    Has other dependents
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`monthlySupport-${guardian.id}`}>Monthly Financial Support to Student (MXN)</Label>
                  <Input
                    id={`monthlySupport-${guardian.id}`}
                    type="number"
                    value={guardian.financialInfo.monthlySupport}
                    onChange={(e) => updateNestedGuardianData(guardian.id, 'financialInfo', '', 'monthlySupport', e.target.value)}
                    placeholder="10000"
                  />
                </div>
                {guardian.financialInfo.hasOtherDependents && (
                  <div>
                    <Label htmlFor={`numberOfDependents-${guardian.id}`}>Number of Other Dependents</Label>
                    <Input
                      id={`numberOfDependents-${guardian.id}`}
                      type="number"
                      value={guardian.financialInfo.numberOfDependents}
                      onChange={(e) => updateNestedGuardianData(guardian.id, 'financialInfo', '', 'numberOfDependents', e.target.value)}
                      placeholder="2"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`bankName-${guardian.id}`}>Primary Bank</Label>
                  <Input
                    id={`bankName-${guardian.id}`}
                    value={guardian.financialInfo.bankName}
                    onChange={(e) => updateNestedGuardianData(guardian.id, 'financialInfo', '', 'bankName', e.target.value)}
                    placeholder="Banco Santander"
                  />
                </div>
                <div>
                  <Label htmlFor={`creditScore-${guardian.id}`}>Credit Score Range (Optional)</Label>
                  <Select
                    value={guardian.financialInfo.creditScore}
                    onValueChange={(value) => updateNestedGuardianData(guardian.id, 'financialInfo', '', 'creditScore', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (750+)</SelectItem>
                      <SelectItem value="good">Good (700-749)</SelectItem>
                      <SelectItem value="fair">Fair (650-699)</SelectItem>
                      <SelectItem value="poor">Poor (below 650)</SelectItem>
                      <SelectItem value="unknown">Unknown/No Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderAuthorizationStep = () => (
    <div className="space-y-6">
      {guardians.map((guardian, index) => (
        <Card key={guardian.id} className={guardian.isPrimary ? 'border-blue-300 bg-blue-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              {guardian.personalInfo.firstName || `Guardian ${index + 1}`} - Authorization & Permissions
              {guardian.isPrimary && (
                <Badge className="ml-2 bg-blue-600">Primary</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Please specify what permissions you're granting to this guardian:
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`emergencyContact-${guardian.id}`}
                  checked={guardian.authorization.emergencyContact}
                  onCheckedChange={(checked) => updateNestedGuardianData(guardian.id, 'authorization', '', 'emergencyContact', checked)}
                />
                <div>
                  <Label htmlFor={`emergencyContact-${guardian.id}`} className="font-medium">
                    Emergency Contact
                  </Label>
                  <p className="text-sm text-gray-600">
                    Can be contacted in case of emergencies related to housing
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`financialDecisions-${guardian.id}`}
                  checked={guardian.authorization.financialDecisions}
                  onCheckedChange={(checked) => updateNestedGuardianData(guardian.id, 'authorization', '', 'financialDecisions', checked)}
                />
                <div>
                  <Label htmlFor={`financialDecisions-${guardian.id}`} className="font-medium">
                    Financial Decisions
                  </Label>
                  <p className="text-sm text-gray-600">
                    Can make financial decisions related to rent, deposits, and damages
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`propertyVisits-${guardian.id}`}
                  checked={guardian.authorization.propertyVisits}
                  onCheckedChange={(checked) => updateNestedGuardianData(guardian.id, 'authorization', '', 'propertyVisits', checked)}
                />
                <div>
                  <Label htmlFor={`propertyVisits-${guardian.id}`} className="font-medium">
                    Property Visits
                  </Label>
                  <p className="text-sm text-gray-600">
                    Can visit the property and communicate with landlord/roommates
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`academicInformation-${guardian.id}`}
                  checked={guardian.authorization.academicInformation}
                  onCheckedChange={(checked) => updateNestedGuardianData(guardian.id, 'authorization', '', 'academicInformation', checked)}
                />
                <div>
                  <Label htmlFor={`academicInformation-${guardian.id}`} className="font-medium">
                    Academic Information Sharing
                  </Label>
                  <p className="text-sm text-gray-600">
                    Can receive updates about academic performance if it affects housing
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`medicalDecisions-${guardian.id}`}
                  checked={guardian.authorization.medicalDecisions}
                  onCheckedChange={(checked) => updateNestedGuardianData(guardian.id, 'authorization', '', 'medicalDecisions', checked)}
                />
                <div>
                  <Label htmlFor={`medicalDecisions-${guardian.id}`} className="font-medium">
                    Medical Emergency Decisions
                  </Label>
                  <p className="text-sm text-gray-600">
                    Can make medical decisions in case of emergencies when student is unavailable
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900">Important Legal Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                By providing guardian information and authorizations, you acknowledge that:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                <li>The student is under 18 or requires guardian support for housing</li>
                <li>Guardian information will be verified as part of the application process</li>
                <li>Guardians may be contacted for lease co-signing or emergency situations</li>
                <li>False information may result in application rejection</li>
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
        return renderAddressStep();
      case 3:
        return renderEmploymentStep();
      case 4:
        return renderAuthorizationStep();
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-900">
            <Shield className="w-6 h-6 mr-3" />
            Guardian Information
            <Badge variant="outline" className="ml-3 text-purple-700 border-purple-300">
              Student Application
            </Badge>
          </CardTitle>
          <p className="text-purple-700">
            As a student applicant, we need information about your guardian(s) or parent(s) who will be responsible for your housing agreement.
          </p>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Step {currentStep} of {totalSteps}</h3>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i < currentStep ? 'bg-purple-600' : i === currentStep - 1 ? 'bg-purple-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {currentStep === 1 && 'Personal Information'}
            {currentStep === 2 && 'Address Information'}
            {currentStep === 3 && 'Employment & Financial Details'}
            {currentStep === 4 && 'Authorization & Permissions'}
          </p>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div>
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            <div>
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
                  Next Step
                </Button>
              ) : (
                <Button onClick={() => toast.success('Guardian information completed!')} className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" />
                  Complete Guardian Info
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {guardians.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Guardian Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guardians.map((guardian, index) => (
                <div key={guardian.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium">
                        {guardian.personalInfo.firstName} {guardian.personalInfo.lastName}
                        {guardian.isPrimary && <Badge className="ml-2 bg-blue-600 text-xs">Primary</Badge>}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {guardian.relationship} • {guardian.personalInfo.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${parseInt(guardian.employment.monthlyIncome || '0').toLocaleString()}/month
                    </p>
                    <p className="text-xs text-gray-600">
                      {guardian.financialInfo.willingToCoSign ? 'Will co-sign' : 'No co-sign'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuardianInformation; 