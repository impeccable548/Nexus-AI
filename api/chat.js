// api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Use the non-prefixed key (more secure)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const { prompt, systemInstruction } = req.body;
    
    // Combine the system personality with the user request
    const fullPrompt = `${systemInstruction}\n\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini Backend Error:', error);
    return res.status(500).json({ error: 'AI Service Temporarily Unavailable' });
  }
}
