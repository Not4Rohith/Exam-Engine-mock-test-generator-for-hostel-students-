import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { ArrowLeft, Target, SlidersHorizontal } from 'lucide-react';
import ThemeToggle from '../components/layout/ThemeToggle';

const SelectModePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 font-sans">
      
      {/* FIXED: Added flex, justify-between, and items-center to the header */}
      <header className="w-full p-4 flex justify-between items-center relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        {/* ADDED: dark:text-white for Dark Mode */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-gray-900 dark:text-white mb-12">
          EXAM ENGINE
        </h1>

        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Mock Test Card */}
          <button 
            onClick={() => navigate('/mock-config')}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col items-center justify-center gap-4 group h-64 cursor-pointer"
          >
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full group-hover:scale-110 transition-transform">
              <Target size={36} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Mock Test</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-2 leading-relaxed">Experience a real KCET-like environment with strict exam patterns.</p>
          </button>

          {/* Practice Test Card */}
          <button 
            onClick={() => navigate('/practice-config')}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col items-center justify-center gap-4 group h-64 cursor-pointer"
          >
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-full group-hover:scale-110 transition-transform">
              <SlidersHorizontal size={36} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Practice Test</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-2 leading-relaxed">Customize years, topics, and difficulty for focused preparation.</p>
          </button>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SelectModePage;