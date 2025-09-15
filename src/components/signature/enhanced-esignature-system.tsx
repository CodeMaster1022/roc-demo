"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Signature, 
  FileText, 
  Send, 
  Eye, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Users,
  Calendar,
  Shield,
  Lock,
  Smartphone,
  Mail,
  Phone,
  Globe,
  Stamp,
  Edit,
  Copy,
  Trash2,
  Plus,
  Settings,
  History,
  Zap,
  RefreshCw,
  Archive,
  Star,
  Bell,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedESignatureSystemProps {
  documentId?: string;
  userRole: 'sender' | 'signer' | 'admin';
  className?: string;
}

interface SignatureRequest {
  id: string;
  documentName: string;
  documentType: 'contract' | 'agreement' | 'form' | 'other';
  status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'expired' | 'declined' | 'cancelled';
  createdDate: string;
  expiryDate: string;
  completedDate?: string;
  sender: {
    name: string;
    email: string;
    organization?: string;
  };
  signers: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
    signedDate?: string;
    signatureData?: string;
    authMethod: 'email' | 'sms' | 'biometric' | 'id_verification';
    ipAddress?: string;
    location?: string;
  }[];
  workflow: {
    type: 'parallel' | 'sequential';
    currentStep: number;
    totalSteps: number;
    reminders: {
      enabled: boolean;
      frequency: 'daily' | 'weekly';
      lastSent?: string;
    };
  };
  security: {
    requireIdVerification: boolean;
    requireBiometric: boolean;
    allowMobile: boolean;
    restrictByIP: boolean;
    allowedIPs?: string[];
    passwordProtected: boolean;
    auditTrail: {
      timestamp: string;
      action: string;
      actor: string;
      details: string;
    }[];
  };
  template?: {
    id: string;
    name: string;
    category: string;
  };
  customFields: {
    [key: string]: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    webhookUrl?: string;
  };
}

interface SignatureTemplate {
  id: string;
  name: string;
  category: 'lease' | 'rental' | 'maintenance' | 'legal' | 'other';
  description: string;
  fields: {
    name: string;
    type: 'text' | 'signature' | 'date' | 'checkbox' | 'dropdown';
    required: boolean;
    placeholder?: string;
    options?: string[];
  }[];
  defaultSigners: {
    role: string;
    authMethod: string;
  }[];
  createdDate: string;
  lastUsed: string;
  usageCount: number;
  isActive: boolean;
}

const EnhancedESignatureSystem: React.FC<EnhancedESignatureSystemProps> = ({
  documentId,
  userRole,
  className = ''
}) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'templates' | 'settings'>('dashboard');
  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>([]);
  const [templates, setTemplates] = useState<SignatureTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<string | null>(null);

  // Mock data
  const mockSignatureRequests: SignatureRequest[] = [
    {
      id: 'sig_req_001',
      documentName: 'Lease Agreement - Modern Downtown Apartment',
      documentType: 'contract',
      status: 'in_progress',
      createdDate: '2024-05-01T10:00:00Z',
      expiryDate: '2024-05-15T23:59:59Z',
      sender: {
        name: 'Property Manager',
        email: 'manager@property.com',
        organization: 'ROC Rentals'
      },
      signers: [
        {
          id: 'signer_001',
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+52 55 1234 5678',
          role: 'Tenant',
          status: 'signed',
          signedDate: '2024-05-02T14:30:00Z',
          authMethod: 'email',
          ipAddress: '192.168.1.1',
          location: 'Mexico City, Mexico'
        },
        {
          id: 'signer_002',
          name: 'Property Owner',
          email: 'owner@property.com',
          role: 'Landlord',
          status: 'pending',
          authMethod: 'email'
        }
      ],
      workflow: {
        type: 'sequential',
        currentStep: 2,
        totalSteps: 2,
        reminders: {
          enabled: true,
          frequency: 'daily',
          lastSent: '2024-05-03T09:00:00Z'
        }
      },
      security: {
        requireIdVerification: false,
        requireBiometric: false,
        allowMobile: true,
        restrictByIP: false,
        passwordProtected: false,
        auditTrail: [
          {
            timestamp: '2024-05-01T10:00:00Z',
            action: 'Document Created',
            actor: 'Property Manager',
            details: 'Lease agreement created and prepared for signing'
          },
          {
            timestamp: '2024-05-01T10:15:00Z',
            action: 'Sent for Signature',
            actor: 'Property Manager',
            details: 'Document sent to John Doe for signature'
          },
          {
            timestamp: '2024-05-02T14:30:00Z',
            action: 'Document Signed',
            actor: 'John Doe',
            details: 'Tenant signature completed'
          }
        ]
      },
      customFields: {
        propertyAddress: 'Av. Insurgentes Sur 1234, Mexico City',
        monthlyRent: '$12,000',
        leaseStartDate: '2024-06-01'
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false
      }
    }
  ];

  const mockTemplates: SignatureTemplate[] = [
    {
      id: 'template_001',
      name: 'Standard Lease Agreement',
      category: 'lease',
      description: 'Standard residential lease agreement template with all required fields',
      fields: [
        { name: 'tenant_name', type: 'text', required: true, placeholder: 'Tenant Full Name' },
        { name: 'property_address', type: 'text', required: true, placeholder: 'Property Address' },
        { name: 'monthly_rent', type: 'text', required: true, placeholder: 'Monthly Rent Amount' },
        { name: 'lease_start', type: 'date', required: true },
        { name: 'lease_end', type: 'date', required: true },
        { name: 'tenant_signature', type: 'signature', required: true },
        { name: 'landlord_signature', type: 'signature', required: true }
      ],
      defaultSigners: [
        { role: 'Tenant', authMethod: 'email' },
        { role: 'Landlord', authMethod: 'email' }
      ],
      createdDate: '2024-01-15T10:00:00Z',
      lastUsed: '2024-05-01T10:00:00Z',
      usageCount: 25,
      isActive: true
    },
    {
      id: 'template_002',
      name: 'Roommate Agreement',
      category: 'rental',
      description: 'Agreement template for roommate arrangements and shared living spaces',
      fields: [
        { name: 'primary_tenant', type: 'text', required: true },
        { name: 'roommate_name', type: 'text', required: true },
        { name: 'room_details', type: 'text', required: true },
        { name: 'monthly_contribution', type: 'text', required: true },
        { name: 'house_rules_agreed', type: 'checkbox', required: true },
        { name: 'primary_signature', type: 'signature', required: true },
        { name: 'roommate_signature', type: 'signature', required: true }
      ],
      defaultSigners: [
        { role: 'Primary Tenant', authMethod: 'email' },
        { role: 'Roommate', authMethod: 'email' }
      ],
      createdDate: '2024-02-01T10:00:00Z',
      lastUsed: '2024-04-20T15:30:00Z',
      usageCount: 12,
      isActive: true
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSignatureRequests(mockSignatureRequests);
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load signature data');
    } finally {
      setLoading(false);
    }
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
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
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
    setCurrentSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL();
    setCurrentSignature(signatureData);
    toast.success('Signature saved successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
      case 'sent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'declined':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <RefreshCw className="w-4 h-4" />;
      case 'pending':
      case 'sent':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <XCircle className="w-4 h-4" />;
      case 'declined':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const renderDashboard = () => {
    const stats = {
      total: signatureRequests.length,
      completed: signatureRequests.filter(r => r.status === 'completed').length,
      pending: signatureRequests.filter(r => r.status === 'in_progress' || r.status === 'sent').length,
      expired: signatureRequests.filter(r => r.status === 'expired').length
    };

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Templates</p>
                  <p className="text-2xl font-bold text-purple-600">{templates.length}</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Signature Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Signature Requests</span>
              <Button size="sm" onClick={() => setCurrentView('create')}>
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signatureRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{request.documentName}</h4>
                      <p className="text-sm text-gray-600">
                        Created {new Date(request.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(request.status)} flex items-center`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Signers</p>
                      <p className="font-medium">{request.signers.length} required</p>
                      <p className="text-sm text-green-600">
                        {request.signers.filter(s => s.status === 'signed').length} signed
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Workflow</p>
                      <p className="font-medium capitalize">{request.workflow.type}</p>
                      <p className="text-sm text-blue-600">
                        Step {request.workflow.currentStep} of {request.workflow.totalSteps}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expires</p>
                      <p className="font-medium">{new Date(request.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowRequestDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    {request.status === 'in_progress' && (
                      <Button variant="outline" size="sm">
                        <Send className="w-4 h-4 mr-1" />
                        Send Reminder
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Signature Templates</h2>
        <Button onClick={() => setShowTemplateEditor(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {template.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Used {template.usageCount} times</p>
                  <p className="text-xs text-gray-500">
                    Last: {new Date(template.lastUsed).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Fields:</span>
                  <span>{template.fields.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Required Signers:</span>
                  <span>{template.defaultSigners.length}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" className="flex-1">
                  <Zap className="w-4 h-4 mr-1" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-Signature Center</h1>
          <p className="text-gray-600 mt-1">Manage digital signatures and document workflows</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setCurrentView('create')}>
          <Plus className="w-4 h-4 mr-2" />
          New Signature Request
        </Button>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex space-x-1">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: FileText },
              { key: 'create', label: 'Create Request', icon: Plus },
              { key: 'templates', label: 'Templates', icon: Star },
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
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'templates' && renderTemplates()}

      {/* Request Details Dialog */}
      <Dialog open={showRequestDetails} onOpenChange={setShowRequestDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Signature Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Header */}
              <div className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-xl font-semibold">{selectedRequest.documentName}</h3>
                  <p className="text-gray-600">Request ID: {selectedRequest.id}</p>
                </div>
                <Badge className={`${getStatusColor(selectedRequest.status)} text-lg px-3 py-1`}>
                  {getStatusIcon(selectedRequest.status)}
                  <span className="ml-2 capitalize">{selectedRequest.status.replace('_', ' ')}</span>
                </Badge>
              </div>

              {/* Signers Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Signers ({selectedRequest.signers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedRequest.signers.map((signer, index) => (
                      <div key={signer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{signer.name}</h4>
                            <p className="text-sm text-gray-600">{signer.email}</p>
                            <p className="text-sm text-gray-500">{signer.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(signer.status)}>
                            {signer.status}
                          </Badge>
                          {signer.signedDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Signed {new Date(signer.signedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audit Trail */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedRequest.security.auditTrail.map((entry, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">{entry.action}</p>
                          <p className="text-sm text-gray-600">{entry.details}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()} • {entry.actor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Digital Signature Canvas Dialog */}
      <Dialog open={!!currentSignature} onOpenChange={() => setCurrentSignature(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Digital Signature</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please sign in the box below using your mouse or touch screen.
            </p>
            <div className="border rounded-lg bg-white">
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
                <Button variant="outline" onClick={() => setCurrentSignature(null)}>
                  Cancel
                </Button>
                <Button onClick={saveSignature}>
                  Save Signature
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedESignatureSystem; 