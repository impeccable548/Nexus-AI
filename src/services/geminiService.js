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
const genAI = new GoogleGenerativeAI(API_KEY);

// System prompt that defines Nexus AI's personality and capabilities
const NEXUS_SYSTEM_PROMPT = `You are Nexus AI, an intelligent project management assistant. Your role is to help users plan, manage, and execute their projects successfully.

PERSONALITY:
- Friendly, encouraging, and professional
- Give actionable, specific advice (not generic tips)
- Use emojis sparingly but effectively
- Be concise but thorough
- Focus on practical solutions

CAPABILITIES:
- Analyze project details and provide smart hints
- Suggest tech stacks and tools based on project type
- Create roadmaps and timelines
- Help with problem-solving and decision-making
- Offer team management and productivity tips

ALWAYS:
- Ask clarifying questions when needed
- Provide specific examples and actionable steps
- Reference current best practices and modern tools
- Be honest about trade-offs and challenges
- Keep responses under 300 words unless user asks for more detail

NEVER:
- Say "I'm Gemini" or mention Google - you are NEXUS AI
- Give generic advice like "work hard" or "stay focused"
- Recommend outdated tools or practices
- Be overly formal or robotic

When analyzing projects, consider:
- Project type (web, mobile, AI, marketing, etc.)
- Current progress and timeline
- Team size and resources
- Technical complexity
- User's specific goals`;

// Get the Gemini model
const getModel = () => {
  return genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
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

PROJECT DETAILS:
- Name: ${project.name}
- Description: ${project.description || 'No description provided'}
- Progress: ${project.progress}%
- Team Size: ${project.team} members
- Deadline: ${project.due}
- Status: ${project.status}

TASK: Analyze this project and provide:
1. Smart, actionable hints specific to this project (5-7 hints)
2. Recommended tech stack (if applicable)
3. Key next steps based on current progress
4. Potential challenges to watch out for

Format your response with clear sections and bullet points. Be specific to THIS project, not generic advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return getFallbackHints(project);
  }
};

/**
 * Chat with Nexus AI
 */
export const chatWithNexus = async (userMessage, project = null, conversationHistory = []) => {
  try {
    const model = getModel();
    
    // Build context from conversation history
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

INSTRUCTIONS: Respond as Nexus AI. Be helpful, specific, and actionable. If the user is asking about their project, reference the project context above. Keep your response conversational and under 200 words unless more detail is requested.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Gemini API Error:', error);
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

TASK: Create a detailed project roadmap with 5 phases. For each phase include:
- Phase name
- Key tasks (3-5 tasks)
- Estimated duration
- Success criteria

Format as a clear, organized roadmap. Be specific to this project type.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Unable to generate roadmap. Please try again.';
  }
};

/**
 * Analyze project and suggest improvements
 */
export const analyzeProject = async (project) => {
  try {
    const model = getModel();
    
    const prompt = `${NEXUS_SYSTEM_PROMPT}

PROJECT ANALYSIS REQUEST
Name: ${project.name}
Description: ${project.description || 'Not specified'}
Progress: ${project.progress}%
Team: ${project.team} members
Deadline: ${project.due}
Status: ${project.status}

TASK: Provide a comprehensive project analysis including:
1. Current health assessment (Red/Yellow/Green)
2. Key risks and challenges
3. Optimization opportunities
4. Resource allocation suggestions
5. Timeline feasibility

Be honest and constructive. Focus on actionable insights.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Unable to analyze project. Please try again.';
  }
};

/**
 * Get AI suggestions for problem-solving
 */
export const getProblemSolution = async (problem, project = null) => {
  try {
    const model = getModel();
    
    const projectInfo = project ? `\nProject Context: ${project.name} - ${project.description}` : '';
    
    const prompt = `${NEXUS_SYSTEM_PROMPT}

USER'S PROBLEM: ${problem}${projectInfo}

TASK: Help solve this problem with:
1. Quick diagnosis of the issue
2. 3-5 specific solutions (ranked by effectiveness)
3. Pros/cons for each solution
4. Recommended approach
5. Resources or tools that might help

Be practical and specific. Avoid generic advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Unable to generate solution. Please try again.';
  }
};

// Fallback responses when API fails
const getFallbackHints = (project) => {
  return `## 🎯 Quick Hints for "${project.name}"

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

Need more specific advice? Try asking me about a particular challenge!`;
};

const getFallbackResponse = (message, project) => {
  const responses = [
    `I can help with project planning, tech decisions, and problem-solving! ${project ? `Let's focus on "${project.name}". ` : ''}What specific challenge are you facing?`,
    
    `Here are some ways I can help:\n• Generate smart project hints\n• Suggest tech stacks and tools\n• Create roadmaps and timelines\n• Solve specific problems\n\nWhat would you like to explore?`,
    
    `${project ? `For "${project.name}", I recommend:` : 'Some general tips:'}\n• Start with the hardest problem\n• Ship early, iterate fast\n• Talk to users constantly\n• Keep scope minimal at first\n\nWhat specific area needs help?`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Test API connection
export const testGeminiConnection = async () => {
  try {
    const model = getModel();
    const result = await model.generateContent('Say "Nexus AI is ready!" in a friendly way.');
    const response = await result.response;
    console.log('✅ Gemini API Connected:', response.text());
    return true;
  } catch (error) {
    console.error('❌ Gemini API Connection Failed:', error);
    return false;
  }
};

export default {
  generateProjectHints,
  chatWithNexus,
  generateRoadmap,
  analyzeProject,
  getProblemSolution,
  testGeminiConnection
};