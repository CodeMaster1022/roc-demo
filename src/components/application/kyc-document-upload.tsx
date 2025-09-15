"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  Check, 
  AlertCircle,
  Download,
  Eye,
  Shield,
  CreditCard,
  User,
  Home,
  Briefcase,
  Camera,
  Scan,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface KYCDocumentUploadProps {
  applicantType: 'tenant' | 'roomie' | 'student';
  onDocumentsChange: (documents: any[]) => void;
  onVerificationComplete: (verificationData: any) => void;
  className?: string;
}

interface KYCDocument {
  id: string;
  type: string;
  category: 'identity' | 'income' | 'address' | 'education' | 'guardian';
  file: File;
  name: string;
  size: number;
  fileType: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'verified' | 'rejected' | 'pending_review';
  url?: string;
  preview?: string;
  verificationResult?: {
    isValid: boolean;
    confidence: number;
    extractedData?: any;
    issues?: string[];
  };
  uploadedAt: string;
}

const KYCDocumentUpload: React.FC<KYCDocumentUploadProps> = ({
  applicantType,
  onDocumentsChange,
  onVerificationComplete,
  className = ''
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<KYCDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'in_progress' | 'completed' | 'failed'>('pending');
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // KYC document requirements based on applicant type
  const getRequiredDocuments = () => {
    const baseDocuments: Array<{
      id: string;
      name: string;
      category: 'identity' | 'income' | 'address' | 'education' | 'guardian';
      description: string;
      required: boolean;
      acceptedTypes: string[];
      maxSize: number;
      verificationFeatures: string[];
    }> = [
      {
        id: 'government_id',
        name: 'Government-issued ID',
        category: 'identity' as const,
        description: 'Passport, National ID, or Driver\'s License',
        required: true,
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        maxSize: 10,
        verificationFeatures: ['face_detection', 'text_extraction', 'document_authenticity']
      },
      {
        id: 'proof_of_income',
        name: 'Proof of Income',
        category: 'income' as const,
        description: 'Recent pay stubs, employment letter, or bank statements',
        required: true,
        acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        maxSize: 15,
        verificationFeatures: ['text_extraction', 'income_validation']
      },
      {
        id: 'address_proof',
        name: 'Proof of Address',
        category: 'address' as const,
        description: 'Utility bill, bank statement, or rental agreement',
        required: true,
        acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        maxSize: 10,
        verificationFeatures: ['address_extraction', 'date_validation']
      },
      {
        id: 'bank_statement',
        name: 'Bank Statement',
        category: 'income' as const,
        description: 'Last 3 months of bank statements',
        required: false,
        acceptedTypes: ['application/pdf'],
        maxSize: 20,
        verificationFeatures: ['transaction_analysis', 'balance_verification']
      }
    ];

    // Add student-specific documents
    if (applicantType === 'student') {
      baseDocuments.push(
        {
          id: 'student_id',
          name: 'Student ID',
          category: 'education' as const,
          description: 'Valid student identification card',
          required: true,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5,
          verificationFeatures: ['student_verification', 'enrollment_status']
        },
        {
          id: 'enrollment_certificate',
          name: 'Enrollment Certificate',
          category: 'education' as const,
          description: 'Official enrollment verification from institution',
          required: true,
          acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          maxSize: 10,
          verificationFeatures: ['institution_verification', 'enrollment_dates']
        },
        {
          id: 'guardian_id',
          name: 'Guardian ID',
          category: 'guardian' as const,
          description: 'Guardian or parent government-issued ID',
          required: true,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 10,
          verificationFeatures: ['face_detection', 'text_extraction']
        },
        {
          id: 'guardian_income',
          name: 'Guardian Income Proof',
          category: 'guardian' as const,
          description: 'Guardian\'s proof of income or financial support letter',
          required: true,
          acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          maxSize: 15,
          verificationFeatures: ['income_validation', 'financial_capacity']
        }
      );
    }

    return baseDocuments;
  };

  const requiredDocuments = getRequiredDocuments();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      // Create document object
      const documentId = `kyc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newDocument: KYCDocument = {
        id: documentId,
        type: '', // Will be set by user
        category: 'identity', // Default category
        file,
        name: file.name,
        size: file.size,
        fileType: file.type,
        uploadProgress: 0,
        status: 'uploading',
        uploadedAt: new Date().toISOString()
      };

      // Add to uploaded documents
      setUploadedDocuments(prev => [...prev, newDocument]);

      // Start upload and verification process
      processDocument(documentId, file);
    });
  };

  const validateFile = (file: File) => {
    // Check file size (max varies by document type)
    const maxSize = 20 * 1024 * 1024; // 20MB max
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than 20MB`
      };
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please upload PDF, JPG, or PNG files.'
      };
    }

    return { isValid: true };
  };

  const processDocument = async (documentId: string, file: File) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, uploadProgress: progress }
            : doc
        )
      );
    }

    // Create preview for images
    let preview: string | undefined;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    // Mark as completed and start verification
    setUploadedDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: 'completed',
              url: URL.createObjectURL(file),
              preview
            }
          : doc
      )
    );

    // Start AI verification process
    setTimeout(() => {
      performAIVerification(documentId);
    }, 1000);

    toast.success(`${file.name} uploaded successfully`);
  };

  const performAIVerification = async (documentId: string) => {
    // Update status to pending review
    setUploadedDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'pending_review' }
          : doc
      )
    );

    // Simulate AI verification process
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock verification results
    const mockResults = {
      government_id: {
        isValid: true,
        confidence: 0.95,
        extractedData: {
          name: 'John Doe',
          idNumber: 'ABC123456789',
          dateOfBirth: '1995-03-15',
          expiryDate: '2028-03-15',
          nationality: 'Mexican'
        },
        issues: []
      },
      proof_of_income: {
        isValid: true,
        confidence: 0.88,
        extractedData: {
          monthlyIncome: 35000,
          employer: 'Tech Solutions Inc.',
          payPeriod: 'Monthly',
          issueDate: '2024-01-15'
        },
        issues: []
      },
      student_id: {
        isValid: true,
        confidence: 0.92,
        extractedData: {
          studentId: 'STU2024001',
          institution: 'Universidad Nacional',
          program: 'Computer Science',
          validUntil: '2025-06-30'
        },
        issues: []
      }
    };

    // Get document type to determine verification result
    const document = uploadedDocuments.find(doc => doc.id === documentId);
    const docType = document?.type || 'government_id';
    const verificationResult = mockResults[docType as keyof typeof mockResults] || mockResults.government_id;

    // Update document with verification results
    setUploadedDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: verificationResult.isValid ? 'verified' : 'rejected',
              verificationResult
            }
          : doc
      )
    );

    if (verificationResult.isValid) {
      toast.success('Document verified successfully');
    } else {
      toast.error('Document verification failed');
    }

    // Check if all required documents are verified
    checkVerificationComplete();
  };

  const checkVerificationComplete = () => {
    const requiredDocs = requiredDocuments.filter(doc => doc.required);
    const verifiedDocs = uploadedDocuments.filter(doc => doc.status === 'verified');
    
    const allRequiredVerified = requiredDocs.every(reqDoc => 
      verifiedDocs.some(verDoc => verDoc.type === reqDoc.id)
    );

    if (allRequiredVerified) {
      setVerificationStatus('completed');
      onVerificationComplete({
        status: 'completed',
        verifiedDocuments: verifiedDocs.length,
        completedAt: new Date().toISOString()
      });
      toast.success('KYC verification completed successfully!');
    }
  };

  const removeDocument = (documentId: string) => {
    setUploadedDocuments(prev => {
      const updated = prev.filter(doc => doc.id !== documentId);
      onDocumentsChange(updated);
      return updated;
    });
    toast.info('Document removed');
  };

  const setDocumentType = (documentId: string, documentType: string) => {
    setUploadedDocuments(prev => {
      const updated = prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              type: documentType,
              category: requiredDocuments.find(rd => rd.id === documentType)?.category || 'identity'
            }
          : doc
      );
      onDocumentsChange(updated);
      return updated;
    });

    // Trigger verification if document type is set
    const document = uploadedDocuments.find(doc => doc.id === documentId);
    if (document && document.status === 'completed') {
      performAIVerification(documentId);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else {
      return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending_review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'uploading':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'identity':
        return <User className="w-4 h-4" />;
      case 'income':
        return <Briefcase className="w-4 h-4" />;
      case 'address':
        return <Home className="w-4 h-4" />;
      case 'education':
        return <FileText className="w-4 h-4" />;
      case 'guardian':
        return <Shield className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentStatus = (docType: string) => {
    const uploaded = uploadedDocuments.find(doc => doc.type === docType);
    if (uploaded) {
      return uploaded.status;
    }
    return 'missing';
  };

  const getVerificationProgress = () => {
    const totalRequired = requiredDocuments.filter(doc => doc.required).length;
    const verified = uploadedDocuments.filter(doc => doc.status === 'verified').length;
    return Math.round((verified / totalRequired) * 100);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* KYC Status Header */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <CardTitle className="text-xl text-purple-900">KYC Verification</CardTitle>
                <p className="text-purple-700">Complete identity verification to proceed with your application</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">{getVerificationProgress()}%</div>
              <p className="text-sm text-purple-600">Complete</p>
            </div>
          </div>
          <Progress value={getVerificationProgress()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Required Documents Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Required Documents
            {applicantType === 'student' && (
              <Badge variant="outline" className="ml-2">Student Verification</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocuments.map((docType) => {
              const status = getDocumentStatus(docType.id);
              const uploadedDoc = uploadedDocuments.find(doc => doc.type === docType.id);
              
              return (
                <div key={docType.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getCategoryIcon(docType.category)}
                      <div>
                        <h4 className="font-medium">{docType.name}</h4>
                        <p className="text-sm text-gray-600">{docType.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Max: {docType.maxSize}MB • {docType.acceptedTypes.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {docType.required && (
                        <Badge variant="outline" className="text-red-600 border-red-300 text-xs">
                          Required
                        </Badge>
                      )}
                      <Badge className={`${getStatusColor(status)} text-xs flex items-center`}>
                        {getStatusIcon(status)}
                        <span className="ml-1 capitalize">
                          {status === 'missing' ? 'Not Uploaded' : status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  {/* Verification Details */}
                  {uploadedDoc?.verificationResult && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Verification Details</span>
                        <span className="text-sm text-gray-600">
                          Confidence: {Math.round((uploadedDoc.verificationResult.confidence || 0) * 100)}%
                        </span>
                      </div>
                      {uploadedDoc.verificationResult.extractedData && (
                        <div className="text-xs text-gray-600 space-y-1">
                          {Object.entries(uploadedDoc.verificationResult.extractedData).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Your Documents</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <Button onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Scan className="w-4 h-4 text-purple-600" />
                <span>AI-powered verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Secure & encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Instant processing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Uploaded Documents
              </span>
              <Badge variant="outline">
                {uploadedDocuments.length} uploaded
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    {getFileIcon(doc.fileType)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium truncate">{doc.name}</h4>
                      <Badge className={`${getStatusColor(doc.status)} text-xs`}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {formatFileSize(doc.size)} • {doc.fileType}
                    </p>
                    
                    {/* Document Type Selector */}
                    {doc.status === 'completed' && !doc.type && (
                      <div className="mt-2">
                        <select
                          value={doc.type}
                          onChange={(e) => setDocumentType(doc.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1 bg-yellow-50 border-yellow-300"
                        >
                          <option value="">⚠️ Select document type</option>
                          {requiredDocuments.map((docType) => (
                            <option key={docType.id} value={docType.id}>
                              {docType.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {doc.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={doc.uploadProgress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {doc.uploadProgress}%
                        </p>
                      </div>
                    )}

                    {/* Verification Progress */}
                    {doc.status === 'pending_review' && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                          <span className="text-sm text-yellow-700">AI verification in progress...</span>
                        </div>
                      </div>
                    )}

                    {/* Verification Results */}
                    {doc.verificationResult && (
                      <div className="mt-2 text-xs">
                        {doc.verificationResult.isValid ? (
                          <div className="text-green-700">
                            ✓ Verified with {Math.round(doc.verificationResult.confidence * 100)}% confidence
                          </div>
                        ) : (
                          <div className="text-red-700">
                            ✗ Verification failed: {doc.verificationResult.issues?.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {doc.preview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(doc.preview!)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Complete Status */}
      {verificationStatus === 'completed' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">KYC Verification Complete!</h4>
                <p className="text-sm text-green-700">
                  All required documents have been verified successfully. You can now proceed with your application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Security & Privacy</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• All documents are encrypted and stored securely</li>
                <li>• AI verification is performed locally for privacy</li>
                <li>• Documents are automatically deleted after verification</li>
                <li>• Your personal information is protected by industry-standard security</li>
                <li>• We comply with data protection regulations (GDPR, CCPA)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {showPreview && (
            <div className="flex justify-center">
              <img 
                src={showPreview} 
                alt="Document preview" 
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KYCDocumentUpload; 