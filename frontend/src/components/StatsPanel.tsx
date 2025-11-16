// src/components/StatsPanel.tsx
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Mock data - replace with real data from your API
const moodData = [
  { day: 'Mon', mood: 4 },
  { day: 'Tue', mood: 3 },
  { day: 'Wed', mood: 5 },
  { day: 'Thu', mood: 2 },
  { day: 'Fri', mood: 4 },
  { day: 'Sat', mood: 5 },
  { day: 'Sun', mood: 3 },
];

const habitData = [
  { day: 'Mon', completed: 3, total: 5 },
  { day: 'Tue', completed: 4, total: 5 },
  { day: 'Wed', completed: 5, total: 5 },
  { day: 'Thu', completed: 2, total: 5 },
  { day: 'Fri', completed: 4, total: 5 },
  { day: 'Sat', completed: 3, total: 5 },
  { day: 'Sun', completed: 5, total: 5 },
];

export default function StatsPanel() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200"
        >
          <div className="text-2xl font-bold text-blue-600">7</div>
          <div className="text-sm text-blue-800">Day Streak</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 rounded-xl p-4 text-center border border-green-200"
        >
          <div className="text-2xl font-bold text-green-600">85%</div>
          <div className="text-sm text-green-800">Completion Rate</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200"
        >
          <div className="text-2xl font-bold text-purple-600">12</div>
          <div className="text-sm text-purple-800">Habits Completed</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200"
        >
          <div className="text-2xl font-bold text-orange-600">4.2</div>
          <div className="text-sm text-orange-800">Avg Mood</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-50 rounded-xl p-4 border border-slate-200"
        >
          <h4 className="font-semibold text-slate-800 mb-4">Mood Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Habit Completion */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-50 rounded-xl p-4 border border-slate-200"
        >
          <h4 className="font-semibold text-slate-800 mb-4">Habit Completion</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={habitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}