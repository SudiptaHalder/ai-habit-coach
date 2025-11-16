// src/pages/Settings.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    darkMode: false,
    autoSave: true,
    language: 'en',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingGroups = [
    {
      title: 'Appearance',
      icon: '🎨',
      settings: [
        {
          key: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch between light and dark theme',
          type: 'toggle',
          value: settings.darkMode,
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: settings.language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
          ],
        },
      ],
    },
    {
      title: 'Notifications',
      icon: '🔔',
      settings: [
        {
          key: 'notifications',
          label: 'Push Notifications',
          description: 'Receive reminders and updates',
          type: 'toggle',
          value: settings.notifications,
        },
        {
          key: 'sound',
          label: 'Sound Effects',
          description: 'Play sounds for interactions',
          type: 'toggle',
          value: settings.sound,
        },
      ],
    },
    {
      title: 'Data & Storage',
      icon: '💾',
      settings: [
        {
          key: 'autoSave',
          label: 'Auto Save',
          description: 'Automatically save your progress',
          type: 'toggle',
          value: settings.autoSave,
        },
      ],
    },
  ];

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>

      <div className="space-y-6">
        {settingGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-2xl">{group.icon}</span>
              <h2 className="text-xl font-semibold text-slate-800">{group.title}</h2>
            </div>

            <div className="space-y-6">
              {group.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800">{setting.label}</h3>
                    <p className="text-sm text-slate-600 mt-1">{setting.description}</p>
                  </div>
                  
                  <div className="ml-4">
                    {setting.type === 'toggle' && (
                      <button
                        onClick={() => handleSettingChange(setting.key, !setting.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.value ? 'bg-blue-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    
                    {setting.type === 'select' && (
                      <select
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="input py-2 text-sm"
                      >
                        {setting.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 border-2 border-red-200"
        >
          <h2 className="text-xl font-semibold text-red-800 mb-4">Danger Zone</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-800">Delete All Data</h3>
                <p className="text-sm text-red-600">Permanently delete all your habits and history</p>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Delete Data
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-800">Reset Account</h3>
                <p className="text-sm text-red-600">Reset everything and start fresh</p>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Reset Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}