import React, { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronRight, Flame, Timer, Moon } from "lucide-react";
import { useApp } from "@/context/AppContext";
import BottomNav from "@/components/BottomNav";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, plan } = useApp();

  // Hooks antes de qualquer return: o React exige ordem estável.
  const workouts = plan?.workouts ?? [];

  const today = useMemo(
    () =>
      workouts.find((w) => !w.completed && !w.rest_day) ??
      workouts.find((w) => !w.completed) ??
      workouts[0],
    [workouts],
  );

  const streak = useMemo(() => {
    let s = 0;
    for (const w of workouts) {
      if (w.completed) s++;
      else if (!w.rest_day) break;
    }
    return s;
  }, [workouts]);

  if (!plan || !user || !today) return <Navigate to="/" replace />;

  const done = plan.workouts.filter((w) => w.completed).length;
  const trainingDays = plan.workouts.filter((w) => !w.rest_day).length;
  const doneTraining = plan.workouts.filter((w) => w.completed && !w.rest_day).length;
  const n = plan.nutritional_goals;

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="mx-auto max-w-app px-5 pt-8">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Seu plano</h1>
          {streak > 0 && (
            <span className="chip text-coral">
              <Flame className="h-3.5 w-3.5" />
              {streak} seguidos
            </span>
          )}
        </div>

        {/* Herói: os 30 dias de uma vez */}
        <div className="surface-card mt-6 p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold text-muted">Progresso</p>
            <p className="tnum text-sm font-bold">
              {doneTraining} de {trainingDays} treinos
            </p>
          </div>

          <div className="mt-4 grid grid-cols-10 gap-1.5">
            {plan.workouts.map((w) => {
              const isToday = w.day === today.day;
              let cls = "bg-surface2";
              if (w.completed) cls = "bg-primary";
              else if (w.rest_day) cls = "bg-surface2/50";
              return (
                <button
                  key={w.day}
                  onClick={() => navigate(`/app/workout/${w.day}`)}
                  aria-label={`Dia ${w.day}`}
                  className={`aspect-square rounded-[5px] ${cls} ${
                    isToday ? "ring-2 ring-coral ring-offset-2 ring-offset-surface" : ""
                  }`}
                />
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-sm bg-primary" /> Feito
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-sm bg-surface2" /> A fazer
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-2.5 w-2.5 rounded-sm ring-2 ring-coral" /> Hoje
            </span>
          </div>
        </div>

        {/* Treino de hoje */}
        <h2 className="mb-3 mt-8 text-sm font-bold text-muted">
          {today.rest_day ? "Hoje é descanso" : "Próximo treino"}
        </h2>

        <button
          onClick={() => navigate(`/app/workout/${today.day}`)}
          className="surface-card flex w-full items-center gap-3 p-4 text-left"
        >
          <div className="letter-badge">
            {today.rest_day ? <Moon className="h-4 w-4" /> : today.type}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{today.title}</p>
            <p className="text-sm text-muted">
              Dia {today.day}
              {!today.rest_day && ` · ${today.exercises.length} exercícios · ${today.duration_min} min`}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
        </button>

        {/* Metas diárias */}
        <h2 className="mb-3 mt-8 text-sm font-bold text-muted">Metas do dia</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Calorias", value: n.daily_calories, unit: "kcal" },
            { label: "Proteína", value: n.protein_grams, unit: "g" },
            { label: "Carboidrato", value: n.carbs_grams, unit: "g" },
            { label: "Água", value: n.water_liters, unit: "L" },
          ].map((m) => (
            <div key={m.label} className="surface-card p-4">
              <p className="text-xs font-semibold text-muted">{m.label}</p>
              <p className="tnum mt-1 text-xl font-bold">
                {m.value}
                <span className="ml-1 text-sm font-medium text-muted">{m.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {plan.summary && (
          <div className="surface-card mt-6 p-4">
            <p className="text-xs font-semibold text-muted">Por que o plano é assim</p>
            <p className="mt-2 text-sm leading-relaxed">{plan.summary}</p>
          </div>
        )}

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Timer className="h-3.5 w-3.5" />
          {30 - done} dias restantes
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
