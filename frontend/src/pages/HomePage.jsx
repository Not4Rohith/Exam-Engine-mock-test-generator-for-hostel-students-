import { useNavigate } from 'react-router-dom';
import StatusIndicator from '../components/layout/StatusIndicator';
import Footer from '../components/layout/Footer';
import { HelpCircle, GraduationCap, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/layout/ThemeToggle';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    // ADDED: dark:bg-slate-900 and transition-colors
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 font-sans">
      
      {/* Top Header Navigation */}
      <header className="w-full p-4 flex justify-between items-center relative z-10">
        <StatusIndicator />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
           onClick={() => alert("Tutorial video placeholder!")}
           className="flex items-center gap-1.5 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <HelpCircle size={18} />
            <span className="text-sm font-medium hidden sm:inline">How to use</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        {/* ADDED: dark:text-white */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-gray-900 dark:text-white mb-12 text-center">
          EXAM ENGINE
        </h1>

        <div className="w-full max-w-sm space-y-4">
          <p className="text-center text-gray-400 dark:text-gray-500 font-semibold tracking-wide text-sm mb-2 uppercase">
            Select Exam
          </p>
          
          {/* KCET Main Card */}
          <button 
            onClick={() => navigate('/mode')}
            className="w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer"
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform">
              <GraduationCap size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              KCET
            </span>
          </button>

          {/* Extras Button */}
          <button 
            onClick={() => navigate('/extras')}
            className="w-full p-5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 group cursor-pointer"
          >
            <Sparkles size={20} className="group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
            <span className="font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Extras
            </span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;