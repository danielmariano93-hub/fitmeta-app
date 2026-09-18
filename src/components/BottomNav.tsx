import React from "react";
import { NavLink } from "react-router-dom";
import { Home, TrendingUp } from "lucide-react";

const items = [
  { to: "/app", label: "Plano", Icon: Home, end: true },
  { to: "/app/progress", label: "Progresso", Icon: TrendingUp, end: false },
];

const BottomNav: React.FC = () => (
  <nav className="fixed inset-x-0 bottom-0 border-t border-line bg-bg/95 backdrop-blur">
    <div className="mx-auto flex max-w-app">
      {items.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold ${
              isActive ? "text-primary" : "text-muted"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
