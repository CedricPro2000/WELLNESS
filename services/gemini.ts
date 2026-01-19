
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

export const generateWellnessReport = async (language: string): Promise<ScanResult> => {
  // Initialize with named parameter using process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as a world-class public health nutrition expert focused on the African continent.
  The user just performed a fingertip wellness scan. 
  Generate a realistic wellness report in ${language}.
  Be culturally sensitive and suggest affordable African ingredients (e.g., cassava, yams, greens, grains).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Using responseSchema for reliable extraction as recommended
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'Wellness score between 70 and 95',
            },
            nutrition: {
              type: Type.STRING,
              description: 'Short sentence about nutrition advice using local staples',
            },
            hydration: {
              type: Type.STRING,
              description: 'Short sentence about water intake based on tropical climate',
            },
            localFoods: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 local food names',
            },
            status: {
              type: Type.STRING,
              description: 'Status level: Good, Attention, or Poor',
            }
          },
          required: ["score", "nutrition", "hydration", "localFoods", "status"]
        }
      }
    });

    // .text is a property, not a method
    const jsonStr = response.text?.trim() || '{}';
    const data = JSON.parse(jsonStr);

    return {
      score: data.score || 85,
      nutrition: data.nutrition || "Ensure balanced intake of leafy greens.",
      hydration: data.hydration || "Increase water intake during peak heat hours.",
      localFoods: data.localFoods || ["Cassava", "Moringa", "Amaranth"],
      status: (data.status as 'Good' | 'Attention' | 'Poor') || "Good"
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data in case of error
    return {
      score: 82,
      nutrition: "Your nutrition is stable. Add more fiber using local grains.",
      hydration: "Good hydration levels, keep drinking consistently.",
      localFoods: ["Maize", "Beans", "Spinach"],
      status: "Good"
    };
  }
};
