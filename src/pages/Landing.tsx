import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Dumbbell, Timer, RefreshCw } from "lucide-react";
import { useApp } from "@/context/AppContext";

const previewExercises = [
  { name: "Supino reto com barra", sets: 4, reps: "8-12", rest: 90 },
  { name: "Crucifixo inclinado", sets: 3, reps: "10-12", rest: 60 },
  { name: "Tríceps corda", sets: 3, reps: "12-15", rest: 45 },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { plan } = useApp();

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-app px-5 pb-12 pt-8">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
            <Dumbbell className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">FitMeta</span>
        </div>

        <h1 className="mt-10 text-[2.1rem] font-bold leading-[1.1] tracking-tight">
          30 dias de treino montados para o seu corpo, não para a média.
        </h1>

        <p className="mt-4 text-[0.98rem] leading-relaxed text-muted">
          Você responde cinco perguntas. A IA monta a divisão, as séries, as repetições e o descanso
          com base no seu nível, nos seus objetivos e nos dias que você realmente tem.
        </p>

        {/* Hero: o produto de verdade, não uma ilustração */}
        <div className="relative mt-8">
          <div className="surface-card overflow-hidden p-4">
            <div className="flex items-center gap-3">
              <div className="letter-badge">A</div>
              <div className="min-w-0">
                <p className="truncate font-bold">Peito e tríceps</p>
                <p className="text-sm text-muted">Dia 1 · 6 exercícios</p>
              </div>
              <span className="chip ml-auto shrink-0">
                <Timer className="h-3 w-3" />
                55 min
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {previewExercises.map((e) => (
                <div
                  key={e.name}
                  className="flex items-center gap-3 rounded-xl bg-surface2 px-3 py-2.5"
                >
                  <div className="h-5 w-5 shrink-0 rounded-md border border-line" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{e.name}</span>
                  <span className="tnum shrink-0 text-sm font-bold text-primary">
                    {e.sets}×{e.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Fade indicando que continua */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <p className="-mt-4 text-center text-xs text-muted">e mais 29 dias</p>

        <div className="mt-8">
          <button className="btn-brand" onClick={() => navigate("/onboarding")}>
            Montar meu plano
            <ArrowRight className="h-4 w-4" />
          </button>

          {plan && (
            <button className="btn-ghost mt-3" onClick={() => navigate("/app")}>
              <RefreshCw className="h-4 w-4" />
              Continuar meu plano atual
            </button>
          )}

          <p className="mt-3 text-center text-xs text-muted">
            Leva cerca de 2 minutos. Sem cadastro.
          </p>
        </div>

        <div className="mt-12 space-y-4 border-t border-line pt-8">
          <h2 className="text-sm font-bold text-muted">O que você recebe</h2>
          {[
            {
              t: "Uma divisão que cabe na sua semana",
              d: "Se você treina 3 vezes, o plano tem 3 treinos e não 5 com dois que você nunca faz.",
            },
            {
              t: "Carga e volume que sobem sozinhos",
              d: "As quatro semanas progridem. A semana 4 não é igual à semana 1.",
            },
            {
              t: "Metas de proteína, calorias e água",
              d: "Calculadas a partir do seu peso atual e do peso que você quer alcançar.",
            },
          ].map((item) => (
            <div key={item.t}>
              <p className="font-bold">{item.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs leading-relaxed text-muted">
          O FitMeta não substitui orientação médica ou de um profissional de educação física.
        </p>
      </div>
    </div>
  );
};

export default Landing;
