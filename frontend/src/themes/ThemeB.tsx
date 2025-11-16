// src/themes/ThemeB.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import Avatar from "../components/Avatar";
import HabitList from "../components/HabitList";
import StatsPanel from "../components/StatsPanel";
import MoodInput from "../components/MoodInput";
import { useStore } from "../store/useStore";
import ThemeSelector from "../components/ThemeSelector";

export default function ThemeB() {
  const { currentMood, streak, coachMessage, user } = useStore();
  const [tab, setTab] = useState<"chat" | "habits" | "stats">("chat");

  // Mood Icons
  const moodIcons: any = {
    joy: "😊",
    sad: "😢", 
    angry: "😠",
    tired: "😴",
    neutral: "😐",
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 flex">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
        <div>
          {/* Logo Section */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Habit Coach</h1>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {[
              { key: "chat", label: "AI Chat", icon: "💬" },
              { key: "habits", label: "Habits", icon: "📋" },
              { key: "stats", label: "Analytics", icon: "📊" },
            ].map((item) => (
              <motion.div key={item.key} whileHover={{ scale: 1.02 }}>
                <button
                  onClick={() => setTab(item.key as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-sm transition ${
                    tab === item.key
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Streak Box */}
        <div className="bg-slate-900 rounded-xl p-4 text-white">
          <p className="text-xs opacity-70">Streak</p>
          <p className="text-3xl font-bold">{streak} days</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {/* TOP HEADER ROW */}
        <div className="flex items-center justify-between mb-6">
          {/* User Greeting */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Welcome, {user?.name || "User"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Track your habits and mood with clarity.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mood Indicator */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 bg-white border border-slate-300 rounded-full px-5 py-2 shadow-sm"
            >
              <span className="text-xl">
                {moodIcons[currentMood] || "🙂"}
              </span>
              <span className="capitalize text-sm font-medium text-slate-700">
                {currentMood}
              </span>
            </motion.div>
            <ThemeSelector />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-10">

          {/* LEFT SIDE – Avatar + Coach Message */}
          <div className="col-span-4">
           <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="rounded-2xl p-4"
>

              <div className="flex flex-col items-center">
                <Avatar mood={currentMood} size="lg" />

                {coachMessage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 w-full bg-slate-50 border border-slate-200 rounded-xl p-4"
                  >
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {coachMessage}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE – Main Panels */}
          <div className="col-span-8">
            {/* TABS */}
            <div className="flex space-x-3 mb-4">
              {[
                { key: "chat", label: "AI Chat" },
                { key: "habits", label: "Today's Habits" },
                { key: "stats", label: "Analytics" },
              ].map((item) => (
                <motion.button
                  key={item.key}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setTab(item.key as any)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold ${
                    tab === item.key
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* CONTENT CARD */}
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 min-h-[600px]"
            >
              {tab === "chat" && <MoodInput />}
              {tab === "habits" && <HabitList />}
              {tab === "stats" && <StatsPanel />}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}