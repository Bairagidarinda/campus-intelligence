import { createOpenAI } from "@ai-sdk/openai";

console.log("[groq.ts] GROQ_API_KEY at import:", !!process.env.GROQ_API_KEY, "length:", process.env.GROQ_API_KEY?.length);

export const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});
