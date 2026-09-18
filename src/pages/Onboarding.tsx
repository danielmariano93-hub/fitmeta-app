import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Goal, GOALS, UserProfile } from "@/types";
import { generateWorkoutPlan, PlanError } from "@/services/claudeService";

const LEVELS = [
  { id: "beginner", label: "Iniciante", hint: "Nunca treinei ou parei faz mais de um ano" },
  { id: "intermediate", label: "Intermediário", hint: "Treino com alguma regularidade há 1–3 anos" },
  { id: "advanced", label: "Avançado", hint: "Treino sério há mais de 3 anos" },
] as const;

const FREQUENCIES = [3, 4, 5, 6] as const;

const DIETS = ["Vegetariano", "Vegano", "Sem glúten", "Sem lactose", "Intolerância a FODMAPs"];

const TOTAL_STEPS = 5;

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setPlan } = useApp();

  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [primary, setPrimary] = useState<Goal | null>(null);
  const [level, setLevel] = useState<UserProfile["fitness_level"] | null>(null);
  const [frequency, setFrequency] = useState<3 | 4 | 5 | 6 | null>(null);
  const [gender, setGender] = useState<"M" | "F" | "O">("M");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [diets, setDiets] = useState<string[]>([]);
  const [noDiet, setNoDiet] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleGoal = (g: Goal) => {
    setGoals((prev) => {
      const next = prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g];
      if (!next.includes(primary as Goal)) setPrimary(next[0] ?? null);
      else if (!primary && next.length) setPrimary(next[0]);
      return next;
    });
  };

  const toggleDiet = (d: string) => {
    setNoDiet(false);
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return goals.length > 0 && !!primary;
      case 1:
        return !!level;
      case 2:
        return !!frequency;
      case 3:
        return (
          Number(height) >= 120 &&
          Number(height) <= 230 &&
          Number(weight) >= 30 &&
          Number(weight) <= 300 &&
          Number(targetWeight) >= 30 &&
          Number(targetWeight) <= 300
        );
      case 4:
        return noDiet || diets.length > 0;
      default:
        return false;
    }
  };

  const back = () => {
    setError(null);
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      fitness_level: level!,
      goals,
      primary_goal: primary!,
      frequency: frequency!,
      gender,
      height: Number(height),
      weight: Number(weight),
      target_weight: Number(targetWeight),
      dietary_restrictions: noDiet ? [] : diets,
    };

    try {
      const res = await generateWorkoutPlan(profile);
      setUser(profile);
      setPlan({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        summary: res.summary,
        frequency: profile.frequency,
        workouts: res.workouts,
        nutritional_goals: res.nutritional_goals,
      });
      navigate("/app");
    } catch (e) {
      setError(
        e instanceof PlanError ? e.message : "Algo deu errado ao montar o plano. Tente de novo.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-8 text-center">
        <div>
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-6 text-lg font-bold">Montando seus 30 dias</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Definindo a divisão, as séries e a progressão de carga. Isso leva alguns segundos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Barra de progresso + voltar */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur">
        <div className="mx-auto max-w-app px-5 pt-5">
          <div className="flex items-center gap-4">
            <button
              onClick={back}
              aria-label="Voltar"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface2">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="tnum shrink-0 text-sm font-semibold text-muted">
              {step + 1}/{TOTAL_STEPS}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-app px-5 pb-32 pt-8">
        {step === 0 && (
          <>
            <h2 className="text-2xl font-bold tracking-tight">O que você quer alcançar?</h2>
            <p className="mt-2 text-sm text-muted">Escolha quantos quiser.</p>
            <div className="mt-6 space-y-2.5">
              {GOALS.map((g) => {
                const on = goals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    className="opt"
                    data-on={on}
                    onClick={() => toggleGoal(g.id)}
                    aria-pressed={on}
                  >
                    <div
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                        on ? "border-primary bg-primary" : "border-line"
                      }`}
                    >
                      {on && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{g.label}</p>
                      <p className="text-xs text-muted">{g.hint}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {goals.length > 1 && (
              <div className="mt-8 border-t border-line pt-6">
                <h3 className="font-bold">Qual vem primeiro?</h3>
                <p className="mt-1 text-sm text-muted">
                  Os outros continuam no plano, só com menos peso.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {goals.map((g) => {
                    const label = GOALS.find((x) => x.id === g)!.label;
                    const on = primary === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setPrimary(g)}
                        className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                          on
                            ? "border-primary bg-primary text-white"
                            : "border-line text-muted"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold tracking-tight">Como está seu treino hoje?</h2>
            <p className="mt-2 text-sm text-muted">Isso define o volume inicial.</p>
            <div className="mt-6 space-y-2.5">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  className="opt"
                  data-on={level === l.id}
                  onClick={() => setLevel(l.id)}
                >
                  <div className="min-w-0">
                    <p className="font-semibold">{l.label}</p>
                    <p className="text-xs text-muted">{l.hint}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold tracking-tight">
              Quantos dias por semana você consegue treinar?
            </h2>
            <p className="mt-2 text-sm text-muted">
              Seja honesto. O plano é montado em cima desse número.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {FREQUENCIES.map((f) => (
                <button
                  key={f}
                  className="opt justify-center"
                  data-on={frequency === f}
                  onClick={() => setFrequency(f)}
                >
                  <span className="tnum text-2xl font-bold">{f}</span>
                  <span className="text-sm text-muted">dias</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold tracking-tight">Seus dados</h2>
            <p className="mt-2 text-sm text-muted">
              Usados para calcular carga inicial e metas de nutrição.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Sexo biológico</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "M", l: "Masculino" },
                      { v: "F", l: "Feminino" },
                      { v: "O", l: "Prefiro não dizer" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.v}
                      className="opt justify-center px-2 py-3 text-center text-xs font-semibold"
                      data-on={gender === o.v}
                      onClick={() => setGender(o.v)}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="h" className="mb-2 block text-sm font-semibold">
                  Altura (cm)
                </label>
                <input
                  id="h"
                  className="input-base tnum"
                  type="number"
                  inputMode="numeric"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="w" className="mb-2 block text-sm font-semibold">
                    Peso atual (kg)
                  </label>
                  <input
                    id="w"
                    className="input-base tnum"
                    type="number"
                    inputMode="decimal"
                    placeholder="80"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="tw" className="mb-2 block text-sm font-semibold">
                    Peso alvo (kg)
                  </label>
                  <input
                    id="tw"
                    className="input-base tnum"
                    type="number"
                    inputMode="decimal"
                    placeholder="75"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold tracking-tight">Alguma restrição alimentar?</h2>
            <p className="mt-2 text-sm text-muted">Marque tudo que se aplica.</p>
            <div className="mt-6 space-y-2.5">
              {DIETS.map((d) => {
                const on = diets.includes(d) && !noDiet;
                return (
                  <button key={d} className="opt" data-on={on} onClick={() => toggleDiet(d)}>
                    <div
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                        on ? "border-primary bg-primary" : "border-line"
                      }`}
                    >
                      {on && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                    </div>
                    <span className="font-semibold">{d}</span>
                  </button>
                );
              })}
              <button
                className="opt"
                data-on={noDiet}
                onClick={() => {
                  setNoDiet(true);
                  setDiets([]);
                }}
              >
                <div
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                    noDiet ? "border-primary bg-primary" : "border-line"
                  }`}
                >
                  {noDiet && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
                <span className="font-semibold">Nenhuma</span>
              </button>
            </div>

            {error && (
              <div className="mt-6 flex gap-3 rounded-xl border border-coral/40 bg-coral/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                <div>
                  <p className="font-semibold text-coral">Não deu para montar o plano</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{error}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Ação fixa */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto max-w-app px-5 py-4">
          {step < TOTAL_STEPS - 1 ? (
            <button
              className="btn-brand"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => s + 1)}
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button className="btn-brand" disabled={!canAdvance()} onClick={handleGenerate}>
              {error ? "Tentar de novo" : "Montar meu plano"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
