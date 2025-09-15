"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, withAuth } from '@/contexts/auth-context';

const AdminPropertiesPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">Redirecting to Admin Dashboard...</h1>
      </div>
    </div>
  );
};

export default withAuth(AdminPropertiesPage, { 
  allowedUserTypes: ['admin'] 
}); 