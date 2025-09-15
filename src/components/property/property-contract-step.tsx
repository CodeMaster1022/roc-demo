"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { contractTypeOptions } from '@/lib/property-mock-data';
import { FileText, Shield, Clock, Info } from 'lucide-react';

interface PropertyContractStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyContractStep: React.FC<PropertyContractStepProps> = ({
  data,
  onUpdate
}) => {
  const handleContractTypeChange = (type: string, checked: boolean) => {
    onUpdate({
      contractTypes: {
        ...data.contractTypes,
        [type]: checked
      }
    });
  };

  const handleCustomContractChange = (field: string, value: boolean | number) => {
    onUpdate({
      contractTypes: {
        ...data.contractTypes,
        custom: {
          ...data.contractTypes.custom,
          [field]: value
        }
      }
    });
  };

  const handleSecurityDepositChange = (checked: boolean) => {
    onUpdate({ securityDepositRequired: checked });
  };

  return (
    <div className="space-y-8">
      {/* Contract Types */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Contract Duration Options <span className="text-red-500">*</span>
        </Label>
        <p className="text-gray-600 mb-6">
          Select the contract durations you're willing to accept. More options can attract more tenants.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <FileText className="w-5 h-5 mr-2" />
              Standard Contract Terms
            </CardTitle>
            <CardDescription>
              Choose from our predefined contract durations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contractTypeOptions.slice(0, 3).map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <Checkbox
                  id={option.value}
                  checked={data.contractTypes[option.value.replace('_', '')] || false}
                  onCheckedChange={(checked) => 
                    handleContractTypeChange(option.value.replace('_', ''), checked as boolean)
                  }
                />
                <Label htmlFor={option.value} className="text-sm font-medium">
                  {option.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Custom Duration */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Clock className="w-5 h-5 mr-2" />
              Custom Duration
            </CardTitle>
            <CardDescription>
              Allow tenants to request custom contract lengths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="custom-enabled"
                  checked={data.contractTypes.custom?.enabled || false}
                  onCheckedChange={(checked) => 
                    handleCustomContractChange('enabled', checked as boolean)
                  }
                />
                <Label htmlFor="custom-enabled" className="text-sm font-medium">
                  Accept custom contract durations
                </Label>
              </div>
              
              {data.contractTypes.custom?.enabled && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <Label className="text-sm">Minimum months</Label>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={data.contractTypes.custom?.minMonths || 1}
                      onChange={(e) => 
                        handleCustomContractChange('minMonths', parseInt(e.target.value) || 1)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Maximum months</Label>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={data.contractTypes.custom?.maxMonths || 24}
                      onChange={(e) => 
                        handleCustomContractChange('maxMonths', parseInt(e.target.value) || 24)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Deposit */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Security Deposit
        </Label>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Shield className="w-5 h-5 mr-2" />
              Security Deposit Requirement
            </CardTitle>
            <CardDescription>
              Decide whether to require a security deposit from tenants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="security-deposit"
                  checked={data.securityDepositRequired}
                  onCheckedChange={handleSecurityDepositChange}
                />
                <Label htmlFor="security-deposit" className="text-sm font-medium">
                  Require security deposit (equivalent to one month's rent)
                </Label>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                data.securityDepositRequired 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start">
                  <Info className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                    data.securityDepositRequired ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                  <div>
                    <h4 className={`font-semibold mb-1 ${
                      data.securityDepositRequired ? 'text-yellow-900' : 'text-green-900'
                    }`}>
                      {data.securityDepositRequired ? 'Security Deposit Required' : 'No Security Deposit'}
                    </h4>
                    <p className={`text-sm ${
                      data.securityDepositRequired ? 'text-yellow-800' : 'text-green-800'
                    }`}>
                      {data.securityDepositRequired 
                        ? 'Tenants will pay an additional month\'s rent as security deposit. This provides protection against damages but may reduce application volume.'
                        : 'No security deposit required. This can attract more tenants and speed up the rental process, but offers less protection against potential damages.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Contract Terms Summary</h4>
        
        <div className="space-y-3 text-sm">
          {/* Available Durations */}
          <div>
            <span className="text-gray-600">Available contract durations:</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {data.contractTypes.threeMonths && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">3 months</span>
              )}
              {data.contractTypes.sixMonths && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">6 months</span>
              )}
              {data.contractTypes.twelveMonths && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">12 months</span>
              )}
              {data.contractTypes.custom?.enabled && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  Custom ({data.contractTypes.custom.minMonths}-{data.contractTypes.custom.maxMonths} months)
                </span>
              )}
              {!data.contractTypes.threeMonths && !data.contractTypes.sixMonths && 
               !data.contractTypes.twelveMonths && !data.contractTypes.custom?.enabled && (
                <span className="text-gray-500 italic">None selected</span>
              )}
            </div>
          </div>
          
          {/* Security Deposit */}
          <div className="flex justify-between">
            <span className="text-gray-600">Security deposit:</span>
            <span className={`font-semibold ${
              data.securityDepositRequired ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {data.securityDepositRequired ? 'Required' : 'Not required'}
            </span>
          </div>
          
          {/* Initial Payment */}
          {data.fullPropertyPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Initial payment (tenant):</span>
              <span className="font-semibold">
                ${(data.fullPropertyPrice * (data.securityDepositRequired ? 2.14 : 1.07)).toLocaleString()} MXN
                <span className="text-xs text-gray-500 ml-1">
                  ({data.securityDepositRequired ? 'First month + deposit + fees' : 'First month + fees'})
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Contract Guidelines</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Offering multiple contract durations attracts more potential tenants</li>
          <li>• Longer contracts provide more stability and reduce turnover costs</li>
          <li>• Security deposits protect against damages but may deter some applicants</li>
          <li>• All contracts will include ROC's standard terms and conditions</li>
        </ul>
      </div>
    </div>
  );
};

export default PropertyContractStep; 