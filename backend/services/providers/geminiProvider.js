import { GoogleGenAI } from "@google/genai";

class GeminiProvider {
  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async askAI(message, history, systemPrompt) {
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const chatHistory = (Array.isArray(history) ? history : [])
      .filter(
        (msg) =>
          msg &&
          (msg.role === "user" || msg.role === "assistant") &&
          typeof msg.content === "string" &&
          msg.content.trim().length > 0
      )
      .map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content.trim() }],
      }));

    // Gemini requires the first history turn to be from the user.
    while (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory.shift();
    }

    try {
      const result = await this.genAI.models.generateContent({
        model: modelName,
        contents: [
          ...chatHistory,
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        config: {
          systemInstruction: systemPrompt,
        },
      });

      return result.text || "";
    } catch (error) {
      const errorMessage = String(error?.message || error || "");
      if (
        error?.status === 429 ||
        error?.code === 429 ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("quota")
      ) {
        const quotaError = new Error(
          "Gemini quota exceeded. Please check your Google AI Studio billing/quota settings or try again later."
        );
        quotaError.statusCode = 429;
        throw quotaError;
      }

      throw error;
    }
  }
}

export default GeminiProvider;
