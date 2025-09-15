"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Download, 
  Send, 
  Check, 
  AlertCircle,
  Calendar,
  DollarSign,
  Home,
  User,
  Shield,
  Edit,
  Eye,
  Signature,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface LeaseContractGeneratorProps {
  applicationData: any;
  propertyData: any;
  onContractGenerated: (contractData: any) => void;
  onContractSigned: (contractId: string, signature: any) => void;
  className?: string;
}

interface ContractTerms {
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  utilities: string[];
  petPolicy: string;
  guestPolicy: string;
  maintenanceResponsibility: string;
  earlyTerminationClause: boolean;
  renewalOption: boolean;
  specialClauses: string;
}

const LeaseContractGenerator: React.FC<LeaseContractGeneratorProps> = ({
  applicationData,
  propertyData,
  onContractGenerated,
  onContractSigned,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contractTerms, setContractTerms] = useState<ContractTerms>({
    startDate: '',
    endDate: '',
    monthlyRent: applicationData.monthlyRent || 0,
    securityDeposit: (applicationData.monthlyRent || 0) * 2,
    utilities: [],
    petPolicy: 'no-pets',
    guestPolicy: 'allowed-with-notice',
    maintenanceResponsibility: 'landlord',
    earlyTerminationClause: true,
    renewalOption: true,
    specialClauses: ''
  });
  const [generatedContract, setGeneratedContract] = useState<any>(null);
  const [signatures, setSignatures] = useState({
    tenant: null as any,
    landlord: null as any
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showSigningDialog, setShowSigningDialog] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const updateContractTerms = (field: keyof ContractTerms, value: any) => {
    setContractTerms(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleUtility = (utility: string) => {
    setContractTerms(prev => ({
      ...prev,
      utilities: prev.utilities.includes(utility)
        ? prev.utilities.filter(u => u !== utility)
        : [...prev.utilities, utility]
    }));
  };

  const generateContract = () => {
    const contractData = {
      id: `contract_${Date.now()}`,
      applicationId: applicationData.id,
      propertyId: propertyData.id,
      tenant: {
        name: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
        email: applicationData.personalInfo.email,
        phone: applicationData.personalInfo.phone
      },
      landlord: {
        name: 'Property Owner', // In real app, would come from property owner data
        email: 'owner@property.com',
        phone: '+52 55 1234 5678'
      },
      property: {
        address: propertyData.location,
        type: propertyData.type,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms
      },
      terms: contractTerms,
      status: 'generated',
      generatedDate: new Date().toISOString(),
      signatures: {
        tenant: null,
        landlord: null
      }
    };

    setGeneratedContract(contractData);
    onContractGenerated(contractData);
    setCurrentStep(2);
    toast.success('Contract generated successfully');
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = (signatureType: 'tenant' | 'landlord') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL();
    const signatureInfo = {
      data: signatureData,
      timestamp: new Date().toISOString(),
      type: signatureType
    };
    
    setSignatures(prev => ({
      ...prev,
      [signatureType]: signatureInfo
    }));
    
    if (generatedContract) {
      const updatedContract = {
        ...generatedContract,
        signatures: {
          ...generatedContract.signatures,
          [signatureType]: signatureInfo
        }
      };
      setGeneratedContract(updatedContract);
      
      // Check if both signatures are complete
      if (signatureType === 'tenant' && signatures.landlord) {
        updatedContract.status = 'fully_signed';
        onContractSigned(updatedContract.id, updatedContract.signatures);
        toast.success('Contract fully signed and executed!');
      } else if (signatureType === 'landlord' && signatures.tenant) {
        updatedContract.status = 'fully_signed';
        onContractSigned(updatedContract.id, updatedContract.signatures);
        toast.success('Contract fully signed and executed!');
      } else {
        updatedContract.status = 'partially_signed';
        toast.success(`Contract signed by ${signatureType}`);
      }
    }
    
    setShowSigningDialog(false);
    clearSignature();
  };

  const downloadContract = () => {
    if (!generatedContract) return;
    
    // In a real app, this would generate a PDF
    const contractText = generateContractText();
    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lease_contract_${generatedContract.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Contract downloaded');
  };

  const generateContractText = () => {
    if (!generatedContract) return '';
    
    return `
RESIDENTIAL LEASE AGREEMENT

Property Address: ${generatedContract.property.address}
Lease Term: ${contractTerms.startDate} to ${contractTerms.endDate}
Monthly Rent: $${contractTerms.monthlyRent.toLocaleString()}
Security Deposit: $${contractTerms.securityDeposit.toLocaleString()}

TENANT INFORMATION:
Name: ${generatedContract.tenant.name}
Email: ${generatedContract.tenant.email}
Phone: ${generatedContract.tenant.phone}

LANDLORD INFORMATION:
Name: ${generatedContract.landlord.name}
Email: ${generatedContract.landlord.email}
Phone: ${generatedContract.landlord.phone}

TERMS AND CONDITIONS:

1. RENT PAYMENT
Tenant agrees to pay monthly rent of $${contractTerms.monthlyRent.toLocaleString()} due on the 1st of each month.

2. SECURITY DEPOSIT
A security deposit of $${contractTerms.securityDeposit.toLocaleString()} is required and will be held for the duration of the lease.

3. UTILITIES
Included utilities: ${contractTerms.utilities.join(', ') || 'None specified'}

4. PET POLICY
${contractTerms.petPolicy === 'no-pets' ? 'No pets allowed' : 'Pets allowed with restrictions'}

5. GUEST POLICY
${contractTerms.guestPolicy === 'allowed-with-notice' ? 'Guests allowed with 24-hour notice' : 'Limited guest policy'}

6. MAINTENANCE
${contractTerms.maintenanceResponsibility === 'landlord' ? 'Landlord responsible for major repairs' : 'Tenant responsible for minor maintenance'}

${contractTerms.specialClauses ? `\n7. SPECIAL CLAUSES\n${contractTerms.specialClauses}` : ''}

Generated on: ${new Date().toLocaleDateString()}
Contract ID: ${generatedContract.id}
    `;
  };

  const renderTermsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Contract Terms</h3>
        <p className="text-gray-600">Configure the lease terms for this rental agreement</p>
      </div>

      {/* Basic Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Lease Period & Rent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Lease Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={contractTerms.startDate}
                onChange={(e) => updateContractTerms('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Lease End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={contractTerms.endDate}
                onChange={(e) => updateContractTerms('endDate', e.target.value)}
                min={contractTerms.startDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyRent">Monthly Rent (MXN)</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={contractTerms.monthlyRent}
                onChange={(e) => updateContractTerms('monthlyRent', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="securityDeposit">Security Deposit (MXN)</Label>
              <Input
                id="securityDeposit"
                type="number"
                value={contractTerms.securityDeposit}
                onChange={(e) => updateContractTerms('securityDeposit', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Utilities */}
      <Card>
        <CardHeader>
          <CardTitle>Included Utilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Water', 'Electricity', 'Gas', 'Internet', 'Cable TV', 'Trash Collection', 'Parking', 'Gym Access'].map((utility) => (
              <div key={utility} className="flex items-center space-x-2">
                <Checkbox
                  id={`utility-${utility}`}
                  checked={contractTerms.utilities.includes(utility)}
                  onCheckedChange={() => toggleUtility(utility)}
                />
                <Label htmlFor={`utility-${utility}`} className="text-sm">{utility}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Property Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="petPolicy">Pet Policy</Label>
              <Select
                value={contractTerms.petPolicy}
                onValueChange={(value) => updateContractTerms('petPolicy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-pets">No pets allowed</SelectItem>
                  <SelectItem value="cats-only">Cats only</SelectItem>
                  <SelectItem value="small-pets">Small pets allowed</SelectItem>
                  <SelectItem value="all-pets">All pets allowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="guestPolicy">Guest Policy</Label>
              <Select
                value={contractTerms.guestPolicy}
                onValueChange={(value) => updateContractTerms('guestPolicy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-guests">No overnight guests</SelectItem>
                  <SelectItem value="limited-guests">Limited overnight guests</SelectItem>
                  <SelectItem value="allowed-with-notice">Guests allowed with notice</SelectItem>
                  <SelectItem value="unrestricted">Unrestricted guest policy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="maintenanceResponsibility">Maintenance Responsibility</Label>
            <Select
              value={contractTerms.maintenanceResponsibility}
              onValueChange={(value) => updateContractTerms('maintenanceResponsibility', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landlord">Landlord handles all maintenance</SelectItem>
                <SelectItem value="shared">Shared responsibility</SelectItem>
                <SelectItem value="tenant-minor">Tenant handles minor repairs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Additional Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="earlyTermination"
                checked={contractTerms.earlyTerminationClause}
                onCheckedChange={(checked) => updateContractTerms('earlyTerminationClause', checked)}
              />
              <Label htmlFor="earlyTermination">Include early termination clause</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="renewalOption"
                checked={contractTerms.renewalOption}
                onCheckedChange={(checked) => updateContractTerms('renewalOption', checked)}
              />
              <Label htmlFor="renewalOption">Include renewal option</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="specialClauses">Special Clauses</Label>
            <Textarea
              id="specialClauses"
              value={contractTerms.specialClauses}
              onChange={(e) => updateContractTerms('specialClauses', e.target.value)}
              placeholder="Any additional terms, restrictions, or special agreements..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => setShowPreview(true)}>
          <Eye className="w-4 h-4 mr-2" />
          Preview Contract
        </Button>
        <Button onClick={generateContract} className="bg-blue-600 hover:bg-blue-700">
          <FileText className="w-4 h-4 mr-2" />
          Generate Contract
        </Button>
      </div>
    </div>
  );

  const renderSigningStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Contract Signing</h3>
        <p className="text-gray-600">Review and sign the lease agreement</p>
      </div>

      {/* Contract Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Contract Status
            </span>
            <Badge className={
              generatedContract?.status === 'fully_signed' 
                ? 'bg-green-100 text-green-800'
                : generatedContract?.status === 'partially_signed'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }>
              {generatedContract?.status?.replace('_', ' ')?.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tenant Signature */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center">
                <User className="w-4 h-4 mr-2" />
                Tenant Signature
              </h4>
              {signatures.tenant ? (
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Signed</span>
                  </div>
                  <img 
                    src={signatures.tenant.data} 
                    alt="Tenant Signature" 
                    className="max-h-16 border rounded"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Signed on {new Date(signatures.tenant.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Awaiting signature</span>
                  </div>
                  <Dialog open={showSigningDialog} onOpenChange={setShowSigningDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Signature className="w-4 h-4 mr-2" />
                        Sign as Tenant
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Digital Signature</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Please sign in the box below using your mouse or touch screen.
                        </p>
                        <div className="border rounded-lg">
                          <canvas
                            ref={canvasRef}
                            width={400}
                            height={200}
                            className="w-full cursor-crosshair"
                            onMouseDown={handleCanvasMouseDown}
                            onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp}
                            onMouseLeave={handleCanvasMouseUp}
                          />
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline" onClick={clearSignature}>
                            Clear
                          </Button>
                          <div className="space-x-2">
                            <Button variant="outline" onClick={() => setShowSigningDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => saveSignature('tenant')}>
                              Save Signature
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            {/* Landlord Signature */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center">
                <Home className="w-4 h-4 mr-2" />
                Landlord Signature
              </h4>
              {signatures.landlord ? (
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Signed</span>
                  </div>
                  <img 
                    src={signatures.landlord.data} 
                    alt="Landlord Signature" 
                    className="max-h-16 border rounded"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Signed on {new Date(signatures.landlord.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Awaiting signature</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setShowSigningDialog(true)}
                  >
                    <Signature className="w-4 h-4 mr-2" />
                    Sign as Landlord
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              View Contract
            </Button>
            <Button variant="outline" onClick={downloadContract}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            {generatedContract?.status === 'fully_signed' && (
              <Button className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Send to All Parties
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contract Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Lease Period</Label>
              <p>{contractTerms.startDate} to {contractTerms.endDate}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Monthly Rent</Label>
              <p className="text-lg font-semibold text-green-600">
                ${contractTerms.monthlyRent.toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Security Deposit</Label>
              <p>${contractTerms.securityDeposit.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Included Utilities</Label>
              <p>{contractTerms.utilities.join(', ') || 'None'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Contract Terms</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Review & Sign</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 ? renderTermsStep() : renderSigningStep()}

      {/* Contract Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
              {generateContractText()}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaseContractGenerator; 