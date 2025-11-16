// src/components/ThemeSelector.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '../store/useStore';

const themes = [
  { id: 'A', name: 'Minimal', description: 'Clean and simple', emoji: '🎨' },
  { id: 'B', name: 'Professional', description: 'Dark and sleek', emoji: '💼' },
  { id: 'C', name: 'Gamified', description: 'RPG adventure style', emoji: '🎮' },
  { id: 'D', name: 'Glass', description: 'Glass morphism', emoji: '🔮' },
];

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg border border-slate-300 px-4 py-2 rounded-full text-slate-700 hover:bg-white transition-all shadow-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>🎨</span>
        <span className="text-sm font-medium">Theme</span>
      </motion.button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-12 right-0 w-64 bg-white/95 backdrop-blur-xl border border-slate-300 rounded-2xl p-4 shadow-2xl z-50"
            >
              <h3 className="text-slate-800 font-semibold mb-3 text-center">Choose Theme</h3>
              
              <div className="space-y-2">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => {
                      setTheme(theme.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      currentTheme === theme.id
                        ? 'bg-blue-500 text-white border border-blue-600'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">{theme.emoji}</span>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className={`text-xs ${currentTheme === theme.id ? 'text-blue-100' : 'text-slate-500'}`}>
                        {theme.description}
                      </div>
                    </div>
                    {currentTheme === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}