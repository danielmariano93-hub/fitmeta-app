import { UserProfile, PlanGenerationResponse } from "@/types";

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

export const generateWorkoutPlan = async (userProfile: UserProfile): Promise<PlanGenerationResponse> => {
  if (!CLAUDE_API_KEY) {
    throw new Error("Claude API key not configured");
  }

  const systemPrompt = `Você é um especialista em:
- Hipertrofia muscular
- Endocrinologia
- Nutrição
- Redução de gordura corporal

Gere um plano de treino de 30 dias COMPLETO baseado no perfil do usuário. 
Formato da resposta: JSON estruturado com 30 dias de treino, cada um com exercises array.

Respeite a frequência de treino (3-6x/semana com rotação A-B-C ou A-B-C-D-E).`;

  const userPrompt = `Crie um plano de 30 dias para:
- Objetivo: ${userProfile.goal}
- Frequência: ${userProfile.frequency}x/semana
- Nível: ${userProfile.fitness_level}
- Meta de peso: ${userProfile.target_weight}kg
- Restrições: ${userProfile.dietary_restrictions.join(", ") || "nenhuma"}

Retorne JSON com: { "plan": { "days": [...], "nutritional_goals": {...} }, "summary": "..." }`;

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // Parse JSON from Claude response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid Claude response format");
  }

  return JSON.parse(jsonMatch[0]);
};

export const generateAIAdjustment = async (
  currentExercise: string,
  adjustment: string,
  userGoal: string
): Promise<string> => {
  if (!CLAUDE_API_KEY) {
    throw new Error("Claude API key not configured");
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Exercício: ${currentExercise}
Ajuste solicitado: ${adjustment}
Objetivo: ${userGoal}

Responda com uma sugestão breve e prática para esse ajuste.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
};
