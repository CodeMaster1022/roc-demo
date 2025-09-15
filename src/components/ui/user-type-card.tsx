import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserType } from '@/lib/types';
import { Home, Users, Building } from 'lucide-react';

interface UserTypeCardProps {
  userType: UserType;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: (userType: UserType) => void;
}

const iconMap = {
  tenant: Home,
  roomie: Users,
  hoster: Building,
  admin: Building
};

export const UserTypeCard: React.FC<UserTypeCardProps> = ({
  userType,
  title,
  description,
  isSelected,
  onSelect
}) => {
  const Icon = iconMap[userType];

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' 
          : 'hover:border-purple-300'
      }`}
      onClick={() => onSelect(userType)}
    >
      <CardHeader className="text-center pb-3">
        <div className={`mx-auto mb-3 p-3 rounded-full ${
          isSelected 
            ? 'bg-gradient-to-br from-purple-600 to-purple-800 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <Icon size={24} />
        </div>
        <CardTitle className={`text-lg ${
          isSelected ? 'text-purple-800' : 'text-gray-900'
        }`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pt-0">
        <CardDescription className="text-sm mb-4">
          {description}
        </CardDescription>
        <Button 
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={isSelected 
            ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900" 
            : "border-purple-200 text-purple-600 hover:bg-purple-50"
          }
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </CardContent>
    </Card>
  );
}; 