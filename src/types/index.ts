export type Goal = "hipertrofia" | "emagrecimento" | "definicao" | "forca" | "resistencia" | "saude";

export const GOALS: { id: Goal; label: string; hint: string }[] = [
  { id: "hipertrofia", label: "Ganhar massa muscular", hint: "Volume e carga progressiva" },
  { id: "emagrecimento", label: "Perder gordura", hint: "Déficit com preservação de massa" },
  { id: "definicao", label: "Definir o corpo", hint: "Recomposição corporal" },
  { id: "forca", label: "Ficar mais forte", hint: "Cargas altas, poucas repetições" },
  { id: "resistencia", label: "Ganhar condicionamento", hint: "Fôlego e recuperação" },
  { id: "saude", label: "Cuidar da saúde", hint: "Consistência acima de intensidade" },
];

export interface UserProfile {
  id: string;
  created_at: string;
  fitness_level: "beginner" | "intermediate" | "advanced";
  goals: Goal[];
  primary_goal: Goal;
  frequency: 3 | 4 | 5 | 6;
  gender: "M" | "F" | "O";
  height: number;
  weight: number;
  target_weight: number;
  dietary_restrictions: string[];
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  form_notes?: string;
  completed: boolean;
}

export interface WorkoutDay {
  day: number;
  type: string;
  title: string;
  focus: string;
  duration_min: number;
  rest_day: boolean;
  exercises: Exercise[];
  completed: boolean;
  completed_at?: string;
}

export interface NutritionalGoals {
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  water_liters: number;
}

export interface WorkoutPlan {
  id: string;
  created_at: string;
  summary: string;
  frequency: 3 | 4 | 5 | 6;
  workouts: WorkoutDay[];
  nutritional_goals: NutritionalGoals;
}

export interface PlanGenerationResponse {
  summary: string;
  workouts: WorkoutDay[];
  nutritional_goals: NutritionalGoals;
}
