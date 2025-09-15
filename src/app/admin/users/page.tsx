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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Home,
  Building,
  GraduationCap,
  Briefcase,
  Settings,
  MoreHorizontal,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface UserAccount {
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
  accountInfo: {
    userType: 'tenant' | 'roomie' | 'hoster' | 'admin';
    status: 'active' | 'pending' | 'suspended' | 'banned' | 'inactive';
    emailVerified: boolean;
    phoneVerified: boolean;
    kycStatus: 'verified' | 'pending' | 'rejected' | 'not_submitted';
    joinDate: string;
    lastLogin: string;
    loginCount: number;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  businessInfo?: {
    totalProperties: number;
    totalRevenue: number;
    averageRating: number;
    totalTenants: number;
  };
  activity: {
    totalApplications: number;
    totalBookings: number;
    totalReviews: number;
    averageRating: number;
    flaggedReports: number;
    resolvedIssues: number;
  };
  security: {
    twoFactorEnabled: boolean;
    suspiciousActivity: boolean;
    lastPasswordChange: string;
    failedLoginAttempts: number;
  };
  notes: string;
  tags: string[];
}

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [actionForm, setActionForm] = useState({
    action: '',
    reason: '',
    notes: ''
  });

  // Mock users data
  const mockUsers: UserAccount[] = [
    {
      id: 'user_001',
      personalInfo: {
        firstName: 'Juan',
        lastName: 'Rodriguez',
        email: 'juan.rodriguez@email.com',
        phone: '+52 55 1234 5678',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        dateOfBirth: '1990-03-15',
        nationality: 'Mexican'
      },
      accountInfo: {
        userType: 'tenant',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        kycStatus: 'verified',
        joinDate: '2024-01-15',
        lastLogin: '2024-05-10T14:30:00Z',
        loginCount: 145
      },
      address: {
        street: 'Calle Insurgentes 456',
        city: 'Mexico City',
        state: 'CDMX',
        country: 'Mexico'
      },
      activity: {
        totalApplications: 8,
        totalBookings: 3,
        totalReviews: 12,
        averageRating: 4.7,
        flaggedReports: 0,
        resolvedIssues: 2
      },
      security: {
        twoFactorEnabled: true,
        suspiciousActivity: false,
        lastPasswordChange: '2024-03-01',
        failedLoginAttempts: 0
      },
      notes: 'Excellent tenant with great payment history.',
      tags: ['verified', 'reliable']
    },
    {
      id: 'user_002',
      personalInfo: {
        firstName: 'Ana',
        lastName: 'Lopez',
        email: 'ana.lopez@student.unam.mx',
        phone: '+52 55 9876 5432',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        dateOfBirth: '2002-11-03',
        nationality: 'Mexican'
      },
      accountInfo: {
        userType: 'roomie',
        status: 'active',
        emailVerified: true,
        phoneVerified: false,
        kycStatus: 'pending',
        joinDate: '2024-02-10',
        lastLogin: '2024-05-09T16:45:00Z',
        loginCount: 67
      },
      address: {
        street: 'Ciudad Universitaria',
        city: 'Mexico City',
        state: 'CDMX',
        country: 'Mexico'
      },
      activity: {
        totalApplications: 5,
        totalBookings: 1,
        totalReviews: 3,
        averageRating: 4.2,
        flaggedReports: 0,
        resolvedIssues: 1
      },
      security: {
        twoFactorEnabled: false,
        suspiciousActivity: false,
        lastPasswordChange: '2024-02-10',
        failedLoginAttempts: 1
      },
      notes: 'Student user, guardian co-signed. KYC pending verification.',
      tags: ['student', 'kyc_pending']
    },
    {
      id: 'user_003',
      personalInfo: {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@email.com',
        phone: '+52 55 5555 7777',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        dateOfBirth: '1985-05-15',
        nationality: 'Mexican'
      },
      accountInfo: {
        userType: 'hoster',
        status: 'active',
        emailVerified: true,
        phoneVerified: true,
        kycStatus: 'verified',
        joinDate: '2023-06-01',
        lastLogin: '2024-05-10T09:20:00Z',
        loginCount: 289
      },
      address: {
        street: 'Av. Reforma 123',
        city: 'Mexico City',
        state: 'CDMX',
        country: 'Mexico'
      },
      businessInfo: {
        totalProperties: 4,
        totalRevenue: 450000,
        averageRating: 4.8,
        totalTenants: 12
      },
      activity: {
        totalApplications: 0,
        totalBookings: 0,
        totalReviews: 24,
        averageRating: 4.8,
        flaggedReports: 1,
        resolvedIssues: 8
      },
      security: {
        twoFactorEnabled: true,
        suspiciousActivity: false,
        lastPasswordChange: '2024-04-15',
        failedLoginAttempts: 0
      },
      notes: 'Top-performing hoster with excellent properties and tenant satisfaction.',
      tags: ['verified', 'top_hoster', 'premium']
    },
    {
      id: 'user_004',
      personalInfo: {
        firstName: 'Carlos',
        lastName: 'Martinez',
        email: 'carlos.martinez@email.com',
        phone: '+52 55 1111 2222',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        dateOfBirth: '1988-09-20',
        nationality: 'Mexican'
      },
      accountInfo: {
        userType: 'tenant',
        status: 'suspended',
        emailVerified: true,
        phoneVerified: true,
        kycStatus: 'verified',
        joinDate: '2023-12-01',
        lastLogin: '2024-04-20T11:15:00Z',
        loginCount: 78
      },
      address: {
        street: 'Av. Polanco 789',
        city: 'Mexico City',
        state: 'CDMX',
        country: 'Mexico'
      },
      activity: {
        totalApplications: 12,
        totalBookings: 2,
        totalReviews: 8,
        averageRating: 3.1,
        flaggedReports: 3,
        resolvedIssues: 1
      },
      security: {
        twoFactorEnabled: false,
        suspiciousActivity: true,
        lastPasswordChange: '2023-12-01',
        failedLoginAttempts: 5
      },
      notes: 'Suspended due to multiple complaints from hosters. Under review.',
      tags: ['suspended', 'under_review', 'complaints']
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, userTypeFilter, statusFilter, kycFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(user =>
        `${user.personalInfo.firstName} ${user.personalInfo.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(user => user.accountInfo.userType === userTypeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.accountInfo.status === statusFilter);
    }

    if (kycFilter !== 'all') {
      filtered = filtered.filter(user => user.accountInfo.kycStatus === kycFilter);
    }

    setFilteredUsers(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'suspended':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'banned':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'not_submitted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'tenant':
        return <User className="w-4 h-4" />;
      case 'roomie':
        return <GraduationCap className="w-4 h-4" />;
      case 'hoster':
        return <Building className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const handleUserAction = (userId: string, action: string, reason?: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? {
            ...user,
            accountInfo: {
              ...user.accountInfo,
              status: action === 'activate' ? 'active' : 
                     action === 'suspend' ? 'suspended' : 
                     action === 'ban' ? 'banned' : user.accountInfo.status
            },
            notes: reason ? `${user.notes}\n[${new Date().toLocaleDateString()}] Admin action: ${action} - ${reason}` : user.notes
          }
        : user
    ));

    toast.success(`User ${action} successfully`);
  };

  const handleBulkAction = (action: string) => {
    selectedUsers.forEach(userId => {
      handleUserAction(userId, action, actionForm.reason);
    });
    setSelectedUsers([]);
    setShowBulkActions(false);
    setActionForm({ action: '', reason: '', notes: '' });
    toast.success(`Bulk action ${action} applied to ${selectedUsers.length} users`);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.accountInfo.status === 'active').length;
    const pending = users.filter(u => u.accountInfo.status === 'pending').length;
    const suspended = users.filter(u => u.accountInfo.status === 'suspended').length;
    const kycPending = users.filter(u => u.accountInfo.kycStatus === 'pending').length;

    return { total, active, pending, suspended, kycPending };
  };

  const stats = getUserStats();

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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all platform users and their accounts</p>
          </div>
          <div className="flex items-center space-x-3">
            {selectedUsers.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowBulkActions(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Bulk Actions ({selectedUsers.length})
              </Button>
            )}
            <Button onClick={loadUsers} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
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
                  <p className="text-sm font-medium text-gray-600">Suspended</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.suspended}</p>
                </div>
                <Ban className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">KYC Pending</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.kycPending}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users by name, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="tenant">Tenants</SelectItem>
                    <SelectItem value="roomie">Roomies</SelectItem>
                    <SelectItem value="hoster">Hosters</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={kycFilter} onValueChange={setKycFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="KYC Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All KYC</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="not_submitted">Not Submitted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                    
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.personalInfo.profileImage} />
                      <AvatarFallback>
                        {user.personalInfo.firstName[0]}{user.personalInfo.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {user.personalInfo.firstName} {user.personalInfo.lastName}
                        </h3>
                        <Badge className={`${getStatusColor(user.accountInfo.status)} flex items-center`}>
                          {getUserTypeIcon(user.accountInfo.userType)}
                          <span className="ml-1 capitalize">{user.accountInfo.userType}</span>
                        </Badge>
                        <Badge className={getKycStatusColor(user.accountInfo.kycStatus)}>
                          KYC: {user.accountInfo.kycStatus.replace('_', ' ')}
                        </Badge>
                        {user.security.suspiciousActivity && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Suspicious
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Contact</p>
                          <p className="font-medium">{user.personalInfo.email}</p>
                          <p className="text-gray-500">{user.personalInfo.phone}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Account</p>
                          <p className="font-medium">Joined {new Date(user.accountInfo.joinDate).toLocaleDateString()}</p>
                          <p className="text-gray-500">
                            Last login: {new Date(user.accountInfo.lastLogin).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Activity</p>
                          <p className="font-medium">{user.activity.totalApplications} applications</p>
                          <p className="text-gray-500">
                            Rating: {user.activity.averageRating > 0 ? user.activity.averageRating : 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Security</p>
                          <p className="font-medium">
                            2FA: {user.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </p>
                          <p className="text-gray-500">
                            Failed logins: {user.security.failedLoginAttempts}
                          </p>
                        </div>
                      </div>

                      {/* Business Info for Hosters */}
                      {user.businessInfo && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-2">Business Performance</p>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-blue-700">Properties: {user.businessInfo.totalProperties}</p>
                            </div>
                            <div>
                              <p className="text-blue-700">Revenue: ${user.businessInfo.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-blue-700">Rating: {user.businessInfo.averageRating}/5.0</p>
                            </div>
                            <div>
                              <p className="text-blue-700">Tenants: {user.businessInfo.totalTenants}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Flags and Issues */}
                      {(user.activity.flaggedReports > 0 || user.security.suspiciousActivity) && (
                        <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm font-medium text-red-900 mb-2">Issues & Flags</p>
                          <div className="flex items-center space-x-4 text-sm text-red-700">
                            {user.activity.flaggedReports > 0 && (
                              <span>{user.activity.flaggedReports} flagged reports</span>
                            )}
                            {user.security.suspiciousActivity && (
                              <span>Suspicious activity detected</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {user.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {user.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {user.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Notes:</strong> {user.notes.split('\n')[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    
                    {user.accountInfo.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        onClick={() => handleUserAction(user.id, 'suspend', 'Manual suspension')}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Suspend
                      </Button>
                    ) : user.accountInfo.status === 'suspended' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-300 hover:bg-green-50"
                        onClick={() => handleUserAction(user.id, 'activate', 'Manual activation')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    ) : null}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Opening message interface...')}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Details Dialog */}
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* User Header */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedUser.personalInfo.profileImage} />
                    <AvatarFallback>
                      {selectedUser.personalInfo.firstName[0]}{selectedUser.personalInfo.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">
                      {selectedUser.personalInfo.firstName} {selectedUser.personalInfo.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedUser.personalInfo.email}</p>
                    <p className="text-gray-600">{selectedUser.personalInfo.phone}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`${getStatusColor(selectedUser.accountInfo.status)} text-lg px-3 py-1`}>
                        {getUserTypeIcon(selectedUser.accountInfo.userType)}
                        <span className="ml-2 capitalize">{selectedUser.accountInfo.userType}</span>
                      </Badge>
                      <Badge className={getKycStatusColor(selectedUser.accountInfo.kycStatus)}>
                        KYC: {selectedUser.accountInfo.kycStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Date of Birth:</strong> {new Date(selectedUser.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                        <p><strong>Nationality:</strong> {selectedUser.personalInfo.nationality}</p>
                        {selectedUser.address && (
                          <>
                            <p><strong>Address:</strong></p>
                            <p className="text-sm text-gray-600 ml-4">
                              {selectedUser.address.street}<br/>
                              {selectedUser.address.city}, {selectedUser.address.state}<br/>
                              {selectedUser.address.country}
                            </p>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Join Date:</strong> {new Date(selectedUser.accountInfo.joinDate).toLocaleDateString()}</p>
                        <p><strong>Last Login:</strong> {new Date(selectedUser.accountInfo.lastLogin).toLocaleDateString()}</p>
                        <p><strong>Login Count:</strong> {selectedUser.accountInfo.loginCount}</p>
                        <p><strong>Email Verified:</strong> {selectedUser.accountInfo.emailVerified ? 'Yes' : 'No'}</p>
                        <p><strong>Phone Verified:</strong> {selectedUser.accountInfo.phoneVerified ? 'Yes' : 'No'}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="w-5 h-5 mr-2" />
                        Activity & Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Total Applications:</strong> {selectedUser.activity.totalApplications}</p>
                        <p><strong>Total Bookings:</strong> {selectedUser.activity.totalBookings}</p>
                        <p><strong>Total Reviews:</strong> {selectedUser.activity.totalReviews}</p>
                        <p><strong>Average Rating:</strong> {selectedUser.activity.averageRating}/5.0</p>
                        <p><strong>Flagged Reports:</strong> {selectedUser.activity.flaggedReports}</p>
                        <p><strong>Resolved Issues:</strong> {selectedUser.activity.resolvedIssues}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Security Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Two-Factor Auth:</strong> {selectedUser.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                        <p><strong>Suspicious Activity:</strong> {selectedUser.security.suspiciousActivity ? 'Yes' : 'No'}</p>
                        <p><strong>Last Password Change:</strong> {new Date(selectedUser.security.lastPasswordChange).toLocaleDateString()}</p>
                        <p><strong>Failed Login Attempts:</strong> {selectedUser.security.failedLoginAttempts}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Business Info for Hosters */}
                {selectedUser.businessInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        Business Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Properties</p>
                          <p className="text-2xl font-bold">{selectedUser.businessInfo.totalProperties}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${selectedUser.businessInfo.totalRevenue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Average Rating</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {selectedUser.businessInfo.averageRating}/5.0
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Tenants</p>
                          <p className="text-2xl font-bold text-blue-600">{selectedUser.businessInfo.totalTenants}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {selectedUser.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-gray-700">{selectedUser.notes}</div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </Button>
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  {selectedUser.accountInfo.status === 'active' ? (
                    <Button 
                      variant="outline" 
                      className="text-orange-600 border-orange-300"
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'suspend', 'Suspended from admin panel');
                        setShowUserDetails(false);
                      }}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend User
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="text-green-600 border-green-300"
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'activate', 'Activated from admin panel');
                        setShowUserDetails(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate User
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Bulk Actions Dialog */}
        <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Actions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Apply action to {selectedUsers.length} selected users:</p>
              
              <div>
                <label className="text-sm font-medium">Action</label>
                <Select
                  value={actionForm.action}
                  onValueChange={(value) => setActionForm(prev => ({ ...prev, action: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activate">Activate Users</SelectItem>
                    <SelectItem value="suspend">Suspend Users</SelectItem>
                    <SelectItem value="ban">Ban Users</SelectItem>
                    <SelectItem value="verify_kyc">Verify KYC</SelectItem>
                    <SelectItem value="reject_kyc">Reject KYC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  value={actionForm.reason}
                  onChange={(e) => setActionForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Provide a reason for this action..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowBulkActions(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleBulkAction(actionForm.action)}
                  disabled={!actionForm.action || !actionForm.reason}
                >
                  Apply Action
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default withAuth(AdminUsersPage, { 
  allowedUserTypes: ['admin'] 
}); 