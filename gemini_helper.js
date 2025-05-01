import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function gemini(contents, instruction) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
    // config: {
    //   systemInstruction: instruction,
    // },
  });
  return response.text;
}
