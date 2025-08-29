import OpenAI from 'openai';

// Minimal OpenAI client setup following official docs. API key must be set.
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

