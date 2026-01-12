/**
 * Nexus AI - Secure Integration Service
 */

const NEXUS_SYSTEM_PROMPT = `You are Nexus AI... (keep your existing prompt here)`;

export const chatWithNexus = async (userMessage, project = null, history = []) => {
  try {
    // ... (Your existing functions: generateProjectHints, chatWithNexus, etc.)

// 1. Make sure the function itself is defined correctly
export const testGeminiConnection = async () => {
  try {
    if (!API_KEY) {
      console.error('❌ No API key found');
      return false;
    }
    const model = getModel();
    const result = await model.generateContent('Say "Nexus AI is online!"');
    const response = await result.response;
    return true;
  } catch (error) {
    console.error('❌ Gemini API Connection Failed:', error.message);
    return false;
  }
};

// 2. Export EVERYTHING at once so the app can see them
export default {
  generateProjectHints,
  chatWithNexus,
  generateRoadmap,
  testGeminiConnection // <--- This was likely missing or misspelled
};

