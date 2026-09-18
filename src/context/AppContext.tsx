import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, WorkoutPlan } from "@/types";

const KEY_USER = "fitmeta.user";
const KEY_PLAN = "fitmeta.plan";

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota cheia ou modo privado — segue sem persistir */
  }
}

interface AppContextType {
  user: UserProfile | null;
  plan: WorkoutPlan | null;
  setUser: (u: UserProfile | null) => void;
  setPlan: (p: WorkoutPlan | null) => void;
  toggleExercise: (day: number, exerciseId: string) => void;
  finishWorkout: (day: number) => void;
  reset: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => load<UserProfile>(KEY_USER));
  const [plan, setPlanState] = useState<WorkoutPlan | null>(() => load<WorkoutPlan>(KEY_PLAN));

  useEffect(() => {
    if (user) save(KEY_USER, user);
  }, [user]);

  useEffect(() => {
    if (plan) save(KEY_PLAN, plan);
  }, [plan]);

  const setUser = (u: UserProfile | null) => setUserState(u);
  const setPlan = (p: WorkoutPlan | null) => setPlanState(p);

  const toggleExercise = (day: number, exerciseId: string) => {
    setPlanState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        workouts: prev.workouts.map((w) =>
          w.day !== day
            ? w
            : {
                ...w,
                exercises: w.exercises.map((e) =>
                  e.id === exerciseId ? { ...e, completed: !e.completed } : e,
                ),
              },
        ),
      };
    });
  };

  const finishWorkout = (day: number) => {
    setPlanState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        workouts: prev.workouts.map((w) =>
          w.day !== day ? w : { ...w, completed: true, completed_at: new Date().toISOString() },
        ),
      };
    });
  };

  const reset = () => {
    localStorage.removeItem(KEY_USER);
    localStorage.removeItem(KEY_PLAN);
    setUserState(null);
    setPlanState(null);
  };

  return (
    <AppContext.Provider
      value={{ user, plan, setUser, setPlan, toggleExercise, finishWorkout, reset }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp precisa estar dentro de AppProvider");
  return ctx;
};
