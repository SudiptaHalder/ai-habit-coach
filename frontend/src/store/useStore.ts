
// // src/store/useStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface Habit {
//   id: string;
//   habit: string;
//   completed: boolean;
//   createdAt: string;
// }

// interface MoodEntry {
//   id: string;
//   mood: string;
//   message: string;
//   createdAt: string;
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   personality: 'fun' | 'strict' | 'chill';
// }

// interface Store {
//   user: User | null;
//   currentMood: string;
//   streak: number;
//   habits: Habit[];
//   moodHistory: MoodEntry[];
//   coachMessage: string;
//   isLoading: boolean;
//   currentTheme: string;
  
//   // Actions
//   setUser: (user: User) => void;
//   analyzeMood: (message: string) => Promise<void>;
//   coachReply: (message: string) => Promise<void>;
//   completeHabit: (id: string) => void;
//   addHabit: (habit: string) => void;
//   addMoodEntry: (mood: string, message: string) => void;
//   updateStreak: () => void;
//   setLoading: (loading: boolean) => void;
//   loadUserData: (userId: string) => Promise<void>;
//   clearData: () => void;
//   setTheme: (theme: string) => void;
// }

// const API_BASE = 'http://localhost:3001/api';

// export const useStore = create<Store>()(
//   persist(
//     (set, get) => ({
//       user: {
//         id: '1',
//         name: 'Demo User',
//         email: 'demo@habitcoach.com',
//         personality: 'fun'
//       },
//       currentMood: 'neutral',
//       streak: 0,
//       habits: [],
//       moodHistory: [],
//       coachMessage: '',
//       isLoading: false,
//       currentTheme: 'A', // Default theme A (Minimal)

//       setUser: (user) => set({ user }),

//       setLoading: (loading) => set({ isLoading: loading }),

//       analyzeMood: async (message: string) => {
//         set({ isLoading: true });
//         try {
//           const response = await fetch(`${API_BASE}/ai/analyze-mood`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ message }),
//           });
          
//           if (!response.ok) throw new Error('Failed to analyze mood');
          
//           const { mood } = await response.json();
//           set({ currentMood: mood });
          
//           // Save mood entry to backend
//           try {
//             await fetch(`${API_BASE}/ai/save-mood`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ 
//                 user_id: get().user?.id || '1',
//                 mood, 
//                 message 
//               }),
//             });
//           } catch (error) {
//             console.log('Note: Mood save failed, but continuing...');
//           }
          
//           // Add to local history
//           get().addMoodEntry(mood, message);
//         } catch (error) {
//           console.error('Error analyzing mood:', error);
//           // Fallback to simple mood detection
//           const detectedMood = detectMoodSimple(message);
//           set({ currentMood: detectedMood });
//           get().addMoodEntry(detectedMood, message);
//         } finally {
//           set({ isLoading: false });
//         }
//       },

//       coachReply: async (message: string) => {
//         set({ isLoading: true });
//         try {
//           const { currentMood, user } = get();
          
//           const response = await fetch(`${API_BASE}/ai/coach`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//               message, 
//               mood: currentMood,
//               personality: user?.personality || 'fun'
//             }),
//           });
          
//           if (!response.ok) throw new Error('Failed to get coach reply');
          
//           const { reply, habits } = await response.json();
//           set({ coachMessage: reply });
          
//           // Clear existing habits and add new AI-generated ones
//           const newHabits = habits.map((habit: string, index: number) => ({
//             id: Date.now().toString() + index,
//             habit,
//             completed: false,
//             createdAt: new Date().toISOString(),
//           }));
          
//           set({ habits: newHabits });
          
//           // Save habits to backend
//           try {
//             const savePromises = habits.map((habit: string) => 
//               fetch(`${API_BASE}/habits/create-habit`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ 
//                   user_id: get().user?.id || '1',
//                   habit 
//                 }),
//               })
//             );
            
//             await Promise.all(savePromises);
//           } catch (error) {
//             console.log('Note: Habits save failed, but continuing...');
//           }
          
//         } catch (error) {
//           console.error('Error getting coach reply:', error);
//           // SIMPLE FALLBACK - No static habits, just a message
//           const fallbackReply = "I'm having trouble connecting right now. Please try again in a moment!";
//           set({ coachMessage: fallbackReply });
          
//           // Clear habits instead of using static ones
//           set({ habits: [] });
//         } finally {
//           set({ isLoading: false });
//         }
//       },

//       completeHabit: async (id: string) => {
//         try {
//           // Mark habit as complete in backend
//           try {
//             await fetch(`${API_BASE}/habits/complete-habit`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ habit_id: id }),
//             });
//           } catch (error) {
//             console.log('Note: Complete habit API failed, but continuing...');
//           }

//           // Update local state
//           set((state) => ({
//             habits: state.habits.map((habit) =>
//               habit.id === id ? { ...habit, completed: true } : habit
//             ),
//           }));
          
//           // Check if all habits completed and update streak
//           const { habits } = get();
//           const allCompleted = habits.length > 0 && habits.every(habit => habit.completed);
//           if (allCompleted) {
//             get().updateStreak();
//           }
//         } catch (error) {
//           console.error('Error completing habit:', error);
//         }
//       },

//       addHabit: async (habit: string) => {
//         try {
//           const newHabit: Habit = {
//             id: Date.now().toString(),
//             habit,
//             completed: false,
//             createdAt: new Date().toISOString(),
//           };
          
//           // Save to backend
//           try {
//             await fetch(`${API_BASE}/habits/create-habit`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ 
//                 user_id: get().user?.id || '1',
//                 habit 
//               }),
//             });
//           } catch (error) {
//             console.log('Note: Add habit API failed, but continuing...');
//           }
          
//           // Update local state
//           set((state) => ({ habits: [...state.habits, newHabit] }));
//         } catch (error) {
//           console.error('Error adding habit:', error);
//         }
//       },

//       addMoodEntry: (mood: string, message: string) => {
//         const newEntry: MoodEntry = {
//           id: Date.now().toString(),
//           mood,
//           message,
//           createdAt: new Date().toISOString(),
//         };
//         set((state) => ({ moodHistory: [...state.moodHistory, newEntry] }));
//       },

//       updateStreak: async () => {
//         try {
//           // Update streak in backend
//           try {
//             await fetch(`${API_BASE}/streak/update-streak`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ user_id: get().user?.id || '1' }),
//             });
//           } catch (error) {
//             console.log('Note: Streak update API failed, but continuing...');
//           }

//           // Update local state
//           set((state) => ({ streak: state.streak + 1 }));
          
//           // Refresh streak from backend
//           get().loadUserData(get().user?.id || '1');
//         } catch (error) {
//           console.error('Error updating streak:', error);
//         }
//       },

//       loadUserData: async (userId: string) => {
//         try {
//           // Load habits
//           const habitsResponse = await fetch(`${API_BASE}/habits/habits?user_id=${userId}`);
//           if (habitsResponse.ok) {
//             const { habits } = await habitsResponse.json();
//             set({ habits: habits || [] });
//           }

//           // Load streak
//           const streakResponse = await fetch(`${API_BASE}/streak/streak?user_id=${userId}`);
//           if (streakResponse.ok) {
//             const { streak } = await streakResponse.json();
//             set({ streak: streak || 0 });
//           }
//         } catch (error) {
//           console.error('Error loading user data:', error);
//         }
//       },

//       clearData: () => {
//         set({
//           habits: [],
//           moodHistory: [],
//           coachMessage: '',
//           currentMood: 'neutral',
//           streak: 0
//         });
//       },

//       setTheme: (theme: string) => {
//         set({ currentTheme: theme });
//       }
//     }),
//     {
//       name: 'habit-coach-storage',
//       partialize: (state) => ({
//         user: state.user,
//         currentMood: state.currentMood,
//         streak: state.streak,
//         habits: state.habits,
//         moodHistory: state.moodHistory,
//         coachMessage: state.coachMessage,
//         currentTheme: state.currentTheme,
//       }),
//     }
//   )
// );

// // Simple fallback mood detection
// function detectMoodSimple(message: string): string {
//   const lowerMessage = message.toLowerCase();
  
//   if (lowerMessage.includes('happy') || lowerMessage.includes('good') || 
//       lowerMessage.includes('great') || lowerMessage.includes('excited') ||
//       lowerMessage.includes('awesome') || lowerMessage.includes('amazing')) {
//     return 'joy';
//   } else if (lowerMessage.includes('sad') || lowerMessage.includes('bad') || 
//              lowerMessage.includes('terrible') || lowerMessage.includes('depressed') ||
//              lowerMessage.includes('unhappy') || lowerMessage.includes('miserable')) {
//     return 'sad';
//   } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || 
//              lowerMessage.includes('frustrated') || lowerMessage.includes('annoyed') ||
//              lowerMessage.includes('pissed') || lowerMessage.includes('irritated')) {
//     return 'angry';
//   } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || 
//              lowerMessage.includes('sleepy') || lowerMessage.includes('fatigued') ||
//              lowerMessage.includes('drained') || lowerMessage.includes('burned out')) {
//     return 'tired';
//   }
  
//   return 'neutral';
// }

// // Initialize user data when store is created
// useStore.getState().loadUserData('1');


// src/store/useStore.ts - UPDATED WITH AUTH
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

interface Habit {
  id: string;
  habit: string;
  completed: boolean;
  createdAt: string;
}

interface MoodEntry {
  id: string;
  mood: string;
  message: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  personality: 'fun' | 'strict' | 'chill';
}

interface Store {
  user: User | null;
  currentMood: string;
  streak: number;
  habits: Habit[];
  moodHistory: MoodEntry[];
  coachMessage: string;
  isLoading: boolean;
  currentTheme: string;
  
  // Actions
  setUser: (user: User) => void;
  analyzeMood: (message: string) => Promise<void>;
  coachReply: (message: string) => Promise<void>;
  completeHabit: (id: string) => void;
  addHabit: (habit: string) => void;
  addMoodEntry: (mood: string, message: string) => void;
  updateStreak: () => void;
  setLoading: (loading: boolean) => void;
  loadUserData: () => Promise<void>;
  clearData: () => void;
  setTheme: (theme: string) => void;
  syncWithBackend: () => Promise<void>;
}

const API_BASE = 'http://localhost:3001/api';

// Helper function for authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const { token } = useAuthStore.getState();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    useAuthStore.getState().logout();
    throw new Error('Authentication failed');
  }

  return response;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      currentMood: 'neutral',
      streak: 0,
      habits: [],
      moodHistory: [],
      coachMessage: '',
      isLoading: false,
      currentTheme: 'A',

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ isLoading: loading }),

      analyzeMood: async (message: string) => {
        set({ isLoading: true });
        try {
          const response = await makeAuthenticatedRequest(`${API_BASE}/ai/analyze-mood`, {
            method: 'POST',
            body: JSON.stringify({ message }),
          });
          
          if (!response.ok) throw new Error('Failed to analyze mood');
          
          const { mood } = await response.json();
          set({ currentMood: mood });
          
          // Save mood entry to backend
          try {
            await makeAuthenticatedRequest(`${API_BASE}/ai/save-mood`, {
              method: 'POST',
              body: JSON.stringify({ 
                mood, 
                message 
              }),
            });
          } catch (error) {
            console.log('Note: Mood save failed, but continuing...');
          }
          
          // Add to local history
          get().addMoodEntry(mood, message);
        } catch (error) {
          console.error('Error analyzing mood:', error);
          // Fallback to simple mood detection
          const detectedMood = detectMoodSimple(message);
          set({ currentMood: detectedMood });
          get().addMoodEntry(detectedMood, message);
        } finally {
          set({ isLoading: false });
        }
      },

      coachReply: async (message: string) => {
        set({ isLoading: true });
        try {
          const { currentMood, user } = get();
          
          const response = await makeAuthenticatedRequest(`${API_BASE}/ai/coach`, {
            method: 'POST',
            body: JSON.stringify({ 
              message, 
              mood: currentMood,
              personality: user?.personality || 'fun'
            }),
          });
          
          if (!response.ok) throw new Error('Failed to get coach reply');
          
          const { reply, habits } = await response.json();
          set({ coachMessage: reply });
          
          // Clear existing habits and add new AI-generated ones
          const newHabits = habits.map((habit: string, index: number) => ({
            id: Date.now().toString() + index,
            habit,
            completed: false,
            createdAt: new Date().toISOString(),
          }));
          
          set({ habits: newHabits });
          
          // Save habits to backend
          try {
            const savePromises = habits.map((habit: string) => 
              makeAuthenticatedRequest(`${API_BASE}/habits/create-habit`, {
                method: 'POST',
                body: JSON.stringify({ 
                  habit 
                }),
              })
            );
            
            await Promise.all(savePromises);
          } catch (error) {
            console.log('Note: Habits save failed, but continuing...');
          }
          
        } catch (error) {
          console.error('Error getting coach reply:', error);
          const fallbackReply = "I'm having trouble connecting right now. Please try again in a moment!";
          set({ coachMessage: fallbackReply });
          set({ habits: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      completeHabit: async (id: string) => {
        try {
          // Mark habit as complete in backend
          try {
            await makeAuthenticatedRequest(`${API_BASE}/habits/complete-habit`, {
              method: 'POST',
              body: JSON.stringify({ habit_id: id }),
            });
          } catch (error) {
            console.log('Note: Complete habit API failed, but continuing...');
          }

          // Update local state
          set((state) => ({
            habits: state.habits.map((habit) =>
              habit.id === id ? { ...habit, completed: true } : habit
            ),
          }));
          
          // Check if all habits completed and update streak
          const { habits } = get();
          const allCompleted = habits.length > 0 && habits.every(habit => habit.completed);
          if (allCompleted) {
            get().updateStreak();
          }
        } catch (error) {
          console.error('Error completing habit:', error);
        }
      },

      addHabit: async (habit: string) => {
        try {
          const newHabit: Habit = {
            id: Date.now().toString(),
            habit,
            completed: false,
            createdAt: new Date().toISOString(),
          };
          
          // Save to backend
          try {
            await makeAuthenticatedRequest(`${API_BASE}/habits/create-habit`, {
              method: 'POST',
              body: JSON.stringify({ 
                habit 
              }),
            });
          } catch (error) {
            console.log('Note: Add habit API failed, but continuing...');
          }
          
          // Update local state
          set((state) => ({ habits: [...state.habits, newHabit] }));
        } catch (error) {
          console.error('Error adding habit:', error);
        }
      },

      addMoodEntry: (mood: string, message: string) => {
        const newEntry: MoodEntry = {
          id: Date.now().toString(),
          mood,
          message,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ moodHistory: [...state.moodHistory, newEntry] }));
      },

      updateStreak: async () => {
        try {
          // Update streak in backend
          try {
            await makeAuthenticatedRequest(`${API_BASE}/streak/update-streak`, {
              method: 'POST',
              body: JSON.stringify({}),
            });
          } catch (error) {
            console.log('Note: Streak update API failed, but continuing...');
          }

          // Update local state
          set((state) => ({ streak: state.streak + 1 }));
          
          // Refresh streak from backend
          get().loadUserData();
        } catch (error) {
          console.error('Error updating streak:', error);
        }
      },

      loadUserData: async () => {
        try {
          // Load habits
          const habitsResponse = await makeAuthenticatedRequest(`${API_BASE}/habits/habits`);
          if (habitsResponse.ok) {
            const { habits } = await habitsResponse.json();
            set({ habits: habits || [] });
          }

          // Load streak
          const streakResponse = await makeAuthenticatedRequest(`${API_BASE}/streak/streak`);
          if (streakResponse.ok) {
            const { streak } = await streakResponse.json();
            set({ streak: streak || 0 });
          }

          // Load mood history
          const moodResponse = await makeAuthenticatedRequest(`${API_BASE}/ai/mood-history?limit=50`);
          if (moodResponse.ok) {
            const { moods } = await moodResponse.json();
            set({ moodHistory: moods || [] });
          }

        } catch (error) {
          console.error('Error loading user data:', error);
        }
      },

      clearData: () => {
        set({
          habits: [],
          moodHistory: [],
          coachMessage: '',
          currentMood: 'neutral',
          streak: 0
        });
      },

      setTheme: (theme: string) => {
        set({ currentTheme: theme });
      },

      syncWithBackend: async () => {
        try {
          await get().loadUserData();
        } catch (error) {
          console.error('Error syncing with backend:', error);
        }
      }
    }),
    {
      name: 'habit-coach-storage',
      partialize: (state) => ({
        currentMood: state.currentMood,
        habits: state.habits,
        moodHistory: state.moodHistory,
        coachMessage: state.coachMessage,
        currentTheme: state.currentTheme,
        // Don't persist user data - it comes from auth store
      }),
    }
  )
);

// Simple fallback mood detection
function detectMoodSimple(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('happy') || lowerMessage.includes('good') || 
      lowerMessage.includes('great') || lowerMessage.includes('excited') ||
      lowerMessage.includes('awesome') || lowerMessage.includes('amazing')) {
    return 'joy';
  } else if (lowerMessage.includes('sad') || lowerMessage.includes('bad') || 
             lowerMessage.includes('terrible') || lowerMessage.includes('depressed') ||
             lowerMessage.includes('unhappy') || lowerMessage.includes('miserable')) {
    return 'sad';
  } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || 
             lowerMessage.includes('frustrated') || lowerMessage.includes('annoyed') ||
             lowerMessage.includes('pissed') || lowerMessage.includes('irritated')) {
    return 'angry';
  } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || 
             lowerMessage.includes('sleepy') || lowerMessage.includes('fatigued') ||
             lowerMessage.includes('drained') || lowerMessage.includes('burned out')) {
    return 'tired';
  }
  
  return 'neutral';
}

// Initialize store when user logs in
useAuthStore.subscribe(
  (state) => state.user,
  (user) => {
    if (user) {
      useStore.getState().setUser(user);
      useStore.getState().syncWithBackend();
    } else {
      useStore.getState().setUser(null);
      useStore.getState().clearData();
    }
  }
);