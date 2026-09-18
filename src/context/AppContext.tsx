import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile, WorkoutPlan } from "@/types";

interface AppContextType {
  user: UserProfile | null;
  plan: WorkoutPlan | null;
  setUser: (user: UserProfile) => void;
  setPlan: (plan: WorkoutPlan) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider value={{ user, setUser, plan, setPlan, isLoading, setIsLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
