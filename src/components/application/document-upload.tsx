"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  Check, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadProps {
  requiredDocuments: {
    id: string;
    name: string;
    description: string;
    required: boolean;
    acceptedTypes: string[];
    maxSize: number; // in MB
  }[];
  onDocumentsChange: (documents: any[]) => void;
  className?: string;
}

interface UploadedDocument {
  id: string;
  documentType: string;
  file: File;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  preview?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  requiredDocuments,
  onDocumentsChange,
  className = ''
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newDocument: UploadedDocument = {
        id: documentId,
        documentType: '', // Will be set by user
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: 'uploading'
      };

      // Add to uploaded documents
      setUploadedDocuments(prev => [...prev, newDocument]);

      // Simulate upload progress
      simulateUpload(documentId, file);
    });
  };

  const validateFile = (file: File) => {
    // Check file size (max 10MB for most documents, 20MB for images)
    const maxSize = file.type.startsWith('image/') ? 20 : 10;
    if (file.size > maxSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSize}MB`
      };
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please upload PDF, DOC, DOCX, or image files.'
      };
    }

    return { isValid: true };
  };

  const simulateUpload = async (documentId: string, file: File) => {
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

    // Mark as completed
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

    toast.success(`${file.name} uploaded successfully`);
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
          ? { ...doc, documentType }
          : doc
      );
      onDocumentsChange(updated);
      return updated;
    });
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentStatus = (docType: string) => {
    const uploaded = uploadedDocuments.find(doc => doc.documentType === docType);
    if (uploaded && uploaded.status === 'completed') {
      return 'completed';
    } else if (uploaded && uploaded.status === 'uploading') {
      return 'uploading';
    }
    return 'missing';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'uploading':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-300';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Required Documents Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requiredDocuments.map((docType) => {
              const status = getDocumentStatus(docType.id);
              return (
                <div key={docType.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <div>
                      <h4 className="font-medium">{docType.name}</h4>
                      <p className="text-sm text-gray-600">{docType.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Max size: {docType.maxSize}MB • Formats: {docType.acceptedTypes.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {docType.required && (
                      <Badge variant="outline" className="text-red-600 border-red-300">
                        Required
                      </Badge>
                    )}
                    <Badge className={getStatusColor(status)}>
                      {status === 'completed' ? 'Uploaded' : status === 'uploading' ? 'Uploading...' : 'Missing'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
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
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Your Documents</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: PDF, DOC, DOCX, JPG, PNG • Max size: 20MB per file
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    {getFileIcon(doc.type)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{doc.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(doc.size)} • {doc.type}
                    </p>
                    
                    {/* Document Type Selector */}
                    {doc.status === 'completed' && (
                      <div className="mt-2">
                        <select
                          value={doc.documentType}
                          onChange={(e) => setDocumentType(doc.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="">Select document type</option>
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
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {doc.status === 'completed' && (
                      <>
                        {doc.preview && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.preview, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.url!;
                            link.download = doc.name;
                            link.click();
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
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

      {/* Upload Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Document Guidelines</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• All documents must be clear and legible</li>
                <li>• Personal information should be visible and not obscured</li>
                <li>• Documents should be recent (within last 3 months for financial docs)</li>
                <li>• Multiple pages can be uploaded as separate files or combined PDFs</li>
                <li>• All required documents must be uploaded before submission</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload; 