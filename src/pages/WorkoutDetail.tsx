import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ChevronLeft, CheckCircle2, Circle, Zap } from "lucide-react";

const WorkoutDetail: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const { plan } = useApp();
  const [notes, setNotes] = useState("");

  if (!plan) {
    navigate("/onboarding");
    return null;
  }

  const dayNum = parseInt(day || "1");
  const workout = plan.workouts[dayNum - 1];

  if (!workout) {
    return <div>Treino não encontrado</div>;
  }

  const toggleExercise = (index: number) => {
    const updatedWorkouts = [...plan.workouts];
    updatedWorkouts[dayNum - 1].exercises[index].completed =
      !updatedWorkouts[dayNum - 1].exercises[index].completed;
    // TODO: persist to database
  };

  const markWorkoutComplete = () => {
    const updatedWorkouts = [...plan.workouts];
    updatedWorkouts[dayNum - 1].completed = true;
    updatedWorkouts[dayNum - 1].completed_at = new Date().toISOString();
    // TODO: persist to database
    navigate("/app");
  };

  const completedCount = workout.exercises.filter((ex) => ex.completed).length;
  const isComplete = completedCount === workout.exercises.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-brand text-white p-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/app")} className="p-2 hover:bg-white/10 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center flex-1">
            <p className="text-white/80">Dia {dayNum}</p>
            <h1 className="text-2xl font-bold">Treino {workout.type}</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-brand-soft p-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">
              {completedCount} de {workout.exercises.length} exercícios
            </p>
            <p className="text-sm font-semibold text-primary">
              {Math.round((completedCount / workout.exercises.length) * 100)}%
            </p>
          </div>
          <div className="w-full bg-border rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-brand h-3 transition-all"
              style={{
                width: `${(completedCount / workout.exercises.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-4">
          {workout.exercises.map((exercise, idx) => (
            <div key={exercise.id} className="surface-card flex items-start gap-4">
              <button
                onClick={() => toggleExercise(idx)}
                className="mt-1 flex-shrink-0 text-primary hover:scale-110 transition-transform"
              >
                {exercise.completed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>

              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${exercise.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {exercise.name}
                </h3>

                <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>{exercise.sets} séries</span>
                  </div>
                  <div>
                    <span>{exercise.reps} repetições</span>
                  </div>
                  {exercise.weight && (
                    <div>
                      <span>
                        {exercise.weight}
                        {exercise.weight_unit}
                      </span>
                    </div>
                  )}
                  {exercise.rest_seconds && (
                    <div>
                      <span>{exercise.rest_seconds}s repouso</span>
                    </div>
                  )}
                </div>

                {exercise.form_notes && (
                  <div className="mt-3 p-3 bg-secondary rounded-lg">
                    <p className="text-xs font-medium text-foreground mb-1">💡 Dica de Forma:</p>
                    <p className="text-xs text-muted-foreground">{exercise.form_notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="surface-card mt-12">
          <h3 className="font-semibold text-foreground mb-4">Anotações do Treino</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Como se sentiu? Algo a destacar?"
            className="input-base h-24 mb-4"
          />
          <p className="text-xs text-muted-foreground mb-6">
            Suas anotações ajudam a IA a personalizar futuros treinos
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-12">
          <button onClick={() => navigate("/app")} className="btn-ghost flex-1">
            Voltar
          </button>
          <button
            onClick={markWorkoutComplete}
            disabled={!isComplete}
            className={`btn-brand flex-1 ${!isComplete ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isComplete ? "✓ Treino Completo" : `Faltam ${workout.exercises.length - completedCount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
