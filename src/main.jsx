import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WeatherChatComponent from "./WeatherChatComponent.jsx";
import EvaluationDashboard from "./EvaluationDashboard.jsx";

function App() {
  const [view, setView] = useState("chat"); // "chat" or "evaluation"

  return (
    <div className="p-4">
      {/* Navigation buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setView("chat")}
          className={`px-4 py-2 rounded ${view === "chat" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Weather Chat
        </button>
        <button
          onClick={() => setView("evaluation")}
          className={`px-4 py-2 rounded ${view === "evaluation" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Evaluation Dashboard
        </button>
      </div>

      {/* Conditional rendering */}
      {view === "chat" ? <WeatherChatComponent /> : <EvaluationDashboard />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);