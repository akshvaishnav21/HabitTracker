import { formatDate } from "@/lib/utils";
import { Link } from "wouter";

const Header = () => {
  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-primary" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">HabitTrack</h1>
          </a>
        </Link>
        <div className="flex items-center">
          <div className="text-sm text-gray-600 mr-2 hidden sm:block">
            {formattedDate}
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h16M4 18h7" 
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
