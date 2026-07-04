import GeminiProvider from "./providers/geminiProvider.js";

const VALID_DEPARTMENTS = [
  "Pediatrics",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Oncology",
  "Radiology",
  "Physical Therapy",
  "Dermatology",
  "ENT",
];

const SYSTEM_PROMPT = `You are MedCare AI, a medical triage assistant for a hospital management system. Your role is to help patients identify which hospital department they should visit based on their symptoms.

IMPORTANT RULES:
- NEVER diagnose conditions or prescribe medications
- NEVER provide specific medical advice
- Always ask 2-3 clarifying questions before suggesting a department
- If symptoms sound life-threatening (chest pain, difficulty breathing, severe bleeding, stroke symptoms, etc.), immediately flag urgency as "urgent" and advise seeking emergency care

You MUST respond in valid JSON format with this exact structure:
{
  "reply": "Your conversational response text here",
  "suggestedDepartment": null or one of the valid departments,
  "urgency": null or "routine" or "soon" or "urgent"
}

Valid departments (ONLY suggest from this list):
${VALID_DEPARTMENTS.join(", ")}

Urgency levels:
- "routine" — can be scheduled at convenience
- "soon" — should be seen within a few days
- "urgent" — needs immediate medical attention

Guidelines:
- Set suggestedDepartment and urgency to null while you are still asking clarifying questions
- Only set suggestedDepartment once you have enough information to make a recommendation
- Keep replies friendly, concise, and empathetic
- If symptoms don't clearly map to any department, suggest the most relevant one and explain why`;

function getProvider() {
  const providerName = process.env.AI_PROVIDER || "gemini";
  switch (providerName) {
    case "gemini":
      return new GeminiProvider();
    default:
      throw new Error(`Unknown AI provider: ${providerName}`);
  }
}

function parseAIResponse(rawText) {
  let text = rawText.trim();

  // Strip markdown code fences if present
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(text);
    const result = {
      reply: parsed.reply || text,
      suggestedDepartment: null,
      urgency: null,
    };

    if (parsed.suggestedDepartment && VALID_DEPARTMENTS.includes(parsed.suggestedDepartment)) {
      result.suggestedDepartment = parsed.suggestedDepartment;
    }

    if (parsed.urgency && ["routine", "soon", "urgent"].includes(parsed.urgency)) {
      result.urgency = parsed.urgency;
    }

    return result;
  } catch {
    // If JSON parsing fails, return raw text as reply
    return {
      reply: rawText,
      suggestedDepartment: null,
      urgency: null,
    };
  }
}

export async function askAI(message, history) {
  const provider = getProvider();
  const rawResponse = await provider.askAI(message, history, SYSTEM_PROMPT);
  return parseAIResponse(rawResponse);
}
