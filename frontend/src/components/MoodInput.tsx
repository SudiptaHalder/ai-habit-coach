// src/components/MoodInput.tsx - COMPACT VERSION
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function MoodInput() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const { analyzeMood, coachReply, currentMood } = useStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await analyzeMood(message);
      await coachReply(message);
      
      const { coachMessage } = useStore.getState();
      if (coachMessage) {
        const coachResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: coachMessage,
          isUser: false,
          timestamp: new Date(),
        };
        setChatHistory(prev => [...prev, coachResponse]);
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again!",
        isUser: false,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickMessages = [
    { text: "😊 Feeling great!", mood: "joy" },
    { text: "😢 Feeling down", mood: "sad" },
    { text: "😴 Really tired", mood: "tired" },
    { text: "😠 Frustrated", mood: "angry" },
    { text: "😐 Normal day", mood: "neutral" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Chat with Coach</span>
      </h3>
      
      {/* Chat History */}
      <div 
        ref={chatContainerRef}
        className="h-64 mb-4 space-y-3 overflow-y-auto rounded-xl bg-slate-50/80 p-4 border border-slate-200"
      >
        <AnimatePresence>
          {chatHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-500 h-full flex items-center justify-center"
            >
              <div>
                <div className="text-4xl mb-2">🤖</div>
                <p className="text-sm font-medium">Hello! I'm your AI Coach</p>
                <p className="text-xs mt-1">Share how you're feeling!</p>
              </div>
            </motion.div>
          ) : (
            chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 ${
                    msg.isUser
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.isUser ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-slate-200 rounded-xl rounded-bl-none p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How are you feeling today?"
            className="w-full h-20 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700 text-sm"
            disabled={isLoading}
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-blue-500/25 text-sm"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Analyzing...</span>
            </div>
          ) : (
            'Get Coaching & Habits'
          )}
        </motion.button>
      </form>

      {/* Quick Mood Buttons */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs font-medium text-slate-600 mb-3">Quick messages:</p>
        <div className="grid grid-cols-2 gap-2">
          {quickMessages.map((quickMsg) => (
            <motion.button
              key={quickMsg.mood}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMessage(quickMsg.text)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-xs border border-slate-300 text-center"
            >
              {quickMsg.text}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}