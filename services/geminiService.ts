
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

export async function askWithContext(context: string, question: string): Promise<string> {
  const prompt = `
You are an expert AI Learning Assistant. Your goal is to answer questions based ONLY on the provided context. Do not use any external knowledge. If the answer is not found in the context, state that clearly.

Context:
---
${context}
---

Question: ${question}

Your task is to provide a clear and concise answer to the question above using only the provided context. After the answer, you MUST cite the source as "Source: Provided Document".
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error interacting with AI: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI."
  }
}
