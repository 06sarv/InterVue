// This service now calls the backend Gemini proxy endpoint instead of the Gemini API directly.

export interface InterviewConfig {
  jobRole: string;
  interviewType: 'HR' | 'Technical';
  numQuestions: number;
  timePerQuestion: number;
}

export interface Question {
  text: string;
  followUp?: string;
}

export interface Evaluation {
  sentiment: 'Positive' | 'Negative' | 'Mixed';
  score: number;
  strengths: string[];
  suggestions: string[];
  sampleAnswer: string;
}

const callGeminiProxy = async (prompt: string): Promise<string> => {
  const response = await fetch('/api/gemini-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch from Gemini proxy');
  }
  const data = await response.json();
  return data.result;
};

export const generateQuestions = async (config: InterviewConfig): Promise<Question[]> => {
  const prompt = `Generate ${config.numQuestions} ${config.interviewType} interview questions for a ${config.jobRole} position. 
Return ONLY a JSON array of objects, each with a "text" field, and nothing else. Do not include any explanation, code block, or markdown. Example: [{"text": "What is ...?"}, {"text": "Explain ..."}]`;
  const text = await callGeminiProxy(prompt);
  try {
    // Remove code block markers if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```(json)?/g, '').trim();
    }
    const questions = JSON.parse(cleanText);
    return Array.isArray(questions) ? questions : [questions];
  } catch (error) {
    console.error('Error parsing questions:', error);
    throw new Error('Failed to generate interview questions');
  }
};

export const generateFollowUp = async (question: string, answer: string): Promise<string | null> => {
  const prompt = `Given the question: "${question}" and the answer: "${answer}",\nif the answer is vague, incomplete, or contains phrases like 'I don't know' or 'I'm not sure', generate a follow-up question to clarify or encourage a better response.\nReturn only the follow-up question as plain text, or "null" if no follow-up is needed.`;
  const text = (await callGeminiProxy(prompt)).trim();
  return text === 'null' ? null : text;
};

export const evaluateInterview = async (
  questions: Question[],
  answers: string[]
): Promise<Evaluation[]> => {
  const prompt = `Given the following interview questions and answers, analyze each answer and return a JSON array where each item contains:\n- sentiment: "Positive", "Negative", or "Mixed"\n- score: number between 0-10\n- strengths: array of strings\n- suggestions: array of strings\n- sampleAnswer: a better answer\n\nQuestions and Answers:\n${questions.map((q, i) => `Q: ${q.text}\nA: ${answers[i]}`).join('\n\n')}\n\nReturn ONLY the JSON array, nothing else.\nExample: [{"sentiment":"Positive","score":8,"strengths":["clear","concise"],"suggestions":["add more detail"],"sampleAnswer":"A better answer here."}]`;
  const text = await callGeminiProxy(prompt);
  try {
    // Remove code block markers if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```(json)?/g, '').trim();
    }
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error parsing evaluation:', error);
    throw new Error('Failed to evaluate interview responses');
  }
}; 