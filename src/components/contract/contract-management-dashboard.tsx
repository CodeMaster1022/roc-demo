"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  Send, 
  Calendar, 
  DollarSign, 
  User, 
  Home, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Signature,
  Archive,
  RefreshCw,
  TrendingUp,
  Users,
  Bell,
  Settings,
  MoreHorizontal,
  Copy,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface ContractManagementDashboardProps {
  hosterId: string;
  className?: string;
}

interface Contract {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  roomNumber?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'draft' | 'sent' | 'partially_signed' | 'fully_signed' | 'active' | 'expired' | 'terminated' | 'renewed';
  createdDate: string;
  signedDate?: string;
  lastModified: string;
  renewalDate?: string;
  terminationNotice?: string;
  documents: {
    contract: string;
    addendums: string[];
    receipts: string[];
  };
  payments: {
    totalPaid: number;
    lastPayment: string;
    nextDue: string;
    status: 'current' | 'late' | 'overdue';
  };
  signatures: {
    tenant: boolean;
    landlord: boolean;
    witnesses?: string[];
  };
  notes: string;
  autoRenew: boolean;
  reminders: {
    renewalReminder: boolean;
    paymentReminder: boolean;
    inspectionReminder: boolean;
  };
}

const ContractManagementDashboard: React.FC<ContractManagementDashboardProps> = ({
  hosterId,
  className = ''
}) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractDetails, setShowContractDetails] = useState(false);

  // Mock contracts data
  const mockContracts: Contract[] = [
    {
      id: 'contract_001',
      propertyId: 'prop_001',
      propertyName: 'Modern Downtown Apartment',
      propertyAddress: 'Av. Insurgentes Sur 1234, Mexico City',
      tenantName: 'John Doe',
      tenantEmail: 'john.doe@email.com',
      tenantPhone: '+52 55 1234 5678',
      roomNumber: 'Master Bedroom',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      monthlyRent: 12000,
      securityDeposit: 24000,
      status: 'active',
      createdDate: '2024-02-15T10:00:00Z',
      signedDate: '2024-02-20T14:30:00Z',
      lastModified: '2024-02-20T14:30:00Z',
      renewalDate: '2025-01-01',
      documents: {
        contract: 'lease_contract_001.pdf',
        addendums: ['pet_addendum.pdf'],
        receipts: ['receipt_march_2024.pdf', 'receipt_april_2024.pdf']
      },
      payments: {
        totalPaid: 48000,
        lastPayment: '2024-04-01',
        nextDue: '2024-05-01',
        status: 'current'
      },
      signatures: {
        tenant: true,
        landlord: true,
        witnesses: ['witness_1', 'witness_2']
      },
      notes: 'Excellent tenant, always pays on time. Pet approved.',
      autoRenew: true,
      reminders: {
        renewalReminder: true,
        paymentReminder: false,
        inspectionReminder: true
      }
    },
    {
      id: 'contract_002',
      propertyId: 'prop_002',
      propertyName: 'Cozy Student House Near UNAM',
      propertyAddress: 'Calle Universidad 567, Mexico City',
      tenantName: 'Maria Garcia',
      tenantEmail: 'maria.garcia@email.com',
      tenantPhone: '+52 55 9876 5432',
      roomNumber: 'Room A',
      startDate: '2024-01-15',
      endDate: '2024-07-14',
      monthlyRent: 4500,
      securityDeposit: 9000,
      status: 'partially_signed',
      createdDate: '2024-01-01T09:00:00Z',
      lastModified: '2024-01-10T16:45:00Z',
      documents: {
        contract: 'lease_contract_002.pdf',
        addendums: [],
        receipts: ['receipt_jan_2024.pdf', 'receipt_feb_2024.pdf']
      },
      payments: {
        totalPaid: 13500,
        lastPayment: '2024-03-15',
        nextDue: '2024-04-15',
        status: 'late'
      },
      signatures: {
        tenant: true,
        landlord: false
      },
      notes: 'Student tenant, guardian co-signed. Needs landlord signature.',
      autoRenew: false,
      reminders: {
        renewalReminder: false,
        paymentReminder: true,
        inspectionReminder: false
      }
    },
    {
      id: 'contract_003',
      propertyId: 'prop_003',
      propertyName: 'Luxury Condo Polanco',
      propertyAddress: 'Av. Presidente Masaryk 456, Mexico City',
      tenantName: 'Carlos Rodriguez',
      tenantEmail: 'carlos.rodriguez@email.com',
      tenantPhone: '+52 55 5555 7777',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      monthlyRent: 25000,
      securityDeposit: 50000,
      status: 'expired',
      createdDate: '2023-05-15T11:00:00Z',
      signedDate: '2023-05-25T10:15:00Z',
      lastModified: '2024-05-31T23:59:59Z',
      renewalDate: '2024-04-01',
      terminationNotice: '2024-04-15',
      documents: {
        contract: 'lease_contract_003.pdf',
        addendums: ['parking_addendum.pdf', 'gym_access.pdf'],
        receipts: ['receipt_may_2024.pdf']
      },
      payments: {
        totalPaid: 300000,
        lastPayment: '2024-05-01',
        nextDue: 'N/A',
        status: 'current'
      },
      signatures: {
        tenant: true,
        landlord: true
      },
      notes: 'Contract expired, tenant moved out. Property available for new lease.',
      autoRenew: false,
      reminders: {
        renewalReminder: false,
        paymentReminder: false,
        inspectionReminder: false
      }
    }
  ];

  useEffect(() => {
    loadContracts();
  }, [hosterId]);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchQuery, statusFilter]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContracts(mockContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const filterContracts = () => {
    let filtered = [...contracts];

    if (searchQuery) {
      filtered = filtered.filter(contract =>
        contract.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    setFilteredContracts(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'partially_signed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'fully_signed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'terminated':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'renewed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'partially_signed':
        return <Signature className="w-4 h-4" />;
      case 'fully_signed':
        return <CheckCircle className="w-4 h-4" />;
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'expired':
        return <XCircle className="w-4 h-4" />;
      case 'terminated':
        return <AlertCircle className="w-4 h-4" />;
      case 'renewed':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  const handleContractAction = (contractId: string, action: string) => {
    switch (action) {
      case 'view':
        const contract = contracts.find(c => c.id === contractId);
        setSelectedContract(contract || null);
        setShowContractDetails(true);
        break;
      case 'download':
        toast.success('Contract downloaded successfully');
        break;
      case 'send':
        toast.success('Contract sent to tenant');
        break;
      case 'renew':
        toast.info('Contract renewal process started');
        break;
      case 'terminate':
        toast.warning('Contract termination initiated');
        break;
      default:
        break;
    }
  };

  const getContractStats = () => {
    const total = contracts.length;
    const active = contracts.filter(c => c.status === 'active').length;
    const expiringSoon = contracts.filter(c => {
      const endDate = new Date(c.endDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length;
    const pendingSignature = contracts.filter(c => c.status === 'partially_signed' || c.status === 'sent').length;

    return { total, active, expiringSoon, pendingSignature };
  };

  const stats = getContractStats();

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
          <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-600 mt-1">Manage all your lease agreements and contracts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contracts</p>
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
                <p className="text-sm font-medium text-gray-600">Active Contracts</p>
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
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Signature</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingSignature}</p>
              </div>
              <Signature className="w-8 h-8 text-orange-600" />
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
                  placeholder="Search contracts by tenant, property, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="partially_signed">Partially Signed</SelectItem>
                  <SelectItem value="fully_signed">Fully Signed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold">{contract.propertyName}</h3>
                    <Badge className={`${getStatusColor(contract.status)} flex items-center`}>
                      {getStatusIcon(contract.status)}
                      <span className="ml-1 capitalize">{contract.status.replace('_', ' ')}</span>
                    </Badge>
                    {contract.autoRenew && (
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        Auto-Renew
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tenant</p>
                      <p className="font-medium">{contract.tenantName}</p>
                      <p className="text-gray-500">{contract.tenantEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Lease Period</p>
                      <p className="font-medium">
                        {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                      </p>
                      {contract.roomNumber && (
                        <p className="text-gray-500">{contract.roomNumber}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600">Monthly Rent</p>
                      <p className="font-medium text-green-600">
                        ${contract.monthlyRent.toLocaleString()}
                      </p>
                      <p className={`text-sm ${getPaymentStatusColor(contract.payments.status)}`}>
                        Payment: {contract.payments.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Next Due</p>
                      <p className="font-medium">
                        {contract.payments.nextDue !== 'N/A' 
                          ? new Date(contract.payments.nextDue).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                      <p className="text-gray-500 text-sm">
                        Total Paid: ${contract.payments.totalPaid.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Signature Status */}
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Tenant:</span>
                      {contract.signatures.tenant ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Landlord:</span>
                      {contract.signatures.landlord ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {contract.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{contract.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContractAction(contract.id, 'view')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContractAction(contract.id, 'download')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  {contract.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContractAction(contract.id, 'renew')}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Renew
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contract Details Dialog */}
      <Dialog open={showContractDetails} onOpenChange={setShowContractDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              {/* Contract Header */}
              <div className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-xl font-semibold">{selectedContract.propertyName}</h3>
                  <p className="text-gray-600">{selectedContract.propertyAddress}</p>
                  <p className="text-sm text-gray-500">Contract ID: {selectedContract.id}</p>
                </div>
                <Badge className={`${getStatusColor(selectedContract.status)} text-lg px-3 py-1`}>
                  {getStatusIcon(selectedContract.status)}
                  <span className="ml-2 capitalize">{selectedContract.status.replace('_', ' ')}</span>
                </Badge>
              </div>

              {/* Contract Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Tenant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedContract.tenantName}</p>
                      <p><strong>Email:</strong> {selectedContract.tenantEmail}</p>
                      <p><strong>Phone:</strong> {selectedContract.tenantPhone}</p>
                      {selectedContract.roomNumber && (
                        <p><strong>Room:</strong> {selectedContract.roomNumber}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Financial Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Monthly Rent:</strong> ${selectedContract.monthlyRent.toLocaleString()}</p>
                      <p><strong>Security Deposit:</strong> ${selectedContract.securityDeposit.toLocaleString()}</p>
                      <p><strong>Total Paid:</strong> ${selectedContract.payments.totalPaid.toLocaleString()}</p>
                      <p><strong>Payment Status:</strong> 
                        <span className={getPaymentStatusColor(selectedContract.payments.status)}>
                          {' '}{selectedContract.payments.status}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Lease Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Start Date:</strong> {new Date(selectedContract.startDate).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {new Date(selectedContract.endDate).toLocaleDateString()}</p>
                      <p><strong>Created:</strong> {new Date(selectedContract.createdDate).toLocaleDateString()}</p>
                      {selectedContract.signedDate && (
                        <p><strong>Signed:</strong> {new Date(selectedContract.signedDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Contract:</strong> {selectedContract.documents.contract}</p>
                      <p><strong>Addendums:</strong> {selectedContract.documents.addendums.length}</p>
                      <p><strong>Receipts:</strong> {selectedContract.documents.receipts.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Contract
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Tenant
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractManagementDashboard; 