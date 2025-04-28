require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

// Polyfill fetch for Node.js environments
if (!global.fetch) {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/generate-question', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Generate an interview question about ${topic} with ${difficulty} difficulty level. 
    The question should be clear, concise, and relevant to real-world scenarios.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ question: text });
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const { question, answer } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Evaluate this answer to the interview question: "${question}"
    
    Answer: ${answer}
    
    Please provide:
    1. A score out of 10
    2. Key strengths
    3. Areas for improvement
    4. A sample better answer`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ evaluation: text });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

// Gemini proxy endpoint for frontend
app.post('/api/gemini-proxy', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ result: text });
  } catch (error) {
    console.error('Error in Gemini proxy:', error);
    res.status(500).json({ error: 'Failed to process Gemini request' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 