
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key missing. Intelligence features will be limited.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateInnovationResponse = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the AI representative for Voicemail Automation. You are an expert in automation, Google Sheets, and outbound sales systems. Your goal is to explain how our Intelligent Voicemail Automation System prevents duplicate leads and automates follow-up using n8n and Slybroadcast.",
        temperature: 0.7,
      },
    });
    return response.text || "Analyzing request...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our AI systems are currently at maximum capacity. Please try again shortly.";
  }
};

export async function* generateInnovationStream(prompt: string) {
  const ai = getAIClient();
  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the AI assistant for Voicemail Automation. Explain how our voicemail automation platform works using Google Sheets as a database. Focus on the 'Logic Gate' that prevents double-dialing and the efficiency of the 5-day nurture sequence using n8n. Be concise and professional.",
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    yield "Connection to Intelligence Core interrupted.";
  }
}

export const brainstormIdeas = async (industry: string): Promise<string> => {
  const ai = getAIClient();
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user works in the ${industry} industry. Generate 3 specific ways Voicemail Automation's sheet-driven automation architecture could be adapted for this industry using n8n. Format as bullet points. Include "Potential Efficiency Gain" for each.`,
    });
    return response.text || "No solutions generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating solutions.";
  }
};
