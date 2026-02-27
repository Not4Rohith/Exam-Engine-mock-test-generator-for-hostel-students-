import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Footer from '../components/layout/Footer';
import ThemeToggle from '../components/layout/ThemeToggle';
import { ArrowLeft, Settings, CheckCircle2 } from 'lucide-react';

const MockConfigPage = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false); 

  // 1. Add State for DB Data
  const [dbData, setDbData] = useState({ subjects: [], years: [] });
  
  // Default configurations
  const [config, setConfig] = useState({
    subject: '',
    years: [], // Fixed: Start with an empty array
    difficulty: { easy: 25, moderate: 25, hard: 10 },
    includeDeleted: false
  });

  // 2. Fetch Metadata on Load (THIS WAS MISSING!)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // If your metadata route is in mock.py, use this URL. 
        // If it's only in practice.py, you can use '/api/practice/metadata' here instead!
        const response = await axios.get('http://localhost:8000/api/mock/metadata'); 
        setDbData(response.data);
      } catch (error) {
        console.error("Failed to fetch database metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  // 3. Toggle Array Item Logic (THIS WAS MISSING!)
  const toggleArrayItem = (arrayName, item) => {
    setConfig(prev => {
      const currentArray = prev[arrayName];
      if (currentArray.includes(item)) {
        return { ...prev, [arrayName]: currentArray.filter(i => i !== item) };
      } else {
        return { ...prev, [arrayName]: [...currentArray, item] };
      }
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    // Validation Checks
    if (!config.subject) return alert("Please select a subject first!");
    if (config.years.length === 0) return alert("Please select at least one year!");

    // Ensure the difficulty distribution exactly equals 60
    const totalQs = Number(config.difficulty.easy) + Number(config.difficulty.moderate) + Number(config.difficulty.hard);
    if (totalQs !== 60) {
      alert(`For a Mock Test, the total questions must be exactly 60. Currently, you have ${totalQs}.`);
      return;
    }
    
    try {
      setIsLoading(true);

      const payload = {
        ...config,
        years: Array.isArray(config.years) ? config.years.flat().map(String) : [],
        difficulty: {
          easy: parseInt(config.difficulty.easy) || 0,
          moderate: parseInt(config.difficulty.moderate) || 0,
          hard: parseInt(config.difficulty.hard) || 0,
        }
      };
      
      const response = await axios.post('http://localhost:8000/api/mock/generate', payload);
      const realQuestions = response.data.questions;
      
      if (!realQuestions || realQuestions.length === 0) {
        alert("Not enough questions in the database to generate a full mock test for these years!");
        return;
      }

      navigate('/preview', { state: { config: payload, mode: 'mock', questions: realQuestions } });
      
    } catch (error) {
      console.error("Error details:", error.response?.data);
      alert(`Error: ${JSON.stringify(error.response?.data?.detail) || "Failed to connect"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-gray-900 dark:text-white mb-8">
          EXAM ENGINE
        </h1>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Configuration Form */}
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mock Test Setup</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Subject Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Subject *</label>
                <select 
                  className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={config.subject}
                  onChange={(e) => setConfig({...config, subject: e.target.value})}
                  required
                >
                  <option value="" className="dark:text-black">Choose a subject...</option>
                  {dbData.subjects.map(sub => <option key={sub} value={sub} className="dark:text-black">{sub}</option>)}
                </select>
              </div>

              {/* Year Selection */}
              <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Years *</label>
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 h-[116px] overflow-y-auto bg-gray-50 dark:bg-slate-800/50 space-y-2">
                    {dbData.years.map(year => (
                      <label key={year} className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors">
                        <input 
                          type="checkbox" 
                          checked={config.years.includes(year)}
                          onChange={() => toggleArrayItem('years', year)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-200">{year}</span>
                      </label>
                    ))}
                  </div>
                </div>

              {/* Difficulty Distribution */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulty Distribution (60 Qs)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Easy (20-35)</span>
                    <input type="number" min="20" max="35" value={config.difficulty.easy} onChange={(e) => setConfig({...config, difficulty: {...config.difficulty, easy: e.target.value}})} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white text-center mt-1" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Mod (20-35)</span>
                    <input type="number" min="20" max="35" value={config.difficulty.moderate} onChange={(e) => setConfig({...config, difficulty: {...config.difficulty, moderate: e.target.value}})} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white text-center mt-1" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Hard (5-15)</span>
                    <input type="number" min="5" max="15" value={config.difficulty.hard} onChange={(e) => setConfig({...config, difficulty: {...config.difficulty, hard: e.target.value}})} className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white text-center mt-1" />
                  </div>
                </div>
              </div>

              {/* Deleted Syllabus Toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <input 
                  type="checkbox" 
                  checked={config.includeDeleted}
                  onChange={(e) => setConfig({...config, includeDeleted: e.target.checked})}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">Include Deleted Syllabus</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Adds questions from officially removed topics.</div>
                </div>
              </label>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Assembling Mock Test..." : "Generate Mock Test"}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: Instructions */}
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-slate-700 h-fit">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-300 dark:border-slate-600 pb-2">
              Mock Test Rules
            </h3>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex gap-3">
                <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <span><strong>Authentic Simulation:</strong> This mode mimics the real KCET pattern strictly.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <span><strong>Syllabus Weightage:</strong> Exactly 25% of questions are sourced from Class 11 topics, and 75% from Class 12.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <span><strong>Question Count:</strong> The final paper will contain exactly 60 questions per subject.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <span><strong>Offline Ready:</strong> After generation, you can print the PDF with answer keys and solutions.</span>
              </li>
            </ul>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MockConfigPage;