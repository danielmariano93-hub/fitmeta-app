import { UserProfile, PlanGenerationResponse, WorkoutDay, GOALS } from "@/types";

const GROQ_API_KEY: string = (import.meta.env as any).VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

/** Erro com mensagem que pode ser mostrada ao usuário. */
export class PlanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanError";
  }
}

function buildPrompt(p: UserProfile): string {
  const goalLabels = p.goals
    .map((g) => GOALS.find((x) => x.id === g)?.label ?? g)
    .join(", ");
  const primary = GOALS.find((x) => x.id === p.primary_goal)?.label ?? p.primary_goal;
  const levels = { beginner: "iniciante", intermediate: "intermediário", advanced: "avançado" };
  const diet = p.dietary_restrictions.length ? p.dietary_restrictions.join(", ") : "nenhuma";

  return `Monte um plano de treino de 30 dias para esta pessoa.

Objetivos: ${goalLabels}
Objetivo principal (priorize este): ${primary}
Nível: ${levels[p.fitness_level]}
Disponibilidade: ${p.frequency} treinos por semana
Gênero: ${p.gender}
Altura: ${p.height} cm
Peso atual: ${p.weight} kg
Peso alvo: ${p.target_weight} kg
Restrições alimentares: ${diet}

Regras:
- Exatamente 30 objetos em "workouts", day de 1 a 30, em ordem.
- Respeite ${p.frequency} treinos por semana. Os demais dias são rest_day: true com exercises: [].
- Divida em treinos A/B/C conforme a frequência. Use o campo "type" para a letra.
- 5 a 7 exercícios por dia de treino, com nome em português.
- "reps" é string, ex: "8-12" ou "12".
- Progrida carga e volume ao longo das semanas.

Responda SOMENTE com JSON válido, sem markdown e sem texto fora do JSON:
{
  "summary": "2 frases explicando a lógica do plano",
  "nutritional_goals": {"daily_calories": 0, "protein_grams": 0, "carbs_grams": 0, "fat_grams": 0, "water_liters": 0},
  "workouts": [
    {
      "day": 1,
      "type": "A",
      "title": "Peito e tríceps",
      "focus": "Peitoral, tríceps",
      "duration_min": 55,
      "rest_day": false,
      "exercises": [
        {"name": "Supino reto com barra", "muscle": "Peitoral", "sets": 4, "reps": "8-12", "rest_seconds": 90, "form_notes": "Escápulas retraídas"}
      ]
    }
  ]
}`;
}

async function callGroq(messages: { role: string; content: string }[], maxTokens: number) {
  let res: Response;
  try {
    res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages,
      }),
    });
  } catch {
    throw new PlanError("Sem conexão com o servidor. Verifique sua internet e tente de novo.");
  }

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.error?.message ?? "";
    } catch {
      /* corpo não é JSON */
    }
    if (res.status === 401) throw new PlanError("Chave da API inválida ou expirada.");
    if (res.status === 429) throw new PlanError("Limite de uso atingido. Tente de novo em alguns minutos.");
    if (res.status === 404) throw new PlanError(`Modelo indisponível. ${detail}`);
    throw new PlanError(detail || `Falha ao gerar o plano (erro ${res.status}).`);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  if (!content) throw new PlanError("A resposta veio vazia. Tente gerar de novo.");
  return content;
}

function parseJson(raw: string): any {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new PlanError("Não consegui interpretar o plano gerado. Tente de novo.");
    try {
      return JSON.parse(match[0]);
    } catch {
      throw new PlanError("Não consegui interpretar o plano gerado. Tente de novo.");
    }
  }
}

/** Preenche dias faltantes e normaliza os campos para o app não quebrar. */
function normalize(parsed: any): PlanGenerationResponse {
  const raw: any[] = Array.isArray(parsed?.workouts) ? parsed.workouts : [];
  if (raw.length === 0) throw new PlanError("O plano veio sem treinos. Tente gerar de novo.");

  const byDay = new Map<number, any>();
  raw.forEach((w, i) => byDay.set(Number(w?.day) || i + 1, w));

  const workouts: WorkoutDay[] = [];
  for (let day = 1; day <= 30; day++) {
    const w = byDay.get(day);
    const exercises = Array.isArray(w?.exercises) ? w.exercises : [];
    const isRest = w?.rest_day === true || exercises.length === 0;

    workouts.push({
      day,
      type: String(w?.type ?? (isRest ? "—" : "A")),
      title: String(w?.title ?? (isRest ? "Descanso" : `Treino do dia ${day}`)),
      focus: String(w?.focus ?? (isRest ? "Recuperação" : "")),
      duration_min: Number(w?.duration_min) || (isRest ? 0 : 50),
      rest_day: isRest,
      completed: false,
      exercises: exercises.map((e: any, i: number) => ({
        id: `d${day}-e${i}`,
        name: String(e?.name ?? "Exercício"),
        muscle: String(e?.muscle ?? ""),
        sets: Number(e?.sets) || 3,
        reps: String(e?.reps ?? "10"),
        rest_seconds: Number(e?.rest_seconds) || 60,
        form_notes: e?.form_notes ? String(e.form_notes) : undefined,
        completed: false,
      })),
    });
  }

  const n = parsed?.nutritional_goals ?? {};
  return {
    summary: String(parsed?.summary ?? "Plano montado a partir do seu perfil."),
    workouts,
    nutritional_goals: {
      daily_calories: Number(n.daily_calories) || 0,
      protein_grams: Number(n.protein_grams) || 0,
      carbs_grams: Number(n.carbs_grams) || 0,
      fat_grams: Number(n.fat_grams) || 0,
      water_liters: Number(n.water_liters) || 2.5,
    },
  };
}

export async function generateWorkoutPlan(profile: UserProfile): Promise<PlanGenerationResponse> {
  if (!GROQ_API_KEY) {
    throw new PlanError("A chave da API não está configurada neste ambiente.");
  }

  const content = await callGroq(
    [
      {
        role: "system",
        content:
          "Você é um preparador físico com formação em fisiologia do exercício e nutrição esportiva. Responde sempre em JSON válido, em português do Brasil.",
      },
      { role: "user", content: buildPrompt(profile) },
    ],
    16000,
  );

  return normalize(parseJson(content));
}

export async function askAboutExercise(exercise: string, question: string): Promise<string> {
  if (!GROQ_API_KEY) throw new PlanError("A chave da API não está configurada neste ambiente.");
  const content = await callGroq(
    [
      {
        role: "system",
        content:
          'Preparador físico. Responda em 3 frases no máximo, em português. Retorne JSON: {"resposta": "..."}',
      },
      { role: "user", content: `Exercício: ${exercise}. Pergunta: ${question}` },
    ],
    500,
  );
  const parsed = parseJson(content);
  return String(parsed?.resposta ?? content);
}
