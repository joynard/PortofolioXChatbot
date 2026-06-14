import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Sends a chat message to Google AI Studio.
 * @param {string} apiKey - The Google AI Studio API Key.
 * @param {string} modelName - The model name (e.g., 'gemma-2-27b-it', 'gemini-2.5-flash').
 * @param {Array} history - Array of previous messages: [{ sender: 'user'|'ai', text: string }]
 * @param {string} newMessage - The latest message from the user.
 * @returns {Promise<string>} The response text from the AI.
 */
export const sendChatMessage = async (apiKey, modelName, history, newMessage) => {
  if (!apiKey) {
    throw new Error('Google AI Studio API Key is missing. Please configure it in Settings.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName || 'gemini-2.5-flash' });

    // Format historical messages to match Gemini API structure
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Received empty response from the model.');
    }
    
    return text;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Failed to communicate with Google AI Studio API.');
  }
};
