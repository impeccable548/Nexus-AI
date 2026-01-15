/**
 * Nexus AI - Frontend Service
 * Calls backend API (keeps Gemini key secure)
 */

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Generate AI hints for a project
 */
export const generateProjectHints = async (project) => {
  try {
    console.log('🤖 Calling Nexus AI for project hints...');

    const response = await fetch(`${API_URL}/project-hints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate hints');
    }

    return data.hints;
  } catch (error) {
    console.error('❌ Error generating hints:', error);
    return getFallbackHints(project);
  }
};

/**
 * Chat with Nexus AI
 */
export const chatWithNexus = async (userMessage, project = null, conversationHistory = []) => {
  try {
    console.log('🤖 Sending message to Nexus AI...');

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: userMessage,
        project,
        conversationHistory 
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to get response');
    }

    return data.response;
  } catch (error) {
    console.error('❌ Error in chat:', error);
    return getFallbackResponse(userMessage, project);
  }
};

/**
 * Generate roadmap
 */
export const generateRoadmap = async (project) => {
  try {
    console.log('🤖 Generating roadmap with Nexus AI...');

    const response = await fetch(`${API_URL}/roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate roadmap');
    }

    return data.roadmap;
  } catch (error) {
    console.error('❌ Error generating roadmap:', error);
    return 'Unable to generate roadmap. Please try again.';
  }
};

/**
 * Test Nexus connection
 */
export const testNexusConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/test`);
    const data = await response.json();

    if (data.success) {
      console.log('✅ Nexus AI connected:', data.message);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Nexus connection failed:', error.message);
    return false;
  }
};

// Fallbacks (Same as yours, but updated note)
const getFallbackHints = (project) => {
  return `## 🎯 Quick Hints for "${project.name}"\n\n**⚠️ Note:** Connection to Nexus AI is currently offline. Using local fallback mode.`;
};

const getFallbackResponse = (message, project) => {
  return `I can help with project planning! ${project ? `Let's focus on "${project.name}". ` : ''}What challenge are you facing?\n\n**⚠️ Note:** Nexus AI is offline. Reconnect for smarter insights.`;
};

export default {
  generateProjectHints,
  chatWithNexus,
  generateRoadmap,
  testNexusConnection
};
