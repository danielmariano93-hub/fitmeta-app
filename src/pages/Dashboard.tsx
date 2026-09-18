import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Calendar, Flame, TrendingUp } from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, plan } = useApp();

  if (!user || !plan) {
    navigate("/onboarding");
    return null;
  }

  // Calculate streak
  const streak = useMemo(() => {
    let count = 0;
    for (let i = plan.workouts.length - 1; i >= 0; i--) {
      if (plan.workouts[i].completed) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [plan]);

  // Get current day
  const today = new Date().getDate();
  const currentWorkout = plan.workouts.find((w) => w.day === Math.min(today, 30)) || plan.workouts[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-brand text-white p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Bem-vindo, {user.gender === "M" ? "💪" : "👸"}</h1>
          <p className="text-white/80">Sua jornada de 30 dias já começou</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Streak */}
          <div className="surface-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">Sequência</p>
                <p className="text-4xl font-bold text-foreground">{streak}</p>
              </div>
              <div className="bg-warning/10 rounded-full p-3">
                <Flame className="w-6 h-6 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">dias consecutivos</p>
          </div>

          {/* Progress */}
          <div className="surface-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">Progresso</p>
                <p className="text-4xl font-bold text-foreground">
                  {Math.round((plan.workouts.filter((w) => w.completed).length / 30) * 100)}%
                </p>
              </div>
              <div className="bg-success/10 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-gradient-brand h-2 rounded-full transition-all"
                style={{
                  width: `${(plan.workouts.filter((w) => w.completed).length / 30) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Weight Target */}
          <div className="surface-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">Meta de Peso</p>
                <p className="text-2xl font-bold text-foreground">
                  {user.weight}
                  <span className="text-sm text-muted-foreground"> / {user.target_weight}kg</span>
                </p>
              </div>
              <div className="bg-primary/10 rounded-full p-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{user.target_weight - user.weight}kg para atingir</p>
          </div>
        </div>

        {/* Current Workout */}
        <div className="bg-gradient-brand-soft rounded-3xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground mb-1">Treino de Hoje</p>
              <h2 className="text-3xl font-bold text-foreground">
                Dia {currentWorkout.day} • Treino {currentWorkout.type}
              </h2>
            </div>
            <button
              onClick={() => navigate(`/app/workout/${currentWorkout.day}`)}
              className="btn-brand"
            >
              Iniciar Treino
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentWorkout.exercises.slice(0, 4).map((ex) => (
              <div key={ex.id} className="bg-card rounded-2xl p-4">
                <p className="font-semibold text-foreground text-sm mb-1">{ex.name}</p>
                <p className="text-xs text-muted-foreground">
                  {ex.sets}x{ex.reps} {ex.weight ? `- ${ex.weight}${ex.weight_unit}` : ""}
                </p>
              </div>
            ))}
          </div>
          {currentWorkout.exercises.length > 4 && (
            <p className="text-sm text-muted-foreground mt-4">
              +{currentWorkout.exercises.length - 4} mais exercícios
            </p>
          )}
        </div>

        {/* Calendar Overview */}
        <div className="surface-card">
          <h3 className="text-xl font-bold text-foreground mb-6">Seu Mês</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(`/app/workout/${i + 1}`)}
                className={`aspect-square rounded-lg font-semibold transition-all ${
                  plan.workouts[i]?.completed
                    ? "bg-success text-white"
                    : i + 1 === today
                      ? "bg-primary text-white ring-2 ring-primary/50"
                      : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-12">
          <button
            onClick={() => navigate("/app/progress")}
            className="btn-ghost flex-1"
          >
            Ver Progresso
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
