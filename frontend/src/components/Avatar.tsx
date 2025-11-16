// src/components/Avatar.tsx
import { motion } from "framer-motion";

interface AvatarProps {
  mood: string;
  size?: "sm" | "md" | "lg";
}

/* Animated Lottie URLs */
const moodLottie: Record<string, string> = {
  joy: "https://lottie.host/embed/6f7afc6b-560a-4a36-acf9-bb1191b58e73/vkerBMmKlr.lottie",
  sad: "https://lottie.host/ff8d92be-4208-473a-8e83-f114c286d40b/N6mqn2fLRy.lottie",
  angry: "https://lottie.host/d3c7e0b8-1bef-49a6-8bce-9b7e711af3db/Z1sU6oMfZR.lottie",
  tired: "https://lottie.host/b41bf952-fe85-48d1-878c-e7e591b435d4/d31HXjSU0n.lottie",
  neutral: "https://lottie.host/9c194b00-46f1-40e5-b285-156fe234dd93/O75Y5JBC5C.lottie",
};

const moodLabels = {
  joy: "Happy 😊",
  sad: "Sad 😢",
  angry: "Angry 😠",
  tired: "Tired 😴",
  neutral: "Neutral 😐",
};

export default function Avatar({ mood = "neutral", size = "md" }: AvatarProps) {
  const px = size === "sm" ? 120 : size === "md" ? 200 : 260;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex justify-center items-center"
        style={{ width: px, height: px }}
      >
        {/* Soft glow light */}
        <div className="absolute top-20 w-48 h-48 bg-purple-300/25 blur-3xl rounded-full" />

        {/* FULL-SIZE MOVING LOTTIE */}
        <iframe
          src={moodLottie[mood]}
          style={{
            width: px,
            height: px,
            border: "none",
            background: "transparent",
            overflow: "hidden",
          }}
        />
      </motion.div>

      {/* Mood Label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 py-2 text-white text-sm font-semibold rounded-xl shadow-md bg-gradient-to-r from-purple-500 to-pink-500"
      >
        {moodLabels[mood as keyof typeof moodLabels]}
      </motion.div>
    </div>
  );
}
