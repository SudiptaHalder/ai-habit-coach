// src/components/Layout.tsx - COMPACT LEFT SIDEBAR
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function Layout() {
  const location = useLocation();
  const { streak } = useStore();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/history', label: 'History', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200/80 min-h-screen sticky top-0 flex-shrink-0">
          <div className="p-6 border-b border-slate-200/80">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🤝</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Habit Coach</h1>
                <p className="text-slate-600 text-sm">AI Companion</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent hover:border-slate-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Streak Counter in Sidebar */}
          <div className="p-4 mt-8">
            <motion.div 
              className="flex items-center space-x-3 bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-xl border border-orange-200 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🔥</span>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-800 text-lg">{streak}</div>
                <div className="text-orange-600 text-xs">day streak</div>
              </div>
            </motion.div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-6">
          <Outlet /> {/* This renders the current route component */}
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 lg:hidden z-40">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}