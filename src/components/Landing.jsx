/**
 * Nexus AI - Gemini Integration Service
 * Powers the smart AI assistant with Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('⚠️ GEMINI API KEY NOT FOUND! Add REACT_APP_GEMINI_API_KEY to your .env file');
}
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// System prompt that defines Nexus AI's personality
const NEXUS_SYSTEM_PROMPT = `You are Nexus AI, an intelligent project management assistant built to help users plan and execute their projects successfully.

PERSONALITY:
- Friendly, encouraging, and professional
- Give actionable, specific advice (not generic tips)
- Be concise but thorough
- Focus on practical solutions

YOUR ROLE:
- Analyze project details and provide smart, personalized hints
- Suggest tech stacks and tools based on project type
- Create roadmaps and timelines
- Help with problem-solving and decision-making
- Offer team management and productivity tips

IMPORTANT RULES:
- NEVER say "I'm Gemini" or mention Google - you are NEXUS AI
- Give SPECIFIC advice with examples, not generic tips
- Keep responses under 300 words unless asked for more detail
- Use markdown formatting (##, **, bullet points)
- Be encouraging but honest about challenges

When analyzing projects, consider: project type, progress, team size, timeline, and user's specific goals.`;

// Get the Gemini model
const getModel = () => {
  if (!genAI) {
    throw new Error('Gemini API not initialized. Check your API key.');
  }
  return genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
};

/**
 * Generate AI hints for a project
 */
export const generateProjectHints = async (project) => {
  try {
    const model = getModel();
    
    const prompt = `${NEXUS_SYSTEM_PROMPT}

USER'S PROJECT:
- Name: ${project.name}
- Description: ${project.description || 'No description provided'}
- Progress: ${project.progress}%
- Team Size: ${project.team} members
- Deadline: ${project.due}
- Status: ${project.status}

TASK: As Nexus AI, analyze this project and provide:
1. **Smart Insights** - 5-7 specific, actionable hints for THIS project (not generic advice)
2. **Recommended Tech Stack** - Suggest specific tools/frameworks if relevant
3. **Next Steps** - Based on ${project.progress}% progress, what should they do NOW?
4. **Potential Challenges** - What to watch out for

Be specific to THIS project. Use markdown formatting. Be encouraging but practical.`;

    console.log('🤖 Calling Gemini API for project hints...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Gemini API response received:', text.substring(0, 100) + '...');
    return text;
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return getFallbackHints(project);
  }
};

/**
 * Chat with Nexus AI
 */
export const chatWithNexus = async (userMessage, project = null, conversationHistory = []) => {
  try {
    const model = getModel();
    
    // Build context from conversation history (last 5 messages)
    let contextMessages = conversationHistory.slice(-5).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Nexus AI'}: ${msg.content}`
    ).join('\n');
    
    // Add project context if available
    let projectContext = '';
    if (project) {
      projectContext = `\n\nCURRENT PROJECT CONTEXT:
- Name: ${project.name}
- Description: ${project.description || 'Not specified'}
- Progress: ${project.progress}%
- Team: ${project.team} members
- Deadline: ${project.due}`;
    }
    
    const prompt = `${NEXUS_SYSTEM_PROMPT}

CONVERSATION HISTORY:
${contextMessages}
${projectContext}

USER MESSAGE: ${userMessage}

RESPOND AS NEXUS AI: Be helpful, specific, and actionable. If discussing the project, reference the context above. Keep it conversational and under 200 words unless more detail is requested. Use markdown formatting.`;

    console.log('🤖 Calling Gemini API for chat...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Gemini chat response received');
    return text;
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return getFallbackResponse(userMessage, project);
  }
};

/**
 * Get roadmap suggestions from AI
 */
export const generateRoadmap = async (project) => {
  try {
    const model = getModel();
    
    const prompt = `${NEXUS_SYSTEM_PROMPT}

PROJECT: ${project.name}
DESCRIPTION: ${project.description || 'Not specified'}
CURRENT PROGRESS: ${project.progress}%

TASK: As Nexus AI, create a detailed project roadmap with 5 phases. For each phase include:
- Phase name
- Key tasks (3-5 specific tasks)
- Estimated duration
- Success criteria

Format using markdown. Be specific to this project type.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return 'Unable to generate roadmap. Please check your API connection.';
  }
};

// Fallback responses when API fails
const getFallbackHints = (project) => {
  return `## 🎯 Quick Hints for "${project.name}"

**Note:** Using fallback mode (API connection issue)

Based on your ${project.progress}% progress:

**Next Steps:**
- Break down remaining work into small, manageable tasks
- Focus on core features before adding extras
- Test frequently with real users
- Document as you go

**Tech Recommendations:**
- Use proven, well-documented tools
- Prioritize developer experience
- Consider scalability from the start

**Timeline Tips:**
- Build in buffer time (20-30%)
- Have weekly check-ins
- Adjust scope if needed

**⚠️ API Note:** For smarter, personalized hints, ensure your Gemini API key is configured correctly.`;
};

const getFallbackResponse = (message, project) => {
  const responses = [
    `I can help with project planning, tech decisions, and problem-solving! ${project ? `Let's focus on "${project.name}". ` : ''}What specific challenge are you facing?\n\n**Note:** Using fallback mode. Check API connection for smarter responses.`,
    
    `Here are some ways I can help:\n• Generate smart project hints\n• Suggest tech stacks and tools\n• Create roadmaps and timelines\n• Solve specific problems\n\nWhat would you like to explore?\n\n**Note:** API connection issue. Responses will be more generic.`,
    
    `${project ? `For "${project.name}", I recommend:` : 'Some general tips:'}\n• Start with the hardest problem\n• Ship early, iterate fast\n• Talk to users constantly\n• Keep scope minimal at first\n\nWhat specific area needs help?\n\n**Note:** Enable API for personalized advice.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Test API connection
export const testGeminiConnection = async () => {
  try {
    if (!API_KEY) {
      console.error('❌ No API key found');
      return false;
    }
    const model = getModel();
    const result = await model.generateContent('Say "Nexus AI is online!" in a friendly way.');
    const response = await result.response;
    console.log('✅ Gemini API Connected:', response.text());
    return true;
  } catch (error) {
    console.error('❌ Gemini API Connection Failed:', error.message);
    return false;
  }
};

export default {
  generateProjectHints,
  chatWithNexus,
  generateRoadmap,
  testGeminiConnection
};