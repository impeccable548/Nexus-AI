/**
 * Nexus AI - Secure Integration Service
 */

const NEXUS_SYSTEM_PROMPT = `You are Nexus AI... (keep your existing prompt here)`;

export const chatWithNexus = async (userMessage, project = null, history = []) => {
  try {
    // 1. Prepare the context
    const projectContext = project ? `Project: ${project.name}, Progress: ${project.progress}%` : '';
    const fullUserPrompt = `${projectContext}\nUser Message: ${userMessage}`;

    // 2. Call YOUR API, not Google's
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: fullUserPrompt,
        systemInstruction: NEXUS_SYSTEM_PROMPT 
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error('❌ Nexus AI Error:', error);
    // Return your existing fallback logic here
    return "I'm having trouble connecting to my brain right now. Please check your connection.";
  }
};
