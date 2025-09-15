"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Receipt, 
  Shield, 
  Check, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Download,
  Send,
  Plus,
  Minus,
  Calculator,
  Banknote,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Home,
  Settings,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentProcessingSystemProps {
  userRole: 'tenant' | 'hoster' | 'admin';
  propertyId?: string;
  contractId?: string;
  className?: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet' | 'cash';
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
  lastUsed: string;
  expiryDate?: string;
}

interface Payment {
  id: string;
  type: 'rent' | 'deposit' | 'late_fee' | 'maintenance' | 'utilities' | 'other';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed';
  dueDate: string;
  paidDate?: string;
  method: string;
  description: string;
  propertyName: string;
  tenantName: string;
  reference: string;
  fees: {
    processingFee: number;
    lateFee?: number;
    totalFees: number;
  };
  receipt?: string;
  notes?: string;
}

interface PaymentPlan {
  id: string;
  name: string;
  totalAmount: number;
  installments: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  payments: {
    completed: number;
    remaining: number;
    nextDue: string;
    amount: number;
  };
}

const PaymentProcessingSystem: React.FC<PaymentProcessingSystemProps> = ({
  userRole,
  propertyId,
  contractId,
  className = ''
}) => {
  const [currentView, setCurrentView] = useState<'overview' | 'make_payment' | 'history' | 'methods' | 'plans'>('overview');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    type: 'rent',
    method: '',
    description: '',
    dueDate: '',
    autoPayEnabled: false
  });

  // Mock data
  const mockPayments: Payment[] = [
    {
      id: 'pay_001',
      type: 'rent',
      amount: 12000,
      currency: 'MXN',
      status: 'completed',
      dueDate: '2024-05-01',
      paidDate: '2024-04-30',
      method: 'Credit Card',
      description: 'Monthly rent payment for May 2024',
      propertyName: 'Modern Downtown Apartment',
      tenantName: 'John Doe',
      reference: 'REF-2024-05-001',
      fees: {
        processingFee: 120,
        totalFees: 120
      },
      receipt: 'receipt_may_2024.pdf'
    },
    {
      id: 'pay_002',
      type: 'deposit',
      amount: 24000,
      currency: 'MXN',
      status: 'completed',
      dueDate: '2024-02-15',
      paidDate: '2024-02-14',
      method: 'Bank Transfer',
      description: 'Security deposit',
      propertyName: 'Modern Downtown Apartment',
      tenantName: 'John Doe',
      reference: 'REF-2024-02-002',
      fees: {
        processingFee: 0,
        totalFees: 0
      }
    },
    {
      id: 'pay_003',
      type: 'rent',
      amount: 12000,
      currency: 'MXN',
      status: 'pending',
      dueDate: '2024-06-01',
      method: 'Credit Card',
      description: 'Monthly rent payment for June 2024',
      propertyName: 'Modern Downtown Apartment',
      tenantName: 'John Doe',
      reference: 'REF-2024-06-003',
      fees: {
        processingFee: 120,
        totalFees: 120
      }
    }
  ];

  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: 'method_001',
      type: 'credit_card',
      name: 'Visa ending in 4242',
      details: '**** **** **** 4242',
      isDefault: true,
      isVerified: true,
      lastUsed: '2024-04-30',
      expiryDate: '12/26'
    },
    {
      id: 'method_002',
      type: 'bank_transfer',
      name: 'Banco Santander',
      details: 'Account ending in 7890',
      isDefault: false,
      isVerified: true,
      lastUsed: '2024-02-14'
    }
  ];

  const mockPaymentPlans: PaymentPlan[] = [
    {
      id: 'plan_001',
      name: 'Monthly Rent Auto-Pay',
      totalAmount: 144000,
      installments: 12,
      frequency: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      payments: {
        completed: 4,
        remaining: 8,
        nextDue: '2024-06-01',
        amount: 12000
      }
    }
  ];

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPayments(mockPayments);
      setPaymentMethods(mockPaymentMethods);
      setPaymentPlans(mockPaymentPlans);
    } catch (error) {
      console.error('Error loading payment data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'disputed':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <RefreshCw className="w-4 h-4" />;
      case 'disputed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'rent':
        return <Home className="w-4 h-4" />;
      case 'deposit':
        return <Shield className="w-4 h-4" />;
      case 'late_fee':
        return <AlertCircle className="w-4 h-4" />;
      case 'maintenance':
        return <Settings className="w-4 h-4" />;
      case 'utilities':
        return <Globe className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="w-5 h-5" />;
      case 'bank_transfer':
        return <Banknote className="w-5 h-5" />;
      case 'digital_wallet':
        return <Smartphone className="w-5 h-5" />;
      case 'cash':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const handlePayment = async () => {
    if (!paymentForm.amount || !paymentForm.method) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Simulate payment processing
      toast.info('Processing payment...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newPayment: Payment = {
        id: `pay_${Date.now()}`,
        type: paymentForm.type as any,
        amount: parseFloat(paymentForm.amount),
        currency: 'MXN',
        status: 'completed',
        dueDate: paymentForm.dueDate,
        paidDate: new Date().toISOString().split('T')[0],
        method: paymentForm.method,
        description: paymentForm.description,
        propertyName: 'Modern Downtown Apartment',
        tenantName: 'John Doe',
        reference: `REF-${Date.now()}`,
        fees: {
          processingFee: parseFloat(paymentForm.amount) * 0.01,
          totalFees: parseFloat(paymentForm.amount) * 0.01
        }
      };

      setPayments(prev => [newPayment, ...prev]);
      setShowPaymentForm(false);
      setPaymentForm({
        amount: '',
        type: 'rent',
        method: '',
        description: '',
        dueDate: '',
        autoPayEnabled: false
      });
      
      toast.success('Payment completed successfully!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const renderOverview = () => {
    const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const nextPayment = payments.find(p => p.status === 'pending');

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Methods</p>
                  <p className="text-2xl font-bold text-blue-600">{paymentMethods.length}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-purple-600">{paymentPlans.filter(p => p.status === 'active').length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Payment Due */}
        {nextPayment && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-900">
                <Bell className="w-5 h-5 mr-2" />
                Payment Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-900">{nextPayment.description}</h3>
                  <p className="text-yellow-700">Due: {new Date(nextPayment.dueDate).toLocaleDateString()}</p>
                  <p className="text-2xl font-bold text-yellow-900">${nextPayment.amount.toLocaleString()}</p>
                </div>
                <Button onClick={() => setShowPaymentForm(true)} className="bg-yellow-600 hover:bg-yellow-700">
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getPaymentTypeIcon(payment.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{payment.description}</h4>
                      <p className="text-sm text-gray-600">
                        {payment.paidDate ? `Paid on ${new Date(payment.paidDate).toLocaleDateString()}` : `Due ${new Date(payment.dueDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                    <Badge className={`${getStatusColor(payment.status)} text-xs`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPaymentForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Make a Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="amount">Amount (MXN) *</Label>
            <Input
              id="amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="12000"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Payment Type *</Label>
            <Select
              value={paymentForm.type}
              onValueChange={(value) => setPaymentForm(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">Monthly Rent</SelectItem>
                <SelectItem value="deposit">Security Deposit</SelectItem>
                <SelectItem value="late_fee">Late Fee</SelectItem>
                <SelectItem value="maintenance">Maintenance Fee</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="method">Payment Method *</Label>
          <Select
            value={paymentForm.method}
            onValueChange={(value) => setPaymentForm(prev => ({ ...prev, method: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.name}>
                  <div className="flex items-center space-x-2">
                    {getMethodIcon(method.type)}
                    <span>{method.name}</span>
                    {method.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={paymentForm.description}
            onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Payment description"
          />
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={paymentForm.dueDate}
            onChange={(e) => setPaymentForm(prev => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoPayEnabled"
            checked={paymentForm.autoPayEnabled}
            onCheckedChange={(checked) => setPaymentForm(prev => ({ ...prev, autoPayEnabled: !!checked }))}
          />
          <Label htmlFor="autoPayEnabled">Enable auto-pay for recurring payments</Label>
        </div>

        {/* Payment Summary */}
        {paymentForm.amount && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${parseFloat(paymentForm.amount || '0').toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span>${(parseFloat(paymentForm.amount || '0') * 0.01).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${(parseFloat(paymentForm.amount || '0') * 1.01).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setCurrentView('overview')}>
            Cancel
          </Button>
          <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700">
            <Lock className="w-4 h-4 mr-2" />
            Secure Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Payment Methods</h2>
        <Button onClick={() => setShowAddMethod(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Method
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <Card key={method.id} className={method.isDefault ? 'border-blue-300 bg-blue-50' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getMethodIcon(method.type)}
                  <div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.details}</p>
                  </div>
                </div>
                {method.isDefault && (
                  <Badge className="bg-blue-600">Default</Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={method.isVerified ? 'text-green-600' : 'text-yellow-600'}>
                    {method.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Used:</span>
                  <span>{new Date(method.lastUsed).toLocaleDateString()}</span>
                </div>
                {method.expiryDate && (
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span>{method.expiryDate}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <div className="space-x-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Payment Center</h1>
          <p className="text-gray-600 mt-1">Manage payments, methods, and billing</p>
        </div>
        <Button onClick={() => setShowPaymentForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="py-4">
          <div className="flex space-x-1">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'make_payment', label: 'Make Payment', icon: CreditCard },
              { key: 'history', label: 'History', icon: Receipt },
              { key: 'methods', label: 'Payment Methods', icon: Settings },
              { key: 'plans', label: 'Payment Plans', icon: Calendar }
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
      {currentView === 'overview' && renderOverview()}
      {currentView === 'make_payment' && renderPaymentForm()}
      {currentView === 'methods' && renderPaymentMethods()}

      {/* Payment Form Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
          </DialogHeader>
          {renderPaymentForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentProcessingSystem; 