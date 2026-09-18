import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Moon, Timer } from "lucide-react";
import { useApp } from "@/context/AppContext";

const WorkoutDetail: React.FC = () => {
  const { day } = useParams();
  const navigate = useNavigate();
  const { plan, toggleExercise, finishWorkout } = useApp();

  if (!plan) return <Navigate to="/" replace />;

  const dayNum = Number(day);
  const workout = plan.workouts.find((w) => w.day === dayNum);
  if (!workout) return <Navigate to="/app" replace />;

  const doneCount = workout.exercises.filter((e) => e.completed).length;
  const total = workout.exercises.length;
  const allDone = total > 0 && doneCount === total;

  return (
    <div className="min-h-screen bg-bg pb-32">
      <div className="sticky top-0 z-10 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-app items-center gap-3 px-5 py-4">
          <button
            onClick={() => navigate("/app")}
            aria-label="Voltar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate font-bold">{workout.title}</p>
            <p className="text-xs text-muted">
              Dia {workout.day}
              {!workout.rest_day && ` · Treino ${workout.type}`}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-app px-5 pt-6">
        {workout.rest_day ? (
          <div className="surface-card p-8 text-center">
            <Moon className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-4 font-bold">Hoje o corpo trabalha parado</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              O músculo cresce na recuperação, não no treino. Beba água, durma bem e volte amanhã.
            </p>
            <button className="btn-ghost mt-6" onClick={() => navigate("/app")}>
              Voltar ao plano
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="tnum text-sm font-semibold text-muted">
                {doneCount} de {total} concluídos
              </p>
              <span className="chip">
                <Timer className="h-3 w-3" />
                {workout.duration_min} min
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {workout.exercises.map((e) => (
                <button
                  key={e.id}
                  onClick={() => toggleExercise(workout.day, e.id)}
                  className="surface-card flex w-full items-start gap-3 p-4 text-left"
                >
                  <div
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                      e.completed ? "border-primary bg-primary" : "border-line"
                    }`}
                  >
                    {e.completed && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold ${e.completed ? "text-muted line-through" : ""}`}>
                      {e.name}
                    </p>
                    {e.muscle && <p className="text-xs text-muted">{e.muscle}</p>}
                    {e.form_notes && (
                      <p className="mt-2 text-xs leading-relaxed text-muted">{e.form_notes}</p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="tnum font-bold text-primary">
                      {e.sets}×{e.reps}
                    </p>
                    <p className="tnum text-xs text-muted">{e.rest_seconds}s desc.</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {!workout.rest_day && (
        <div className="fixed inset-x-0 bottom-0 border-t border-line bg-bg/95 backdrop-blur">
          <div className="mx-auto max-w-app px-5 py-4">
            <button
              className="btn-brand"
              disabled={!allDone && !workout.completed}
              onClick={() => {
                finishWorkout(workout.day);
                navigate("/app");
              }}
            >
              {workout.completed
                ? "Treino concluído"
                : allDone
                  ? "Finalizar treino"
                  : `Faltam ${total - doneCount} exercícios`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;
