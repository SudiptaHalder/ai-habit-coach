// src/pages/History.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data - replace with API calls
const moodData = [
  { date: 'Jan 1', mood: 4, energy: 3 },
  { date: 'Jan 2', mood: 3, energy: 4 },
  { date: 'Jan 3', mood: 5, energy: 5 },
  { date: 'Jan 4', mood: 2, energy: 2 },
  { date: 'Jan 5', mood: 4, energy: 3 },
  { date: 'Jan 6', mood: 5, energy: 4 },
  { date: 'Jan 7', mood: 3, energy: 3 },
];

const habitCompletionData = [
  { day: 'Mon', completed: 3, total: 5 },
  { day: 'Tue', completed: 4, total: 5 },
  { day: 'Wed', completed: 5, total: 5 },
  { day: 'Thu', completed: 2, total: 5 },
  { day: 'Fri', completed: 4, total: 5 },
  { day: 'Sat', completed: 3, total: 5 },
  { day: 'Sun', completed: 5, total: 5 },
];

const moodDistribution = [
  { name: 'Happy', value: 12, color: '#10b981' },
  { name: 'Neutral', value: 8, color: '#6b7280' },
  { name: 'Sad', value: 3, color: '#3b82f6' },
  { name: 'Tired', value: 5, color: '#8b5cf6' },
  { name: 'Angry', value: 2, color: '#ef4444' },
];

export default function History() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">History & Analytics</h1>
        
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                timeRange === range
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Mood Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 col-span-1 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Mood Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#1d4ed8' }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Habit Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Habit Completion Rate</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={habitCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={moodDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {moodDistribution.map((mood) => (
              <div key={mood.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: mood.color }}
                />
                <span className="text-sm text-slate-600">{mood.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Streak', value: '7 days', color: 'orange' },
          { label: 'Best Streak', value: '21 days', color: 'green' },
          { label: 'Habits Completed', value: '89', color: 'blue' },
          { label: 'Success Rate', value: '85%', color: 'purple' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="card p-4 text-center"
          >
            <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}