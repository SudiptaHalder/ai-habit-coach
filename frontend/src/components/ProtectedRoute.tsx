// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setChecked(true);
    };

    initializeAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Only show auth modal if we've checked AND user is not authenticated
    if (checked && !isAuthenticated && !isLoading) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [checked, isAuthenticated, isLoading]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Don't allow closing modal without authentication
  const handleCloseModal = () => {
    // Only allow closing if user is authenticated
    if (isAuthenticated) {
      setShowAuthModal(false);
    }
  };

  if (isLoading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? children : (
        // Show nothing when not authenticated - the modal will handle the auth
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" />
      )}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}