// src/themes/ThemeD.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import Avatar from "../components/Avatar";
import HabitList from "../components/HabitList";
import StatsPanel from "../components/StatsPanel";
import MoodInput from "../components/MoodInput";
import { useStore } from "../store/useStore";
import ThemeSelector from "../components/ThemeSelector";

export default function ThemeD() {
  const { currentMood, coachMessage, streak, user } = useStore();
  const [tab, setTab] = useState<"chat" | "habits" | "stats">("chat");

  // Mood glow colors
  const moodGlow =
    currentMood === "joy"
      ? "shadow-[0_0_30px_5px_rgba(16,185,129,0.7)]"
      : currentMood === "sad"
      ? "shadow-[0_0_30px_5px_rgba(59,130,246,0.7)]"
      : currentMood === "angry"
      ? "shadow-[0_0_30px_5px_rgba(239,68,68,0.7)]"
      : currentMood === "tired"
      ? "shadow-[0_0_30px_5px_rgba(168,85,247,0.7)]"
      : "shadow-[0_0_20px_3px_rgba(156,163,175,0.5)]";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white px-10 py-10 flex flex-col space-y-10">

      {/* TOP HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-300 to-pink-300 text-transparent bg-clip-text drop-shadow-lg">
            Welcome back, {user?.name || "User"} ✨
          </h1>
          <p className="text-slate-300 mt-2">
            Your AI coach is here to guide you with clarity and calm.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mood Chip */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg"
          >
            <span className="text-xl">
              {currentMood === "joy" && "😊"}
              {currentMood === "sad" && "😢"}
              {currentMood === "angry" && "😠"}
              {currentMood === "tired" && "😴"}
              {currentMood === "neutral" && "😐"}
            </span>
            <p className="capitalize">{currentMood}</p>
          </motion.div>
          <ThemeSelector />
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex space-x-10">

        {/* LEFT PANEL — Avatar & Coach Message */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className={`w-96 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl ${moodGlow}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <Avatar mood={currentMood} size="lg" />

            {coachMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-md"
              >
                <p className="text-indigo-200 text-sm leading-relaxed">{coachMessage}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Streak Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="mt-8 text-center backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-300/20 rounded-2xl p-5"
          >
            <p className="text-orange-300 text-sm uppercase tracking-wide">🔥 Streak</p>
            <p className="text-4xl font-bold text-orange-400 drop-shadow">{streak} days</p>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL — Tabs + Content */}
        <motion.div
          className="flex-1 flex flex-col space-y-8"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Glass Tabs */}
          <div className="flex space-x-4">
            {[
              { key: "chat", label: "AI Chat", icon: "💬" },
              { key: "habits", label: "Habits", icon: "📋" },
              { key: "stats", label: "Stats", icon: "📊" },
            ].map((item) => (
              <motion.button
                key={item.key}
                onClick={() => setTab(item.key as any)}
                whileHover={{ scale: 1.07 }}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all backdrop-blur-xl border
                  ${
                    tab === item.key
                      ? "bg-white/20 text-white border-white/30 shadow-lg"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 border-white/10"
                  }`}
              >
                {item.icon} {item.label}
              </motion.button>
            ))}
          </div>

          {/* Glass Content Panel */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl min-h-[600px]"
          >
            {tab === "chat" && <MoodInput />}
            {tab === "habits" && <HabitList />}
            {tab === "stats" && <StatsPanel />}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}