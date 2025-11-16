// src/services/groqService.js
import Groq from 'groq-sdk';
import { config } from '../config/env.js';

const groq = config.groqApiKey ? new Groq({
  apiKey: config.groqApiKey
}) : null;

export class GroqService {
  static async getCoachReply(message, mood, personality = 'fun') {
    console.log('🚀 Calling Groq API with real AI...');
    console.log('📝 Message:', message);
    console.log('🎭 Mood:', mood);
    console.log('👤 Personality:', personality);
    
    // Check if API key is configured
    if (!config.groqApiKey || !groq) {
      console.error('❌ GROQ_API_KEY not configured in environment variables');
      throw new Error('AI service not configured - please add GROQ_API_KEY to your .env file');
    }

    try {
      const personalityPrompts = {
        fun: "You are a fun, energetic, and supportive habit coach. Use emojis, be enthusiastic, and keep things light-hearted. Provide personalized, specific advice based on the user's exact situation.",
        strict: "You are a strict, motivational coach. Be direct, focused on goals, and push for excellence. No nonsense approach. Give very specific, actionable advice. Be tough but fair.",
        chill: "You are a calm, understanding coach. Be empathetic, patient, and focus on sustainable progress without pressure. Provide gentle, personalized guidance."
      };

      const prompt = `
        ${personalityPrompts[personality]}
        
        **USER'S EXACT SITUATION**: "${message}"
        **USER'S CURRENT MOOD**: ${mood}
        
        **CRITICAL INSTRUCTION**: Generate habits that are HIGHLY SPECIFIC and DIRECTLY RELEVANT to the user's exact situation above. 
        Do NOT use generic habits like "drink water" or "take deep breaths" unless specifically relevant to their situation.

        **EXAMPLES OF GOOD HABITS**:
        - If user says "work deadlines": "Break down one project into 3 smaller tasks" 
        - If user says "can't sleep": "Write down racing thoughts in a journal for 5 minutes"
        - If user says "exercise motivation": "Try a 10-minute YouTube home workout"
        - If user says "social anxiety": "Practice one conversation starter in the mirror"
        
        **YOUR TASKS**:
        1. Provide a motivational response that directly addresses: "${message}"
        2. Suggest 3-4 highly specific, actionable habits that would help with: "${message}"
        3. Make sure habits are personalized and relevant to their exact situation
        
        **RESPONSE FORMAT - MUST BE VALID JSON**:
        {
          "reply": "Your personalized motivational response that directly addresses their specific situation",
          "habits": ["specific habit 1", "specific habit 2", "specific habit 3", "specific habit 4"]
        }

        **IMPORTANT**: The "habits" array must contain simple strings only, not objects.
      `;

      console.log('🤖 Calling Groq API with model: llama-3.1-8b-instant');
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an AI habit coach that provides highly personalized, specific habit suggestions based on the user's exact situation and mood. Always respond with valid JSON in the specified format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.8,
        max_tokens: 1024,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content;
      console.log('✅ Groq API Response Received:', responseText);
      
      if (!responseText) {
        throw new Error('Empty response from Groq API');
      }

      let response;
      try {
        response = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', responseText);
        throw new Error('Invalid JSON response from AI');
      }
      
      // Validate response structure
      if (!response.reply || !response.habits || !Array.isArray(response.habits)) {
        console.error('❌ Invalid response format:', response);
        throw new Error('Invalid response format from AI - missing reply or habits array');
      }

      // Ensure habits are simple strings
      const simpleHabits = response.habits.map(habit => {
        if (typeof habit === 'string') {
          return habit;
        } else if (habit && typeof habit === 'object') {
          // Extract text from object format
          return habit.name || habit.description || habit.action || JSON.stringify(habit);
        } else {
          return String(habit);
        }
      });

      console.log('🎉 AI-Generated Personalized Habits:', simpleHabits);
      
      return {
        reply: response.reply,
        habits: simpleHabits
      };
      
    } catch (error) {
      console.error('❌ Groq API Error:', error.message);
      
      // Provide more specific error messages
      if (error.message.includes('model_decommissioned')) {
        throw new Error('The AI model has been updated. Please use llama-3.1-8b-instant or llama-3.1-70b-versatile');
      } else if (error.message.includes('Invalid API Key')) {
        throw new Error('Invalid Groq API key. Please check your .env file');
      } else if (error.message.includes('rate limit')) {
        throw new Error('API rate limit exceeded. Please try again in a moment');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }

  // Optional: Method to test API connection
  static async testConnection() {
    if (!config.groqApiKey || !groq) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: "Say 'Hello, AI Habit Coach is working!' in JSON format: {\"message\": \"your response\"}"
          }
        ],
        model: "llama-3.1-8b-instant",
        max_tokens: 50,
        response_format: { type: "json_object" }
      });

      return { 
        success: true, 
        message: 'Groq API connection successful',
        response: completion.choices[0]?.message?.content 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}