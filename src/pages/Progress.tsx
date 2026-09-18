import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ChevronLeft, TrendingUp, Award, Zap } from "lucide-react";

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { user, plan } = useApp();

  if (!user || !plan) {
    navigate("/onboarding");
    return null;
  }

  const completedWorkouts = plan.workouts.filter((w) => w.completed).length;
  const totalExercisesCompleted = plan.workouts.reduce(
    (sum, workout) => sum + workout.exercises.filter((ex) => ex.completed).length,
    0
  );

  // Calculate achievements
  const achievements = [
    {
      id: "first-week",
      name: "Primeira Semana",
      condition: completedWorkouts >= 3,
      icon: "🎯",
    },
    {
      id: "half-way",
      name: "Meio do Caminho",
      condition: completedWorkouts >= 15,
      icon: "🏆",
    },
    {
      id: "completed",
      name: "Conquistador",
      condition: completedWorkouts === 30,
      icon: "👑",
    },
    {
      id: "perfect-week",
      name: "Semana Perfeita",
      condition: true, // Calculation logic needed
      icon: "⭐",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-brand text-white p-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/app")} className="p-2 hover:bg-white/10 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Seu Progresso</h1>
        </div>
      </div>

      {/* Main Stats */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Total Workouts */}
          <div className="surface-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Treinos Completos</p>
                <p className="text-4xl font-bold text-foreground">{completedWorkouts}</p>
                <p className="text-xs text-muted-foreground mt-1">de 30 dias</p>
              </div>
              <div className="bg-primary/10 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-gradient-brand h-2 rounded-full"
                style={{ width: `${(completedWorkouts / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Total Exercises */}
          <div className="surface-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Exercícios Feitos</p>
                <p className="text-4xl font-bold text-foreground">{totalExercisesCompleted}</p>
                <p className="text-xs text-muted-foreground mt-1">movimentos completados</p>
              </div>
              <div className="bg-warning/10 rounded-full p-3">
                <Zap className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          {/* Days Remaining */}
          <div className="surface-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Dias Restantes</p>
                <p className="text-4xl font-bold text-foreground">{30 - completedWorkouts}</p>
                <p className="text-xs text-muted-foreground mt-1">para completar</p>
              </div>
              <div className="bg-success/10 rounded-full p-3">
                <Award className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="surface-card mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">Conquistas</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-2xl p-6 text-center border-2 transition-all ${
                  achievement.condition
                    ? "bg-gradient-brand-soft border-primary"
                    : "bg-secondary border-border opacity-50"
                }`}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="font-semibold text-foreground mb-1">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {achievement.condition ? "Desbloqueado" : "Bloqueado"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="surface-card mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">Semanas</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((week) => {
              const start = (week - 1) * 7;
              const end = Math.min(start + 7, 30);
              const weekWorkouts = plan.workouts.slice(start, end);
              const weekCompleted = weekWorkouts.filter((w) => w.completed).length;

              return (
                <div key={week} className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">Semana {week}</h4>
                    <p className="text-sm text-muted-foreground">
                      {weekCompleted}/{weekWorkouts.length}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {weekWorkouts.map((workout, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-8 rounded-lg transition-all ${
                          workout.completed ? "bg-success" : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Button */}
        <button onClick={() => navigate("/app")} className="btn-brand w-full">
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

export default Progress;
