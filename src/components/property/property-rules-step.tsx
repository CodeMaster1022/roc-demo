"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Users, Home, Plus, Trash2 } from 'lucide-react';

interface PropertyRulesStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PropertyRulesStep: React.FC<PropertyRulesStepProps> = ({
  data,
  onUpdate
}) => {
  const handleRuleChange = (field: string, value: any) => {
    onUpdate({
      rules: {
        ...data.rules,
        [field]: value
      }
    });
  };

  const handleGatheringTimeChange = (field: string, value: string) => {
    onUpdate({
      rules: {
        ...data.rules,
        gatheringTimes: {
          ...data.rules.gatheringTimes,
          [field]: value
        }
      }
    });
  };

  const handleGatheringDayToggle = (day: string, checked: boolean) => {
    const currentDays = data.rules.gatheringDays || [];
    const updatedDays = checked
      ? [...currentDays, day]
      : currentDays.filter((d: string) => d !== day);
    
    handleRuleChange('gatheringDays', updatedDays);
  };

  const addCustomRule = () => {
    const newRule = { title: '', description: '' };
    onUpdate({
      customRules: [...(data.customRules || []), newRule]
    });
  };

  const updateCustomRule = (index: number, field: string, value: string) => {
    const updatedRules = [...(data.customRules || [])];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    onUpdate({ customRules: updatedRules });
  };

  const removeCustomRule = (index: number) => {
    const updatedRules = data.customRules.filter((_: any, i: number) => i !== index);
    onUpdate({ customRules: updatedRules });
  };

  const weekDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const environmentTypes = [
    { value: 'quiet', label: 'Quiet Environment', description: 'Peaceful, study-friendly atmosphere' },
    { value: 'social', label: 'Social Environment', description: 'Friendly, community-oriented living' },
    { value: 'mixed', label: 'Mixed Environment', description: 'Balance of quiet and social times' },
    { value: 'professional', label: 'Professional Environment', description: 'Working professionals, minimal noise' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Label className="text-lg font-semibold mb-4 block">
          Property Rules & Environment
        </Label>
        <p className="text-gray-600 mb-6">
          Set clear rules and expectations to help tenants understand your property's living environment.
        </p>
      </div>

      {/* Basic Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Shield className="w-5 h-5 mr-2" />
            Basic Property Rules
          </CardTitle>
          <CardDescription>
            Set fundamental rules for your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pets */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="pets-allowed"
              checked={data.rules?.petsAllowed || false}
              onCheckedChange={(checked) => handleRuleChange('petsAllowed', checked)}
            />
            <Label htmlFor="pets-allowed" className="text-sm font-medium">
              Pets are allowed
            </Label>
          </div>

          {/* Smoking */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="smoking-allowed"
              checked={data.rules?.smokingAllowed || false}
              onCheckedChange={(checked) => handleRuleChange('smokingAllowed', checked)}
            />
            <Label htmlFor="smoking-allowed" className="text-sm font-medium">
              Smoking is allowed
            </Label>
          </div>

          {/* Gatherings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="gatherings-allowed"
                checked={data.rules?.gatheringsAllowed || false}
                onCheckedChange={(checked) => handleRuleChange('gatheringsAllowed', checked)}
              />
              <Label htmlFor="gatherings-allowed" className="text-sm font-medium">
                Small gatherings/parties are allowed
              </Label>
            </div>

            {data.rules?.gatheringsAllowed && (
              <div className="ml-6 space-y-4">
                {/* Allowed Days */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Allowed days for gatherings</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.value}
                          checked={data.rules?.gatheringDays?.includes(day.value) || false}
                          onCheckedChange={(checked) => handleGatheringDayToggle(day.value, checked as boolean)}
                        />
                        <Label htmlFor={day.value} className="text-xs">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Start time</Label>
                    <Input
                      type="time"
                      value={data.rules?.gatheringTimes?.start || ''}
                      onChange={(e) => handleGatheringTimeChange('start', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">End time</Label>
                    <Input
                      type="time"
                      value={data.rules?.gatheringTimes?.end || ''}
                      onChange={(e) => handleGatheringTimeChange('end', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Environment Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Home className="w-5 h-5 mr-2" />
            Living Environment
          </CardTitle>
          <CardDescription>
            Describe the general atmosphere of your property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {environmentTypes.map((env) => (
              <Card
                key={env.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  data.environmentType === env.value
                    ? 'ring-2 ring-purple-600 bg-purple-50 border-purple-200'
                    : 'hover:border-purple-300'
                }`}
                onClick={() => onUpdate({ environmentType: env.value })}
              >
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm ${
                    data.environmentType === env.value ? 'text-purple-800' : 'text-gray-900'
                  }`}>
                    {env.label}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {env.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Users className="w-5 h-5 mr-2" />
            Custom Rules
          </CardTitle>
          <CardDescription>
            Add any additional rules specific to your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.customRules && data.customRules.length > 0 && (
            <div className="space-y-4">
              {data.customRules.map((rule: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Label className="text-sm font-medium">Rule {index + 1}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomRule(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600">Rule Title</Label>
                      <Input
                        placeholder="e.g., Kitchen Usage Hours"
                        value={rule.title}
                        onChange={(e) => updateCustomRule(index, 'title', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-600">Description</Label>
                      <Textarea
                        placeholder="e.g., Kitchen can only be used between 7 AM and 10 PM to maintain quiet hours"
                        value={rule.description}
                        onChange={(e) => updateCustomRule(index, 'description', e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            onClick={addCustomRule}
            className="w-full border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Rule
          </Button>
        </CardContent>
      </Card>

      {/* Rules Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Rules Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Pets:</span>
            <span className={data.rules?.petsAllowed ? 'text-green-600' : 'text-red-600'}>
              {data.rules?.petsAllowed ? 'Allowed' : 'Not allowed'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Smoking:</span>
            <span className={data.rules?.smokingAllowed ? 'text-yellow-600' : 'text-green-600'}>
              {data.rules?.smokingAllowed ? 'Allowed' : 'Not allowed'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gatherings:</span>
            <span className={data.rules?.gatheringsAllowed ? 'text-blue-600' : 'text-gray-600'}>
              {data.rules?.gatheringsAllowed ? 'Allowed with restrictions' : 'Not allowed'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Environment:</span>
            <span className="font-semibold capitalize">
              {data.environmentType || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Custom Rules:</span>
            <span className="font-semibold">
              {data.customRules?.length || 0} additional rules
            </span>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Rule Guidelines</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Clear rules help attract compatible tenants and prevent conflicts</li>
          <li>• Be specific about restrictions to avoid misunderstandings</li>
          <li>• Rules should be reasonable and enforceable</li>
          <li>• Consider your local laws and regulations when setting rules</li>
        </ul>
      </div>
    </div>
  );
};

export default PropertyRulesStep; 