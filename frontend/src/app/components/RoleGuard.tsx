'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '../contexts/RoleContext';
import { motion } from 'framer-motion';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: 'employer' | 'employee';
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRole, 
  redirectTo = '/setup-role' 
}) => {
  const { role, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== allowedRole) {
      router.push(redirectTo);
    }
  }, [role, allowedRole, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
};

