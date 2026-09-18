import React from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Zap, TrendingUp, CheckCircle } from "lucide-react";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-brand rounded-full p-2">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">FitMeta</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
                Seu Plano de{" "}
                <span className="text-gradient-brand">Treino Inteligente</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                30 dias de treino gerado por IA especializada em hipertrofia, nutrição e redução de
                gordura corporal. Acompanhe seu progresso diariamente.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Zap, text: "Plano personalizado gerado uma única vez" },
                { icon: TrendingUp, text: "Acompanhamento de progresso em tempo real" },
                { icon: CheckCircle, text: "Ajustes inteligentes por IA" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/onboarding")}
              className="btn-brand w-full md:w-auto text-lg py-4 px-8"
            >
              Começar Agora
            </button>
          </div>

          {/* Right: Visual */}
          <div className="hidden md:flex items-center justify-center">
            <div className="bg-gradient-brand-soft rounded-3xl p-12 w-full aspect-square flex items-center justify-center">
              <div className="bg-gradient-brand rounded-2xl w-full h-full flex items-center justify-center">
                <Dumbbell className="w-32 h-32 text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {[
            { number: "30", label: "Dias de Treino" },
            { number: "100%", label: "Personalizado" },
            { number: "∞", label: "Ajustes com IA" },
          ].map((stat, i) => (
            <div key={i} className="surface-card text-center">
              <p className="text-4xl font-bold text-gradient-brand">{stat.number}</p>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
