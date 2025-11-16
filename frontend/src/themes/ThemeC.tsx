// src/themes/ThemeC.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import Avatar from "../components/Avatar";
import HabitList from "../components/HabitList";
import StatsPanel from "../components/StatsPanel";
import MoodInput from "../components/MoodInput";
import { useStore } from "../store/useStore";
import ThemeSelector from "../components/ThemeSelector";

export default function ThemeC() {
  const { currentMood, coachMessage, streak, user } = useStore();
  const [tab, setTab] = useState<"quests" | "pet" | "stats">("pet");

  // XP system
  const xp = streak * 20; // Example formula
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  // Pet mood emoji
  const petEmoji =
    currentMood === "joy"
      ? "😺"
      : currentMood === "sad"
      ? "😿"
      : currentMood === "angry"
      ? "😾"
      : currentMood === "tired"
      ? "😴"
      : "🐱";

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-emerald-900 via-slate-900 to-black text-white px-10 py-10 flex flex-col space-y-8">

      {/* TOP HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-emerald-200 drop-shadow-lg">
            Welcome back, {user?.name || "Adventurer"} ⚔️
          </h1>
          <p className="text-emerald-300 mt-2 tracking-wide">
            Your AI pet companion is ready for today's journey.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Level Badge */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="px-6 py-3 rounded-full bg-black/40 border border-emerald-400/40 backdrop-blur-xl flex items-center gap-3 shadow-emerald-500/25 shadow-lg"
          >
            <span className="text-2xl">⭐</span>
            <div className="flex flex-col">
              <span className="text-lg font-bold">Level {level}</span>
              <span className="text-emerald-300 text-xs">XP: {xp}</span>
            </div>
          </motion.div>
          <ThemeSelector />
        </div>
      </div>

      {/* XP BAR */}
      <div className="w-full bg-black/40 border border-emerald-400/30 rounded-full p-2 shadow-inner backdrop-blur-xl">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
          className="h-4 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full shadow-emerald-300"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex space-x-10">

        {/* LEFT PANEL: PET + COACH */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-96 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          {/* PET CHARACTER */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-8xl drop-shadow-xl">{petEmoji}</div>
            <h3 className="mt-2 text-lg font-bold tracking-wide">Your Companion</h3>

            <p className="text-sm text-emerald-200 mt-1">
              Mood: <span className="font-semibold">{currentMood}</span>
            </p>
          </motion.div>

          {/* COACH MESSAGE */}
          {coachMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 backdrop-blur-xl bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-5"
            >
              <h4 className="text-emerald-200 text-sm font-bold mb-1">
                💬 Companion Says:
              </h4>
              <p className="text-emerald-100 text-sm leading-relaxed">
                {coachMessage}
              </p>
            </motion.div>
          )}

          {/* STREAK */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mt-8 text-center backdrop-blur-xl bg-gradient-to-r from-orange-400/20 to-red-500/20 border border-orange-300/20 rounded-2xl p-5 shadow-md"
          >
            <p className="text-orange-300 text-sm uppercase">🔥 Daily Streak</p>
            <p className="text-4xl font-bold text-orange-400 drop-shadow">{streak} days</p>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          className="flex-1 flex flex-col space-y-8"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* RPG TABS */}
          <div className="flex space-x-4">
            {[
              { key: "pet", label: "Pet", icon: "🐾" },
              { key: "quests", label: "Quests", icon: "🧪" },
              { key: "stats", label: "Stats", icon: "📊" },
            ].map((item) => (
              <motion.button
                key={item.key}
                onClick={() => setTab(item.key as any)}
                whileHover={{ scale: 1.07 }}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all backdrop-blur-xl border
                  ${
                    tab === item.key
                      ? "bg-emerald-400/20 text-white border-emerald-300 shadow-lg"
                      : "bg-black/20 text-emerald-300 hover:bg-black/30 border-emerald-300/20"
                  }`}
              >
                {item.icon} {item.label}
              </motion.button>
            ))}
          </div>

          {/* RPG CONTENT PANEL */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 backdrop-blur-2xl bg-black/30 border border-white/10 rounded-3xl p-8 shadow-2xl min-h-[600px]"
          >
            {tab === "pet" && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-emerald-200 mb-4">Talk to Your Pet</h2>
                <MoodInput />
              </div>
            )}

            {tab === "quests" && (
              <div>
                <h2 className="text-2xl font-bold text-emerald-200 mb-4">Daily Quests</h2>
                <HabitList />
              </div>
            )}

            {tab === "stats" && (
              <div>
                <h2 className="text-2xl font-bold text-emerald-200 mb-4">Adventure Stats</h2>
                <StatsPanel />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}