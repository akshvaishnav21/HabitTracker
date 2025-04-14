import { formatDate } from "@/lib/utils";
import { Link } from "wouter";
import { Download } from "lucide-react";
import { loadHabits } from "@/lib/habitStore";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const today = new Date();
  const formattedDate = formatDate(today);
  const { toast } = useToast();

  const exportToCsv = () => {
    try {
      const habits = loadHabits();
      if (habits.length === 0) {
        toast({
          title: "No habits to export",
          description: "Create some habits first before exporting",
          variant: "destructive",
        });
        return;
      }

      // Convert habits to CSV format
      let csvContent = "id,title,description,frequency,frequencyCount,frequencyPeriod,selectedDays,createdAt\n";
      
      habits.forEach(habit => {
        // Format the habit data for CSV
        const row = [
          habit.id,
          `"${habit.title.replace(/"/g, '""')}"`, // Escape quotes
          `"${(habit.description || '').replace(/"/g, '""')}"`,
          habit.frequency,
          habit.frequencyCount || '',
          habit.frequencyPeriod || '',
          habit.selectedDays ? `"${habit.selectedDays.join(',')}"` : '',
          habit.createdAt
        ];
        csvContent += row.join(',') + '\n';
      });
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `habit-track-export-${today.toISOString().slice(0, 10)}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Your habit data has been exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <h1 className="text-xl font-bold text-white">HabitTrack</h1>
          </div>
        </Link>
        <div className="flex items-center">
          <div className="text-sm text-white mr-3 hidden sm:block">
            {formattedDate}
          </div>
          <button 
            className="p-2 rounded-full hover:bg-primary-600 text-white flex items-center justify-center"
            onClick={exportToCsv}
            title="Export habits to CSV"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
