// src/pages/Profile.tsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

interface ProfileData {
  user: {
    id: number;
    name: string;
    email: string;
    personality: string;
    created_at: string;
  };
  preferences: {
    daily_reminders: boolean;
    weekly_reports: boolean;
  };
  goals: {
    goal_text: string;
    progress_percentage: number;
  };
}

export default function Profile() {
  const { user: authUser, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'goals'>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    personality: 'fun',
    dailyReminders: true,
    weeklyReports: false,
    goal: 'Build better habits',
    progressPercentage: 0
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const profile: ProfileData = data.profile;
          setFormData({
            name: profile.user.name,
            email: profile.user.email,
            personality: profile.user.personality,
            dailyReminders: profile.preferences.daily_reminders,
            weeklyReports: profile.preferences.weekly_reports,
            goal: profile.goals.goal_text,
            progressPercentage: profile.goals.progress_percentage
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');

      const updateData: any = {};

      if (activeTab === 'personal') {
        updateData.name = formData.name;
        updateData.personality = formData.personality;
      } else if (activeTab === 'preferences') {
        updateData.preferences = {
          dailyReminders: formData.dailyReminders,
          weeklyReports: formData.weeklyReports
        };
      } else if (activeTab === 'goals') {
        updateData.goals = {
          goalText: formData.goal,
          progressPercentage: formData.progressPercentage
        };
      }

      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setSaveMessage('Error updating profile');
      console.error('Update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👤</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">{formData.name}</h2>
              <p className="text-slate-600">{formData.email}</p>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'personal', label: 'Personal Info', icon: '📝' },
                { id: 'preferences', label: 'Preferences', icon: '⚙️' },
                { id: 'goals', label: 'Goals', icon: '🎯' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6"
          >
            {saveMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg mb-4 ${
                  saveMessage.includes('success') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {saveMessage}
              </motion.div>
            )}

            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      disabled
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Coach Personality
                  </label>
                  <select
                    value={formData.personality}
                    onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                    className="input"
                  >
                    <option value="fun">Fun & Supportive</option>
                    <option value="strict">Strict & Motivational</option>
                    <option value="chill">Chill & Understanding</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Preferences</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.dailyReminders}
                      onChange={(e) => setFormData({ ...formData, dailyReminders: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Send daily reminders</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.weeklyReports}
                      onChange={(e) => setFormData({ ...formData, weeklyReports: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-slate-700">Weekly progress reports</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Goals</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Primary Goal
                  </label>
                  <textarea
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    rows={4}
                    className="input"
                    placeholder="What do you want to achieve with Habit Coach?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Progress Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progressPercentage}
                    onChange={(e) => setFormData({ ...formData, progressPercentage: parseInt(e.target.value) || 0 })}
                    className="input"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Goal Progress</h4>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${formData.progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-blue-700 text-sm mt-2">{formData.progressPercentage}% towards your goal</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-200">
              <button 
                className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                onClick={() => fetchProfile()}
              >
                Cancel
              </button>
              <button 
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}