/* User Profile */
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  fitness_level: "beginner" | "intermediate" | "advanced";
  goal: "hipertrofia" | "emagrecimento" | "definição" | "força";
  frequency: 3 | 4 | 5 | 6;
  gender: "M" | "F";
  height: number; // cm
  weight: number; // kg
  target_weight: number; // kg
  dietary_restrictions: string[];
  experience_years: number;
}

/* Workout Plan */
export interface WorkoutPlan {
  id: string;
  user_id: string;
  created_at: string;
  start_date: string;
  end_date: string;
  frequency: 3 | 4 | 5 | 6;
  workouts: WorkoutDay[];
  nutritional_goals: NutritionalGoals;
}

export interface WorkoutDay {
  day: number; // 1-30
  type: string; // "A", "B", "C", etc
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
  completed_at?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  weight_unit: "kg" | "lb";
  rest_seconds: number;
  form_notes?: string;
  completed: boolean;
  reps_completed?: number;
  weight_used?: number;
}

/* Nutritional Goals */
export interface NutritionalGoals {
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  water_liters: number;
}

/* Progress Tracking */
export interface ProgressLog {
  id: string;
  user_id: string;
  date: string;
  workout_day_id: string;
  weight: number;
  exercises_completed: number;
  total_exercises: number;
  notes: string;
  water_intake: number;
  sleep_hours: number;
}

/* Badges/Achievements */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
  condition: string; // "7-day-streak", "30-days-complete", etc
}

/* Claude Request/Response */
export interface PlanGenerationRequest {
  user_profile: UserProfile;
  system_prompt: string;
}

export interface PlanGenerationResponse {
  plan: WorkoutPlan;
  summary: string;
}
