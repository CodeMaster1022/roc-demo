"use client";

import React, { useState, useEffect } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search,
  Filter,
  Eye,
  Check,
  X,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Camera,
  FileText,
  Shield,
  Flag,
  MessageSquare,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Activity,
  Settings,
  Download,
  Send,
  Archive,
  RefreshCw,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  ChevronLeft,
  Upload,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface PropertyApprovalWorkflowProps {
  className?: string;
}

interface PropertySubmission {
  id: string;
  propertyName: string;
  propertyType: 'apartment' | 'house' | 'room' | 'studio' | 'shared_space';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };
  hoster: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    verificationStatus: 'verified' | 'pending' | 'rejected';
    rating: number;
    totalProperties: number;
    joinDate: string;
  };
  pricing: {
    monthlyRent: number;
    securityDeposit: number;
    utilities: string[];
    currency: string;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    furnished: boolean;
    petPolicy: string;
    smokingPolicy: string;
    description: string;
    amenities: string[];
    rules: string[];
  };
  photos: {
    id: string;
    url: string;
    caption: string;
    isPrimary: boolean;
    uploadDate: string;
  }[];
  documents: {
    propertyOwnership: boolean;
    identityVerification: boolean;
    taxDocuments: boolean;
    insuranceDocuments: boolean;
    safetyCompliance: boolean;
  };
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_changes' | 'suspended';
  submissionDate: string;
  lastUpdated: string;
  reviewHistory: {
    id: string;
    reviewerId: string;
    reviewerName: string;
    action: string;
    comments: string;
    timestamp: string;
    criteria: {
      [key: string]: {
        status: 'pass' | 'fail' | 'warning';
        comments?: string;
      };
    };
  }[];
  flags: {
    type: 'safety' | 'legal' | 'quality' | 'pricing' | 'content';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    reportedBy: string;
    reportedDate: string;
    resolved: boolean;
  }[];
  analytics: {
    views: number;
    inquiries: number;
    applications: number;
    avgResponseTime: number;
    completionRate: number;
  };
  compliance: {
    legalRequirements: boolean;
    safetyStandards: boolean;
    qualityStandards: boolean;
    pricingGuidelines: boolean;
    contentGuidelines: boolean;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedReviewer?: string;
  estimatedReviewTime: string;
  autoFlags: string[];
}

const PropertyApprovalWorkflow: React.FC<PropertyApprovalWorkflowProps> = ({
  className = ''
}) => {
  const [properties, setProperties] = useState<PropertySubmission[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<PropertySubmission | null>(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [reviewForm, setReviewForm] = useState({
    action: '',
    comments: '',
    criteria: {} as { [key: string]: { status: 'pass' | 'fail' | 'warning'; comments?: string } },
    requiresChanges: [] as string[],
    followUpDate: ''
  });

  // Mock property submissions data
  const mockPropertySubmissions: PropertySubmission[] = [
    {
      id: 'prop_sub_001',
      propertyName: 'Modern Downtown Loft',
      propertyType: 'apartment',
      address: {
        street: 'Av. Insurgentes Sur 1234',
        city: 'Mexico City',
        state: 'CDMX',
        zipCode: '03100',
        coordinates: { lat: 19.4326, lng: -99.1332 }
      },
      hoster: {
        id: 'host_001',
        name: 'Carlos Martinez',
        email: 'carlos.martinez@email.com',
        phone: '+52 55 1234 5678',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verificationStatus: 'verified',
        rating: 4.8,
        totalProperties: 3,
        joinDate: '2023-01-15'
      },
      pricing: {
        monthlyRent: 15000,
        securityDeposit: 30000,
        utilities: ['Water', 'Internet', 'Gym Access'],
        currency: 'MXN'
      },
      details: {
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        furnished: true,
        petPolicy: 'Small pets allowed',
        smokingPolicy: 'No smoking',
        description: 'Beautiful modern loft in the heart of downtown with amazing city views and premium amenities.',
        amenities: ['Gym', 'Pool', 'Concierge', 'Parking', 'Rooftop Terrace'],
        rules: ['No loud music after 10 PM', 'No smoking indoors', 'Visitors must be registered']
      },
      photos: [
        {
          id: 'photo_001',
          url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
          caption: 'Living Room',
          isPrimary: true,
          uploadDate: '2024-05-01T10:00:00Z'
        },
        {
          id: 'photo_002',
          url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
          caption: 'Kitchen',
          isPrimary: false,
          uploadDate: '2024-05-01T10:05:00Z'
        }
      ],
      documents: {
        propertyOwnership: true,
        identityVerification: true,
        taxDocuments: true,
        insuranceDocuments: false,
        safetyCompliance: true
      },
      status: 'under_review',
      submissionDate: '2024-05-01T09:00:00Z',
      lastUpdated: '2024-05-02T14:30:00Z',
      reviewHistory: [
        {
          id: 'review_001',
          reviewerId: 'admin_001',
          reviewerName: 'Admin User',
          action: 'Started Review',
          comments: 'Initial review started. Checking all documents and compliance.',
          timestamp: '2024-05-02T09:00:00Z',
          criteria: {
            'documentation': { status: 'pass', comments: 'All required documents provided' },
            'photos': { status: 'pass', comments: 'High quality photos, good coverage' },
            'pricing': { status: 'warning', comments: 'Pricing is slightly above market rate' },
            'description': { status: 'pass', comments: 'Clear and accurate description' }
          }
        }
      ],
      flags: [],
      analytics: {
        views: 0,
        inquiries: 0,
        applications: 0,
        avgResponseTime: 0,
        completionRate: 0
      },
      compliance: {
        legalRequirements: true,
        safetyStandards: true,
        qualityStandards: true,
        pricingGuidelines: false,
        contentGuidelines: true
      },
      priority: 'medium',
      assignedReviewer: 'admin_001',
      estimatedReviewTime: '2-3 business days',
      autoFlags: ['pricing_above_market']
    },
    {
      id: 'prop_sub_002',
      propertyName: 'Student Room Near UNAM',
      propertyType: 'room',
      address: {
        street: 'Calle Universidad 567',
        city: 'Mexico City',
        state: 'CDMX',
        zipCode: '04510',
        coordinates: { lat: 19.3319, lng: -99.1847 }
      },
      hoster: {
        id: 'host_002',
        name: 'Ana Rodriguez',
        email: 'ana.rodriguez@email.com',
        phone: '+52 55 9876 5432',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verificationStatus: 'pending',
        rating: 0,
        totalProperties: 1,
        joinDate: '2024-04-20'
      },
      pricing: {
        monthlyRent: 4500,
        securityDeposit: 9000,
        utilities: ['Water', 'Internet'],
        currency: 'MXN'
      },
      details: {
        bedrooms: 1,
        bathrooms: 1,
        area: 20,
        furnished: true,
        petPolicy: 'No pets',
        smokingPolicy: 'No smoking',
        description: 'Cozy room perfect for students, close to UNAM campus with all necessary amenities.',
        amenities: ['Study Area', 'Shared Kitchen', 'Laundry'],
        rules: ['Quiet hours 10 PM - 7 AM', 'No guests after 11 PM', 'Clean common areas after use']
      },
      photos: [
        {
          id: 'photo_003',
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          caption: 'Bedroom',
          isPrimary: true,
          uploadDate: '2024-04-25T15:00:00Z'
        }
      ],
      documents: {
        propertyOwnership: true,
        identityVerification: false,
        taxDocuments: false,
        insuranceDocuments: false,
        safetyCompliance: true
      },
      status: 'requires_changes',
      submissionDate: '2024-04-25T14:00:00Z',
      lastUpdated: '2024-04-26T10:15:00Z',
      reviewHistory: [
        {
          id: 'review_002',
          reviewerId: 'admin_002',
          reviewerName: 'Review Admin',
          action: 'Requested Changes',
          comments: 'Missing required documentation. Please provide identity verification and tax documents.',
          timestamp: '2024-04-26T10:15:00Z',
          criteria: {
            'documentation': { status: 'fail', comments: 'Missing identity verification and tax documents' },
            'photos': { status: 'warning', comments: 'Need more photos of common areas' },
            'pricing': { status: 'pass', comments: 'Competitive pricing for student housing' },
            'description': { status: 'pass', comments: 'Good description for target audience' }
          }
        }
      ],
      flags: [
        {
          type: 'legal',
          severity: 'high',
          description: 'Missing required documentation',
          reportedBy: 'system',
          reportedDate: '2024-04-26T10:15:00Z',
          resolved: false
        }
      ],
      analytics: {
        views: 0,
        inquiries: 0,
        applications: 0,
        avgResponseTime: 0,
        completionRate: 0
      },
      compliance: {
        legalRequirements: false,
        safetyStandards: true,
        qualityStandards: false,
        pricingGuidelines: true,
        contentGuidelines: true
      },
      priority: 'high',
      assignedReviewer: 'admin_002',
      estimatedReviewTime: '1-2 business days',
      autoFlags: ['missing_documents', 'new_host']
    }
  ];

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchQuery, statusFilter, priorityFilter]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProperties(mockPropertySubmissions);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.hoster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(property => property.priority === priorityFilter);
    }

    setFilteredProperties(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'requires_changes':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'suspended':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'under_review':
        return <Eye className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'requires_changes':
        return <AlertTriangle className="w-4 h-4" />;
      case 'suspended':
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePropertyAction = (propertyId: string, action: string, comments?: string) => {
    setProperties(prev => prev.map(property => 
      property.id === propertyId 
        ? {
            ...property,
            status: action as any,
            lastUpdated: new Date().toISOString(),
            reviewHistory: [
              ...property.reviewHistory,
              {
                id: `review_${Date.now()}`,
                reviewerId: 'current_admin',
                reviewerName: 'Current Admin',
                action: action,
                comments: comments || '',
                timestamp: new Date().toISOString(),
                criteria: reviewForm.criteria
              }
            ]
          }
        : property
    ));

    toast.success(`Property ${action} successfully`);
    setShowPropertyDetails(false);
    setReviewForm({
      action: '',
      comments: '',
      criteria: {},
      requiresChanges: [],
      followUpDate: ''
    });
  };

  const handleBulkAction = (action: string) => {
    selectedProperties.forEach(propertyId => {
      handlePropertyAction(propertyId, action);
    });
    setSelectedProperties([]);
    setShowBulkActions(false);
    toast.success(`Bulk action ${action} applied to ${selectedProperties.length} properties`);
  };

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const getComplianceScore = (property: PropertySubmission) => {
    const compliance = property.compliance;
    const total = Object.keys(compliance).length;
    const passed = Object.values(compliance).filter(Boolean).length;
    return Math.round((passed / total) * 100);
  };

  const renderPropertyCard = (property: PropertySubmission) => {
    const complianceScore = getComplianceScore(property);
    const hasFlags = property.flags.length > 0;
    const criticalFlags = property.flags.filter(f => f.severity === 'critical').length;

    return (
      <Card key={property.id} className={`hover:shadow-lg transition-shadow ${hasFlags ? 'border-orange-200' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={selectedProperties.includes(property.id)}
                onCheckedChange={() => togglePropertySelection(property.id)}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold">{property.propertyName}</h3>
                  <Badge className={getPriorityColor(property.priority)}>
                    {property.priority.toUpperCase()}
                  </Badge>
                  {hasFlags && (
                    <Badge className="bg-red-100 text-red-800">
                      <Flag className="w-3 h-3 mr-1" />
                      {property.flags.length} Flag{property.flags.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address.street}, {property.address.city}
                </p>
                <p className="text-sm text-gray-500">ID: {property.id}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${getStatusColor(property.status)} mb-2 flex items-center w-fit ml-auto`}>
                {getStatusIcon(property.status)}
                <span className="ml-1 capitalize">{property.status.replace('_', ' ')}</span>
              </Badge>
              <p className="text-sm text-gray-600">
                Submitted {new Date(property.submissionDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Hoster</p>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={property.hoster.profileImage} />
                  <AvatarFallback>{property.hoster.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{property.hoster.name}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{property.hoster.rating || 'New'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Property Type</p>
              <p className="font-medium capitalize">{property.propertyType.replace('_', ' ')}</p>
              <p className="text-sm text-gray-500">
                {property.details.bedrooms}BR • {property.details.bathrooms}BA • {property.details.area}m²
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Monthly Rent</p>
              <p className="font-medium text-green-600">
                ${property.pricing.monthlyRent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Deposit: ${property.pricing.securityDeposit.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Compliance Score</p>
              <div className="flex items-center space-x-2">
                <div className={`text-lg font-bold ${complianceScore >= 80 ? 'text-green-600' : complianceScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {complianceScore}%
                </div>
                {complianceScore >= 80 && <CheckCircle className="w-4 h-4 text-green-600" />}
                {complianceScore < 60 && <AlertTriangle className="w-4 h-4 text-red-600" />}
              </div>
            </div>
          </div>

          {/* Auto Flags */}
          {property.autoFlags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Auto-detected Issues:</p>
              <div className="flex flex-wrap gap-1">
                {property.autoFlags.map((flag, index) => (
                  <Badge key={index} variant="outline" className="text-orange-700 border-orange-300 text-xs">
                    {flag.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Critical Flags Alert */}
          {criticalFlags > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm font-medium text-red-800">
                  {criticalFlags} Critical Issue{criticalFlags > 1 ? 's' : ''} Require Immediate Attention
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Camera className="w-4 h-4" />
                <span>{property.photos.length} photos</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{Object.values(property.documents).filter(Boolean).length}/5 docs</span>
              </div>
              {property.assignedReviewer && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Assigned</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProperty(property);
                  setShowPropertyDetails(true);
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Review
              </Button>
              
              {property.status === 'under_review' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-300 hover:bg-green-50"
                    onClick={() => handlePropertyAction(property.id, 'approved', 'Quick approval')}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handlePropertyAction(property.id, 'rejected', 'Quick rejection')}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPropertyDetails = () => {
    if (!selectedProperty) return null;

    const complianceScore = getComplianceScore(selectedProperty);

    return (
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Property Header */}
        <div className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
          <div>
            <h2 className="text-2xl font-semibold">{selectedProperty.propertyName}</h2>
            <p className="text-gray-600">{selectedProperty.address.street}, {selectedProperty.address.city}</p>
            <p className="text-sm text-gray-500">Property ID: {selectedProperty.id}</p>
          </div>
          <div className="text-right">
            <Badge className={`${getStatusColor(selectedProperty.status)} text-lg px-3 py-1 mb-2`}>
              {getStatusIcon(selectedProperty.status)}
              <span className="ml-2 capitalize">{selectedProperty.status.replace('_', ' ')}</span>
            </Badge>
            <p className="text-sm text-gray-600">
              Priority: <span className="font-medium capitalize">{selectedProperty.priority}</span>
            </p>
          </div>
        </div>

        {/* Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Compliance Overview ({complianceScore}%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedProperty.compliance).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {value ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hoster Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Hoster Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={selectedProperty.hoster.profileImage} />
                <AvatarFallback>{selectedProperty.hoster.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{selectedProperty.hoster.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="flex items-center"><Mail className="w-4 h-4 mr-1" />{selectedProperty.hoster.email}</p>
                    <p className="flex items-center"><Phone className="w-4 h-4 mr-1" />{selectedProperty.hoster.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Info</p>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{selectedProperty.hoster.rating || 'No rating'}</span>
                    </div>
                    <p className="text-sm">Total Properties: {selectedProperty.hoster.totalProperties}</p>
                    <p className="text-sm">Member since: {new Date(selectedProperty.hoster.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <Badge className={
                selectedProperty.hoster.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                selectedProperty.hoster.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {selectedProperty.hoster.verificationStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{selectedProperty.propertyType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bedrooms:</span>
                    <span>{selectedProperty.details.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bathrooms:</span>
                    <span>{selectedProperty.details.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Area:</span>
                    <span>{selectedProperty.details.area} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Furnished:</span>
                    <span>{selectedProperty.details.furnished ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly Rent:</span>
                    <span className="font-medium text-green-600">
                      ${selectedProperty.pricing.monthlyRent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span>${selectedProperty.pricing.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilities Included:</span>
                    <span>{selectedProperty.pricing.utilities.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="font-semibold mb-3">Description</h4>
              <p className="text-sm text-gray-700">{selectedProperty.details.description}</p>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedProperty.details.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">House Rules</h4>
                <ul className="text-sm space-y-1">
                  {selectedProperty.details.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Photos ({selectedProperty.photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedProperty.photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {photo.isPrimary && (
                    <Badge className="absolute top-2 left-2 bg-blue-600">
                      Primary
                    </Badge>
                  )}
                  <p className="text-xs text-gray-600 mt-1">{photo.caption}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedProperty.documents).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {value ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flags and Issues */}
        {selectedProperty.flags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <Flag className="w-5 h-5 mr-2" />
                Flags and Issues ({selectedProperty.flags.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedProperty.flags.map((flag, index) => (
                  <div key={index} className={`p-3 border rounded-lg ${
                    flag.severity === 'critical' ? 'border-red-300 bg-red-50' :
                    flag.severity === 'high' ? 'border-orange-300 bg-orange-50' :
                    'border-yellow-300 bg-yellow-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge className={
                          flag.severity === 'critical' ? 'bg-red-600' :
                          flag.severity === 'high' ? 'bg-orange-600' :
                          'bg-yellow-600'
                        }>
                          {flag.severity.toUpperCase()}
                        </Badge>
                        <span className="ml-2 font-medium capitalize">{flag.type}</span>
                      </div>
                      <Badge variant={flag.resolved ? 'default' : 'outline'}>
                        {flag.resolved ? 'Resolved' : 'Open'}
                      </Badge>
                    </div>
                    <p className="text-sm">{flag.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reported by {flag.reportedBy} on {new Date(flag.reportedDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Review History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProperty.reviewHistory.map((review) => (
                <div key={review.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{review.action}</h4>
                      <p className="text-sm text-gray-600">by {review.reviewerName}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.comments}</p>
                  
                  {Object.keys(review.criteria).length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Review Criteria:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(review.criteria).map(([key, criteria]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{key.replace('_', ' ')}</span>
                            <Badge className={
                              criteria.status === 'pass' ? 'bg-green-100 text-green-800' :
                              criteria.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {criteria.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Review Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Review Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="action">Action</Label>
                <Select
                  value={reviewForm.action}
                  onValueChange={(value) => setReviewForm(prev => ({ ...prev, action: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve Property</SelectItem>
                    <SelectItem value="rejected">Reject Property</SelectItem>
                    <SelectItem value="requires_changes">Request Changes</SelectItem>
                    <SelectItem value="suspended">Suspend Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={reviewForm.comments}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Add your review comments..."
                  rows={4}
                />
              </div>

              {reviewForm.action === 'requires_changes' && (
                <div>
                  <Label>Required Changes</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {[
                      'Update photos',
                      'Provide missing documents',
                      'Revise description',
                      'Adjust pricing',
                      'Add safety compliance',
                      'Update property details'
                    ].map((change) => (
                      <div key={change} className="flex items-center space-x-2">
                        <Checkbox
                          id={`change-${change}`}
                          checked={reviewForm.requiresChanges.includes(change)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setReviewForm(prev => ({
                                ...prev,
                                requiresChanges: [...prev.requiresChanges, change]
                              }));
                            } else {
                              setReviewForm(prev => ({
                                ...prev,
                                requiresChanges: prev.requiresChanges.filter(c => c !== change)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`change-${change}`} className="text-sm">{change}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowPropertyDetails(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handlePropertyAction(selectedProperty.id, reviewForm.action, reviewForm.comments)}
                  disabled={!reviewForm.action || !reviewForm.comments}
                  className={
                    reviewForm.action === 'approved' ? 'bg-green-600 hover:bg-green-700' :
                    reviewForm.action === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }
                >
                  {reviewForm.action === 'approved' && <Check className="w-4 h-4 mr-2" />}
                  {reviewForm.action === 'rejected' && <X className="w-4 h-4 mr-2" />}
                  {reviewForm.action === 'requires_changes' && <AlertTriangle className="w-4 h-4 mr-2" />}
                  {reviewForm.action === 'suspended' && <Archive className="w-4 h-4 mr-2" />}
                  Submit Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Property Approval Workflow</h1>
          <p className="text-gray-600 mt-1">Review and manage property submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedProperties.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowBulkActions(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Bulk Actions ({selectedProperties.length})
            </Button>
          )}
          <Button onClick={() => loadProperties()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {properties.filter(p => p.status === 'under_review').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">
                  {properties.filter(p => p.flags.length > 0).length}
                </p>
              </div>
              <Flag className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by property name, hoster, address, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="requires_changes">Requires Changes</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <div className="space-y-4">
        {filteredProperties.map(renderPropertyCard)}
      </div>

      {/* Property Details Dialog */}
      <Dialog open={showPropertyDetails} onOpenChange={setShowPropertyDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Property Review</DialogTitle>
          </DialogHeader>
          {renderPropertyDetails()}
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Apply action to {selectedProperties.length} selected properties:</p>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleBulkAction('approved')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve All
              </Button>
              <Button
                onClick={() => handleBulkAction('rejected')}
                className="bg-red-600 hover:bg-red-700"
              >
                <X className="w-4 h-4 mr-2" />
                Reject All
              </Button>
              <Button
                onClick={() => handleBulkAction('requires_changes')}
                variant="outline"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Request Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyApprovalWorkflow; 