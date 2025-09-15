"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/contexts/auth-context';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Home,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  FileText,
  Settings,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Tenant {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string;
    dateOfBirth: string;
    nationality: string;
  };
  propertyInfo: {
    propertyId: string;
    propertyName: string;
    propertyAddress: string;
    roomNumber?: string;
    monthlyRent: number;
    securityDeposit: number;
  };
  leaseInfo: {
    startDate: string;
    endDate: string;
    contractId: string;
    status: 'active' | 'ending_soon' | 'expired' | 'terminated' | 'pending_renewal';
    autoRenew: boolean;
  };
  paymentInfo: {
    totalPaid: number;
    lastPayment: string;
    nextDue: string;
    paymentStatus: 'current' | 'late' | 'overdue';
    paymentMethod: string;
  };
  communication: {
    lastContact: string;
    totalMessages: number;
    responseRate: number;
    preferredMethod: 'email' | 'phone' | 'app';
  };
  rating: {
    overall: number;
    cleanliness: number;
    communication: number;
    reliability: number;
    reviewCount: number;
  };
  issues: {
    maintenanceRequests: number;
    complaints: number;
    violations: number;
    resolved: number;
  };
  joinDate: string;
  notes: string;
}

const TenantsPage: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showTenantDetails, setShowTenantDetails] = useState(false);

  // Mock tenants data
  const mockTenants: Tenant[] = [
    {
      id: 'tenant_001',
      personalInfo: {
        firstName: 'Juan',
        lastName: 'Rodriguez',
        email: 'juan.rodriguez@email.com',
        phone: '+52 55 1234 5678',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        dateOfBirth: '1990-03-15',
        nationality: 'Mexican'
      },
      propertyInfo: {
        propertyId: 'prop_001',
        propertyName: 'Modern Downtown Apartment',
        propertyAddress: 'Av. Insurgentes Sur 1234, Mexico City',
        roomNumber: 'Master Bedroom',
        monthlyRent: 12000,
        securityDeposit: 24000
      },
      leaseInfo: {
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        contractId: 'contract_001',
        status: 'active',
        autoRenew: true
      },
      paymentInfo: {
        totalPaid: 48000,
        lastPayment: '2024-04-01',
        nextDue: '2024-05-01',
        paymentStatus: 'current',
        paymentMethod: 'Credit Card'
      },
      communication: {
        lastContact: '2024-04-20',
        totalMessages: 45,
        responseRate: 92,
        preferredMethod: 'app'
      },
      rating: {
        overall: 4.8,
        cleanliness: 5.0,
        communication: 4.5,
        reliability: 5.0,
        reviewCount: 8
      },
      issues: {
        maintenanceRequests: 3,
        complaints: 0,
        violations: 0,
        resolved: 3
      },
      joinDate: '2024-01-15',
      notes: 'Excellent tenant, always pays on time and keeps the property in great condition.'
    },
    {
      id: 'tenant_002',
      personalInfo: {
        firstName: 'Ana',
        lastName: 'Lopez',
        email: 'ana.lopez@student.unam.mx',
        phone: '+52 55 9876 5432',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        dateOfBirth: '2002-11-03',
        nationality: 'Mexican'
      },
      propertyInfo: {
        propertyId: 'prop_002',
        propertyName: 'Student House Near UNAM',
        propertyAddress: 'Calle Universidad 567, Mexico City',
        roomNumber: 'Room A',
        monthlyRent: 4500,
        securityDeposit: 9000
      },
      leaseInfo: {
        startDate: '2024-02-01',
        endDate: '2024-07-31',
        contractId: 'contract_002',
        status: 'ending_soon',
        autoRenew: false
      },
      paymentInfo: {
        totalPaid: 13500,
        lastPayment: '2024-04-01',
        nextDue: '2024-05-01',
        paymentStatus: 'current',
        paymentMethod: 'Bank Transfer'
      },
      communication: {
        lastContact: '2024-04-18',
        totalMessages: 23,
        responseRate: 87,
        preferredMethod: 'email'
      },
      rating: {
        overall: 4.2,
        cleanliness: 4.0,
        communication: 4.5,
        reliability: 4.0,
        reviewCount: 3
      },
      issues: {
        maintenanceRequests: 1,
        complaints: 1,
        violations: 0,
        resolved: 2
      },
      joinDate: '2024-02-01',
      notes: 'Student tenant with guardian co-signer. Generally responsible but lease ending soon.'
    },
    {
      id: 'tenant_003',
      personalInfo: {
        firstName: 'Carlos',
        lastName: 'Martinez',
        email: 'carlos.martinez@email.com',
        phone: '+52 55 5555 7777',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        dateOfBirth: '1985-07-22',
        nationality: 'Mexican'
      },
      propertyInfo: {
        propertyId: 'prop_003',
        propertyName: 'Luxury Condo Polanco',
        propertyAddress: 'Av. Presidente Masaryk 456, Mexico City',
        monthlyRent: 25000,
        securityDeposit: 50000
      },
      leaseInfo: {
        startDate: '2023-06-01',
        endDate: '2024-05-31',
        contractId: 'contract_003',
        status: 'expired',
        autoRenew: false
      },
      paymentInfo: {
        totalPaid: 300000,
        lastPayment: '2024-05-01',
        nextDue: 'N/A',
        paymentStatus: 'current',
        paymentMethod: 'Bank Transfer'
      },
      communication: {
        lastContact: '2024-05-15',
        totalMessages: 67,
        responseRate: 95,
        preferredMethod: 'phone'
      },
      rating: {
        overall: 4.9,
        cleanliness: 5.0,
        communication: 5.0,
        reliability: 4.8,
        reviewCount: 12
      },
      issues: {
        maintenanceRequests: 5,
        complaints: 0,
        violations: 0,
        resolved: 5
      },
      joinDate: '2023-06-01',
      notes: 'Former tenant, excellent track record. Moved out due to job relocation.'
    }
  ];

  useEffect(() => {
    loadTenants();
  }, []);

  useEffect(() => {
    filterTenants();
  }, [tenants, searchQuery, statusFilter, propertyFilter]);

  const loadTenants = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTenants(mockTenants);
    } catch (error) {
      console.error('Error loading tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const filterTenants = () => {
    let filtered = [...tenants];

    if (searchQuery) {
      filtered = filtered.filter(tenant =>
        `${tenant.personalInfo.firstName} ${tenant.personalInfo.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.propertyInfo.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.leaseInfo.status === statusFilter);
    }

    if (propertyFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.propertyInfo.propertyId === propertyFilter);
    }

    setFilteredTenants(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'ending_soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'terminated':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'pending_renewal':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'ending_soon':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <XCircle className="w-4 h-4" />;
      case 'terminated':
        return <AlertTriangle className="w-4 h-4" />;
      case 'pending_renewal':
        return <Calendar className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'text-green-600';
      case 'late':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleTenantAction = (tenantId: string, action: string) => {
    switch (action) {
      case 'view':
        const tenant = tenants.find(t => t.id === tenantId);
        setSelectedTenant(tenant || null);
        setShowTenantDetails(true);
        break;
      case 'message':
        toast.info('Opening messaging interface...');
        break;
      case 'call':
        toast.info('Initiating call...');
        break;
      case 'email':
        toast.info('Opening email client...');
        break;
      default:
        break;
    }
  };

  const getTenantStats = () => {
    const total = tenants.length;
    const active = tenants.filter(t => t.leaseInfo.status === 'active').length;
    const endingSoon = tenants.filter(t => t.leaseInfo.status === 'ending_soon').length;
    const expired = tenants.filter(t => t.leaseInfo.status === 'expired').length;

    return { total, active, endingSoon, expired };
  };

  const stats = getTenantStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
            <p className="text-gray-600 mt-1">Manage your current and past tenants</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Leases</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ending Soon</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.endingSoon}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Past Tenants</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.expired}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tenants by name, email, or property..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="ending_soon">Ending Soon</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                    <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="prop_001">Modern Downtown Apartment</SelectItem>
                    <SelectItem value="prop_002">Student House Near UNAM</SelectItem>
                    <SelectItem value="prop_003">Luxury Condo Polanco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenants List */}
        <div className="space-y-4">
          {filteredTenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={tenant.personalInfo.profileImage} />
                      <AvatarFallback>
                        {tenant.personalInfo.firstName[0]}{tenant.personalInfo.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {tenant.personalInfo.firstName} {tenant.personalInfo.lastName}
                        </h3>
                        <Badge className={`${getStatusColor(tenant.leaseInfo.status)} flex items-center`}>
                          {getStatusIcon(tenant.leaseInfo.status)}
                          <span className="ml-1 capitalize">{tenant.leaseInfo.status.replace('_', ' ')}</span>
                        </Badge>
                        {tenant.leaseInfo.autoRenew && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            Auto-Renew
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Property</p>
                          <p className="font-medium">{tenant.propertyInfo.propertyName}</p>
                          <p className="text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {tenant.propertyInfo.roomNumber || 'Full Property'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Lease Period</p>
                          <p className="font-medium">
                            {new Date(tenant.leaseInfo.startDate).toLocaleDateString()} - {new Date(tenant.leaseInfo.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            Contract: {tenant.leaseInfo.contractId}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Monthly Rent</p>
                          <p className="font-medium text-green-600">
                            ${tenant.propertyInfo.monthlyRent.toLocaleString()}
                          </p>
                          <p className={`text-sm ${getPaymentStatusColor(tenant.paymentInfo.paymentStatus)}`}>
                            Payment: {tenant.paymentInfo.paymentStatus}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Rating</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{tenant.rating.overall}</span>
                            <span className="text-gray-500">({tenant.rating.reviewCount})</span>
                          </div>
                          <p className="text-gray-500 text-sm">
                            {tenant.communication.responseRate}% response rate
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{tenant.personalInfo.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{tenant.personalInfo.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(tenant.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Issues Summary */}
                      {(tenant.issues.maintenanceRequests > 0 || tenant.issues.complaints > 0 || tenant.issues.violations > 0) && (
                        <div className="mt-3 flex items-center space-x-4 text-sm">
                          {tenant.issues.maintenanceRequests > 0 && (
                            <span className="text-blue-600">
                              {tenant.issues.maintenanceRequests} maintenance requests
                            </span>
                          )}
                          {tenant.issues.complaints > 0 && (
                            <span className="text-yellow-600">
                              {tenant.issues.complaints} complaints
                            </span>
                          )}
                          {tenant.issues.violations > 0 && (
                            <span className="text-red-600">
                              {tenant.issues.violations} violations
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTenantAction(tenant.id, 'view')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTenantAction(tenant.id, 'message')}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTenantAction(tenant.id, 'call')}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tenant Details Dialog */}
        <Dialog open={showTenantDetails} onOpenChange={setShowTenantDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tenant Details</DialogTitle>
            </DialogHeader>
            {selectedTenant && (
              <div className="space-y-6">
                {/* Tenant Header */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedTenant.personalInfo.profileImage} />
                    <AvatarFallback>
                      {selectedTenant.personalInfo.firstName[0]}{selectedTenant.personalInfo.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">
                      {selectedTenant.personalInfo.firstName} {selectedTenant.personalInfo.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedTenant.personalInfo.email}</p>
                    <p className="text-gray-600">{selectedTenant.personalInfo.phone}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`${getStatusColor(selectedTenant.leaseInfo.status)} text-lg px-3 py-1`}>
                        {getStatusIcon(selectedTenant.leaseInfo.status)}
                        <span className="ml-2 capitalize">{selectedTenant.leaseInfo.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Home className="w-5 h-5 mr-2" />
                        Property Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Property:</strong> {selectedTenant.propertyInfo.propertyName}</p>
                        <p><strong>Address:</strong> {selectedTenant.propertyInfo.propertyAddress}</p>
                        {selectedTenant.propertyInfo.roomNumber && (
                          <p><strong>Room:</strong> {selectedTenant.propertyInfo.roomNumber}</p>
                        )}
                        <p><strong>Monthly Rent:</strong> ${selectedTenant.propertyInfo.monthlyRent.toLocaleString()}</p>
                        <p><strong>Security Deposit:</strong> ${selectedTenant.propertyInfo.securityDeposit.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Lease Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Start Date:</strong> {new Date(selectedTenant.leaseInfo.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(selectedTenant.leaseInfo.endDate).toLocaleDateString()}</p>
                        <p><strong>Contract ID:</strong> {selectedTenant.leaseInfo.contractId}</p>
                        <p><strong>Auto-Renew:</strong> {selectedTenant.leaseInfo.autoRenew ? 'Yes' : 'No'}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Total Paid:</strong> ${selectedTenant.paymentInfo.totalPaid.toLocaleString()}</p>
                        <p><strong>Last Payment:</strong> {new Date(selectedTenant.paymentInfo.lastPayment).toLocaleDateString()}</p>
                        <p><strong>Next Due:</strong> {selectedTenant.paymentInfo.nextDue !== 'N/A' ? new Date(selectedTenant.paymentInfo.nextDue).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Payment Status:</strong> 
                          <span className={getPaymentStatusColor(selectedTenant.paymentInfo.paymentStatus)}>
                            {' '}{selectedTenant.paymentInfo.paymentStatus}
                          </span>
                        </p>
                        <p><strong>Payment Method:</strong> {selectedTenant.paymentInfo.paymentMethod}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="w-5 h-5 mr-2" />
                        Rating & Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Overall Rating:</strong> {selectedTenant.rating.overall}/5.0 ({selectedTenant.rating.reviewCount} reviews)</p>
                        <p><strong>Cleanliness:</strong> {selectedTenant.rating.cleanliness}/5.0</p>
                        <p><strong>Communication:</strong> {selectedTenant.rating.communication}/5.0</p>
                        <p><strong>Reliability:</strong> {selectedTenant.rating.reliability}/5.0</p>
                        <p><strong>Response Rate:</strong> {selectedTenant.communication.responseRate}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Notes */}
                {selectedTenant.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{selectedTenant.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Contract
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default withAuth(TenantsPage, { 
  allowedUserTypes: ['hoster'] 
}); 