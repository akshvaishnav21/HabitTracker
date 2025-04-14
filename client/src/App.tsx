import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import HabitDetails from "@/pages/habit-details";
import HabitForm from "@/pages/habit-form";
import Header from "@/components/Header";
import AddHabitButton from "@/components/AddHabitButton";
import IntroductionModal from "@/components/IntroductionModal";
import { loadHabits } from "@/lib/habitStore";
import { useReminders, initializeReminderSystem } from "@/hooks/use-reminders";

function App() {
  const [location, setLocation] = useLocation();
  const [showIntro, setShowIntro] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setShowIntro(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    // Initialize habit data if empty
    const habits = loadHabits();
    if (!habits || habits.length === 0) {
      // The store will initialize with empty array when loading
    }
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/habits/new" component={HabitForm} />
          <Route path="/habits/:id/edit" component={HabitForm} />
          <Route path="/habits/:id" component={HabitDetails} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {location === "/" && <AddHabitButton />}
      
      {showIntro && <IntroductionModal onClose={() => setShowIntro(false)} />}
      
      <Toaster />
    </>
  );
}

export default App;
