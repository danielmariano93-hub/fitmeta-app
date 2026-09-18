import { UserProfile, PlanGenerationResponse } from "@/types";

const GROQ_API_KEY: string = (import.meta.env as any).VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateWorkoutPlan = async (userProfile: UserProfile): Promise<PlanGenerationResponse> => {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not configured");
  }

  const systemPrompt = `Você é um especialista em:
- Hipertrofia muscular
- Endocrinologia
- Nutrição
- Redução de gordura corporal

Gere um plano de treino de 30 dias COMPLETO baseado no perfil do usuário.`;

  const userPrompt = `Crie um plano de 30 dias para:
- Objetivo: ${userProfile.goal}
- Frequência: ${userProfile.frequency}x/semana
- Nível: ${userProfile.fitness_level}
- Meta de peso: ${userProfile.target_weight}kg

Retorne APENAS JSON sem markdown.`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) throw new Error("Invalid response");
  return JSON.parse(jsonMatch[0]);
};

export const generateAIAdjustment = async (
  currentExercise: string,
  adjustment: string,
  userGoal: string
): Promise<string> => {
  if (!GROQ_API_KEY) throw new Error("Groq API key not configured");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 512,
      messages: [
        { role: "user", content: `Exercício: ${currentExercise}\nAjuste: ${adjustment}\nObjetivo: ${userGoal}` },
      ],
    }),
  });

  if (!response.ok) throw new Error(`Groq API error`);
  const data = await response.json();
  return data.choices[0].message.content;
};
