import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import WorkoutDetail from "@/pages/WorkoutDetail";
import Progress from "@/pages/Progress";

const App: React.FC = () => (
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/workout/:day" element={<WorkoutDetail />} />
        <Route path="/app/progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;
