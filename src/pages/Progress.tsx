import React, { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Flame, Trophy, RotateCcw } from "lucide-react";
import { useApp } from "@/context/AppContext";
import BottomNav from "@/components/BottomNav";

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { plan, user, reset } = useApp();

  // Hooks antes de qualquer return: o React exige ordem estável.
  const allWorkouts = plan?.workouts ?? [];

  const weeks = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => {
        const slice = allWorkouts.slice(i * 7, i * 7 + 7);
        const training = slice.filter((w) => !w.rest_day);
        return {
          n: i + 1,
          done: training.filter((w) => w.completed).length,
          total: training.length,
        };
      }),
    [allWorkouts],
  );

  if (!plan || !user) return <Navigate to="/" replace />;

  const doneTraining = plan.workouts.filter((w) => w.completed && !w.rest_day).length;
  const trainingDays = plan.workouts.filter((w) => !w.rest_day).length;
  const totalExercises = plan.workouts.reduce(
    (acc, w) => acc + w.exercises.filter((e) => e.completed).length,
    0,
  );

  const achievements = [
    { id: "first", label: "Primeiro treino", earned: doneTraining >= 1 },
    { id: "week", label: "Uma semana inteira", earned: doneTraining >= 3 },
    { id: "half", label: "Metade do plano", earned: doneTraining >= trainingDays / 2 },
    { id: "all", label: "30 dias completos", earned: doneTraining === trainingDays },
  ];

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="mx-auto max-w-app px-5 pt-8">
        <h1 className="text-2xl font-bold tracking-tight">Progresso</h1>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {[
            { v: doneTraining, l: "treinos" },
            { v: totalExercises, l: "exercícios" },
            { v: `${plan.frequency}x`, l: "por semana" },
          ].map((s) => (
            <div key={s.l} className="surface-card p-4 text-center">
              <p className="tnum text-2xl font-bold">{s.v}</p>
              <p className="mt-1 text-xs text-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-sm font-bold text-muted">Semana a semana</h2>
        <div className="space-y-2.5">
          {weeks.map((w) => (
            <div key={w.n} className="surface-card p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold">Semana {w.n}</p>
                <p className="tnum text-sm text-muted">
                  {w.done}/{w.total}
                </p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface2">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${w.total ? (w.done / w.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-sm font-bold text-muted">Conquistas</h2>
        <div className="space-y-2.5">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`surface-card flex items-center gap-3 p-4 ${a.earned ? "" : "opacity-45"}`}
            >
              {a.earned ? (
                <Trophy className="h-5 w-5 shrink-0 text-warning" />
              ) : (
                <Flame className="h-5 w-5 shrink-0 text-muted" />
              )}
              <p className="font-semibold">{a.label}</p>
            </div>
          ))}
        </div>

        <button
          className="btn-ghost mt-10"
          onClick={() => {
            if (confirm("Isso apaga seu plano atual e começa do zero. Continuar?")) {
              reset();
              navigate("/");
            }
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Começar um plano novo
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Progress;
