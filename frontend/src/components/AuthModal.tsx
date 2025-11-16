// src/components/AuthModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void; // Add this prop
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {isLogin ? (
                <Login 
                  onSwitchToSignup={() => setIsLogin(false)} 
                  onClose={onClose}
                  onAuthSuccess={handleAuthSuccess} // Pass to Login
                />
              ) : (
                <Signup 
                  onSwitchToLogin={() => setIsLogin(true)} 
                  onClose={onClose}
                  onAuthSuccess={handleAuthSuccess} // Pass to Signup
                />
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}