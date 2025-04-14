import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "HabitTrack - Simple Habit Tracking";

createRoot(document.getElementById("root")!).render(<App />);
