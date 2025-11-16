// src/services/emotionService.js
import axios from 'axios';
import { config } from '../config/env.js';

export class EmotionService {
  static async detectMood(message) {
    try {
      // Using HuggingFace's emotion detection model
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base',
        { inputs: message },
        {
          headers: {
            'Authorization': `Bearer ${config.huggingfaceToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const emotions = response.data[0];
      
      // Map model emotions to our mood categories
      const emotionMap = {
        'joy': 'joy',
        'anger': 'angry',
        'sadness': 'sad',
        'fear': 'sad', // Map fear to sad
        'surprise': 'neutral',
        'disgust': 'angry',
        'neutral': 'neutral'
      };

      // Get the highest confidence emotion
      const primaryEmotion = emotions.reduce((prev, current) => 
        prev.score > current.score ? prev : current
      );

      return emotionMap[primaryEmotion.label] || 'neutral';
    } catch (error) {
      console.error('HuggingFace API Error:', error.message);
      return this.fallbackMoodDetection(message);
    }
  }

  static fallbackMoodDetection(message) {
    const lowerMessage = message.toLowerCase();
    
    const moodKeywords = {
      joy: ['happy', 'good', 'great', 'awesome', 'excited', 'amazing', 'wonderful', 'fantastic'],
      sad: ['sad', 'bad', 'terrible', 'awful', 'depressed', 'unhappy', 'miserable', 'down'],
      angry: ['angry', 'mad', 'frustrated', 'annoyed', 'pissed', 'irritated', 'rage'],
      tired: ['tired', 'exhausted', 'sleepy', 'fatigued', 'drained', 'burned out', 'weary']
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return mood;
      }
    }

    return 'neutral';
  }
}