import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey : process.env.AI_API_KEY});

async function getAIResult(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
}

export default getAIResult;

