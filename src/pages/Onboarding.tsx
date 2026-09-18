import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { generateWorkoutPlan } from "@/services/claudeService";
import { UserProfile } from "@/types";

type Step = "goal" | "level" | "frequency" | "stats" | "diet" | "generating";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setPlan, setIsLoading } = useApp();
  const [step, setStep] = useState<Step>("goal");
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    goal: "hipertrofia" as const,
    fitness_level: "beginner" as const,
    frequency: 3 as const,
    gender: "M" as const,
    height: 180,
    weight: 80,
    target_weight: 75,
    dietary_restrictions: [] as string[],
    experience_years: 1,
  });

  const handleNext = async () => {
    const steps: Step[] = ["goal", "level", "frequency", "stats", "diet"];
    const currentIndex = steps.indexOf(step);

    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    } else {
      // Generate plan
      await generatePlan();
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setIsLoading(true);

    try {
      const userProfile: UserProfile = {
        id: `user_${Date.now()}`,
        email: "user@fitmeta.com", // TODO: auth
        created_at: new Date().toISOString(),
        fitness_level: formData.fitness_level,
        goal: formData.goal,
        frequency: formData.frequency,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        target_weight: formData.target_weight,
        dietary_restrictions: formData.dietary_restrictions,
        experience_years: formData.experience_years,
      };

      setUser(userProfile);

      // Generate plan via Claude
      const response = await generateWorkoutPlan(userProfile);
      setPlan(response.plan);

      // Redirect to dashboard
      navigate("/app");
    } catch (error) {
      console.error("Plan generation failed:", error);
      alert("Erro ao gerar plano. Tente novamente.");
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const handleToggleDiet = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(item)
        ? prev.dietary_restrictions.filter((r) => r !== item)
        : [...prev.dietary_restrictions, item],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-brand transition-all duration-300"
              style={{
                width: step === "goal" ? "20%" : step === "level" ? "40%" : step === "frequency" ? "60%" : step === "stats" ? "80%" : "100%",
              }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="surface-card">
          {/* Goal Selection */}
          {step === "goal" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Qual é seu objetivo?</h2>
                <p className="text-muted-foreground">Escolha o foco principal para seu treino</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "hipertrofia", label: "Ganhar Massa Muscular", emoji: "💪" },
                  { value: "emagrecimento", label: "Perder Peso", emoji: "🔥" },
                  { value: "definição", label: "Definir Músculos", emoji: "⚡" },
                  { value: "força", label: "Ganhar Força", emoji: "🏋️" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, goal: option.value as any })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.goal === option.value
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{option.label}</p>
                      </div>
                      <span className="text-2xl">{option.emoji}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fitness Level */}
          {step === "level" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Seu nível?</h2>
                <p className="text-muted-foreground">Selecione sua experiência com treino</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: "beginner", label: "Iniciante", desc: "Menos de 1 ano" },
                  { value: "intermediate", label: "Intermediário", desc: "1-3 anos" },
                  { value: "advanced", label: "Avançado", desc: "Mais de 3 anos" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, fitness_level: option.value as any })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.fitness_level === option.value
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Frequency */}
          {step === "frequency" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Quantas vezes por semana?</h2>
                <p className="text-muted-foreground">Frequência ideal de treinos</p>
              </div>

              <div className="space-y-3">
                {[3, 4, 5, 6].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFormData({ ...formData, frequency: freq as any })}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      formData.frequency === freq ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground text-lg">{freq}x por semana</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {step === "stats" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Seus dados</h2>
                <p className="text-muted-foreground">Informações para personalizar o treino</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-2">Gênero</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="input-base"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Altura (cm): {formData.height}
                  </label>
                  <input
                    type="range"
                    min="150"
                    max="210"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Peso atual (kg): {formData.weight}
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Peso alvo (kg): {formData.target_weight}
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={formData.target_weight}
                    onChange={(e) => setFormData({ ...formData, target_weight: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Diet */}
          {step === "diet" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Restrições alimentares?</h2>
                <p className="text-muted-foreground">Selecione tudo que se aplica</p>
              </div>

              <div className="space-y-2">
                {["Vegetariano", "Vegano", "Sem Glúten", "Sem Lactose", "Nenhuma"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleToggleDiet(option)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      formData.dietary_restrictions.includes(option)
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium text-foreground">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generating */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="bg-gradient-brand rounded-full p-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Gerando seu plano...</p>
                <p className="text-muted-foreground">Isso pode levar um momento</p>
              </div>
            </div>
          )}

          {/* Button */}
          {!isGenerating && (
            <button onClick={handleNext} className="btn-brand w-full flex items-center justify-center gap-2 mt-8">
              {step === "diet" ? "Gerar Plano" : "Próximo"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
