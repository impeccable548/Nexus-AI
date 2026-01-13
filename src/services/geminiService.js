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
    console.log('🤖 Calling backend for project hints...');
    
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

    console.log('✅ Project hints received');
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
    console.log('🤖 Calling backend for chat...');
    
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

    console.log('✅ Chat response received');
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
    console.log('🤖 Calling backend for roadmap...');
    
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

    console.log('✅ Roadmap received');
    return data.roadmap;
    
  } catch (error) {
    console.error('❌ Error generating roadmap:', error);
    return 'Unable to generate roadmap. Please try again.';
  }
};

/**
 * Test backend connection
 */
export const testGeminiConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/test`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Backend connected:', data.message);
      return true;
    } else {
      console.error('❌ Backend test failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
};

// Fallback responses when backend is unavailable
const getFallbackHints = (project) => {
  return `## 🎯 Quick Hints for "${project.name}"

**⚠️ Note:** Backend unavailable. Using fallback mode.

Based on your ${project.progress}% progress:

**Next Steps:**
- Break down remaining work into small tasks
- Focus on core features first
- Test frequently with real users
- Document as you go

**Tech Recommendations:**
- Use proven, well-documented tools
- Prioritize developer experience
- Consider scalability

**Timeline Tips:**
- Build in buffer time (20-30%)
- Have weekly check-ins
- Adjust scope if needed`;
};

const getFallbackResponse = (message, project) => {
  return `I can help with project planning and problem-solving! ${project ? `Let's focus on "${project.name}". ` : ''}What specific challenge are you facing?\n\n**⚠️ Note:** Backend unavailable. Reconnect for smarter AI responses.`;
};

export default {
  generateProjectHints,
  chatWithNexus,
  generateRoadmap,
  testGeminiConnection
};