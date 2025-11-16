// src/themes/ThemeA.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import HabitList from "../components/HabitList";
import StatsPanel from "../components/StatsPanel";
import MoodInput from "../components/MoodInput";
import { useStore } from "../store/useStore";
import ThemeSelector from "../components/ThemeSelector";

export default function ThemeA() {
  const { currentMood, streak, coachMessage, user } = useStore();
  const [tab, setTab] = useState<"chat" | "habits" | "stats">("chat");

  const moodEmoji: any = {
    joy: "😊",
    sad: "😢",
    angry: "😠",
    tired: "😴",
    neutral: "🙂",
  };

  // Lottie avatar URLs
  const moodLottie: Record<string, string> = {
    joy: "https://lottie.host/embed/6f7afc6b-560a-4a36-acf9-bb1191b58e73/vkerBMmKlr.lottie",
    sad: "https://lottie.host/embed/e56b0800-31f4-47f9-804d-36a2e6301d35/6pTmZN5D1J.lottie",
    angry: "https://lottie.host/embed/9b95f084-eefc-4e5e-99b6-889218cd50e4/ikf2pSxCJy.lottie",
    tired: "https://lottie.host/embed/5fbde08f-1c00-44df-9cdc-16ff7a627ce8/6FBF5LqVPO.lottie",
    neutral: "https://lottie.host/embed/e1d9d7b5-0392-42f7-8b67-a5fdd237dfe8/7RiJyLfsFq.lottie",
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-slate-100 px-5 py-6 md:px-10 md:py-10">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Hello, {user?.name || "Friend"} 👋
          </h1>
          <p className="text-slate-500 text-sm">Let's build healthy habits today.</p>
        </div>
        <ThemeSelector />
      </div>

      {/* BUBBLES ROW */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">

        {/* Mood Bubble */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-white rounded-3xl px-5 py-4 shadow-sm border border-slate-200 min-w-[160px]"
        >
          <span className="text-3xl">{moodEmoji[currentMood]}</span>
          <div>
            <p className="text-xs text-slate-500">Mood</p>
            <p className="text-sm font-semibold capitalize text-slate-700">
              {currentMood}
            </p>
          </div>
        </motion.div>

        {/* Streak Bubble */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-3xl px-5 py-4 shadow-md min-w-[160px]"
        >
          <span className="text-3xl">🔥</span>
          <div>
            <p className="text-xs text-indigo-100">Streak</p>
            <p className="text-sm font-semibold">{streak} days</p>
          </div>
        </motion.div>

        {/* Coach Bubble */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-white rounded-3xl px-5 py-4 shadow-sm border border-slate-200 min-w-[200px]"
        >
          <span className="text-3xl">🤖</span>
          <div>
            <p className="text-xs text-slate-500">Coach</p>
            <p className="text-sm font-semibold text-slate-700">Online</p>
          </div>
        </motion.div>
      </div>

      {/* AVATAR FLOATING CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 mt-8"
      >
        <div className="flex flex-col items-center text-center">

          {/* FLOATING LOTTIE AVATAR */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full flex justify-center"
          >
            {/* Soft Glow */}
            <div className="absolute top-24 w-48 h-48 bg-purple-300/30 blur-3xl rounded-full"></div>

            {/* Avatar Animation */}
            <iframe
              src={moodLottie[currentMood]}
              style={{
                width: "260px",
                height: "260px",
                border: "none",
                background: "transparent",
              }}
            />
          </motion.div>

          {/* COACH MESSAGE */}
          {coachMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full"
            >
              <p className="text-slate-700 text-sm leading-relaxed">{coachMessage}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* TABS */}
      <div className="flex justify-center gap-3 mt-8 mb-4">
        {[
          { key: "chat", label: "Chat", icon: "💬" },
          { key: "habits", label: "Habits", icon: "📋" },
          { key: "stats", label: "Stats", icon: "📊" },
        ].map((item) => (
          <motion.button
            key={item.key}
            whileHover={{ scale: 1.05 }}
            onClick={() => setTab(item.key as any)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              tab === item.key
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-700 shadow-sm"
            }`}
          >
            {item.icon} {item.label}
          </motion.button>
        ))}
      </div>

      {/* CONTENT PANEL */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 min-h-[500px]"
      >
        {tab === "chat" && <MoodInput />}
        {tab === "habits" && <HabitList />}
        {tab === "stats" && <StatsPanel />}
      </motion.div>
    </div>
  );
}
