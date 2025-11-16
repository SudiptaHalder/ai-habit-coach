// src/components/HabitList.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function HabitList() {
  const { habits, completeHabit, coachMessage } = useStore();

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">💭</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No habits yet
        </h3>
        <p className="text-slate-500">
          Share how you're feeling to get personalized habit suggestions!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Coach Message */}
      {coachMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">🤖</span>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">
              {coachMessage}
            </p>
          </div>
        </motion.div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        <AnimatePresence>
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${
                habit.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <button
                onClick={() => completeHabit(habit.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  habit.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-300 hover:border-green-500'
                }`}
              >
                {habit.completed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs"
                  >
                    ✓
                  </motion.span>
                )}
              </button>

              <div className="flex-1">
                <p className={`font-medium ${
                  habit.completed ? 'text-green-700 line-through' : 'text-slate-700'
                }`}>
                  {habit.habit}
                </p>
              </div>

              {!habit.completed && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => completeHabit(habit.id)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Complete
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}