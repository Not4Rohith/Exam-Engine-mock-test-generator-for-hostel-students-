import { useState, useEffect } from 'react';
// 🌟 FIX: Use the central api config
import api from '../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import ThemeToggle from '../components/layout/ThemeToggle';
import { ArrowLeft, SlidersHorizontal, CheckCircle2, Calculator, Search } from 'lucide-react';

const PracticeConfigPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dbData, setDbData] = useState({ subjects: [], years: [], topics: {}, pucLevels: [] });
  const [topicSearch, setTopicSearch] = useState('');

  const [config, setConfig] = useState({
    subject: '',
    topics: [],
    years: [], 
    puc_levels: [], 
    difficulty: { easy: 10, moderate: 15, hard: 5 }
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // 🌟 FIX: Standardized relative path
        const response = await api.get('/practice/metadata'); 
        setDbData(response.data);
      } catch (error) {
        console.error("Failed to fetch database metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  // ... (toggle and search logic stays the same) ...

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!config.subject || config.topics.length === 0 || config.years.length === 0) {
        return alert("Please fill in all required fields!");
    }
    
    try {
      setIsLoading(true);
      const payload = {
        ...config,
        years: Array.isArray(config.years) ? config.years.flat().map(String) : [],
        puc_levels: Array.isArray(config.puc_levels) ? config.puc_levels.flat().map(String) : [],
        difficulty: {
          easy: parseInt(config.difficulty.easy) || 0,
          moderate: parseInt(config.difficulty.moderate) || 0,
          hard: parseInt(config.difficulty.hard) || 0,
        }
      };

      // 🌟 FIX: Clean API call
      const response = await api.post('/practice/generate', payload);
      const realQuestions = response.data.questions;
      
      if (!realQuestions || realQuestions.length === 0) {
        return alert("No questions found for these exact filters.");
      }

      navigate('/preview', { state: { config: payload, mode: 'practice', questions: realQuestions } });
    } catch (error) {
      console.error("Error details:", error.response?.data);
      alert("Failed to connect to the question database.");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("Current Subject:", config.subject);
  // console.log("Topics in State:", config.topics);
  // console.log("Topics ready to render:", filteredAndSortedTopics);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="w-full p-4 flex justify-between items-center relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <ThemeToggle />
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-gray-900 dark:text-white mb-8">EXAM ENGINE</h1>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-emerald-500" size={24} />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Practice Setup</h2>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800">
                <Calculator size={16} />
                <span>Total: {totalQuestions} Qs</span>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                  <select 
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={config.subject}
                    onChange={handleSubjectChange}
                    required
                  >
                    <option value="" className="dark:text-black">Choose...</option>
                    {dbData.subjects.map(sub => (
                      <option key={sub} value={sub} className="dark:text-black">{sub}</option>
                    ))}
                  </select>
                </div>

                {/* PUC Level Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">PUC Level</label>
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 h-[50px] flex items-center gap-4 bg-gray-50 dark:bg-slate-800/50 overflow-x-auto">
                    {dbData.pucLevels && dbData.pucLevels.length > 0 ? dbData.pucLevels.map(level => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={config.puc_levels.includes(level)}
                          onChange={() => toggleArrayItem('puc_levels', level)}
                          className="w-4 h-4 accent-emerald-600"
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-200">{level}</span>
                      </label>
                    )) : <span className="text-sm text-gray-500 italic">Any</span>}
                  </div>
                </div>
              </div>

              {/* Topics Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Topics *</label>
                  {/* Select All Button */}
                  {config.subject && (
                    <button
                      type="button"
                      onClick={handleSelectAllTopics}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                      {filteredAndSortedTopics.length > 0 && filteredAndSortedTopics.every(t => config.topics.includes(t.name))
                        ? "Deselect All"
                        : "Select All Visible"}
                    </button>
                  )}
                </div>
                
                {/* Search Bar */}
                <div className="relative mb-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    disabled={!config.subject}
                    className="w-full pl-9 p-2.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  />
                </div>

                {/* Topics List (CLEANED OF GHOST BUGS) */}
                <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50 dark:bg-slate-800/50 space-y-2">
                  {!config.subject ? (
                    <p className="text-sm text-gray-500 italic">Select a subject first...</p>
                  ) : filteredAndSortedTopics.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No topics match your filters.</p>
                  ) : (
                    filteredAndSortedTopics.map((topicObj, index) => (
                      <label key={`${topicObj.name}-${index}`} className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors">
                        <input 
                          type="checkbox" 
                          checked={config.topics.includes(topicObj.name)}
                          onChange={() => toggleArrayItem('topics', topicObj.name)}
                          className="w-4 h-4 accent-emerald-600 shrink-0"
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {topicObj.name}
                          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                            ({topicObj.level})
                          </span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Years *</label>
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-3 h-[116px] overflow-y-auto bg-gray-50 dark:bg-slate-800/50 space-y-2">
                    {dbData.years.map(year => (
                      <label key={year} className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors">
                        <input 
                          type="checkbox" 
                          checked={config.years.includes(year)}
                          onChange={() => toggleArrayItem('years', year)}
                          className="w-4 h-4 accent-emerald-600"
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-200">{year}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Difficulty Breakdown *</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Easy</span>
                      <input type="number" min="0" max="50" value={config.difficulty.easy} onChange={(e) => setConfig({...config, difficulty: {...config.difficulty, easy: e.target.value}})} className="w-20 p-1.5 border border-gray-300 dark:border-slate-600 rounded bg-transparent dark:text-white text-center outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Moderate</span>
                      <input type="number" min="0" max="50" value={config.difficulty.moderate} onChange={(e) => setConfig({...config, difficulty: {...config.difficulty, moderate: e.target.value}})} className="w-20 p-1.5 border border-gray-300 dark:border-slate-600 rounded bg-transparent dark:text-white text-center outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Hard</span>
                      <input type="number" min="0" max="50" value={config.difficulty.hard} onChange={(e) => setConfig({...config, difficulty: {...config.difficulty, hard: e.target.value}})} className="w-20 p-1.5 border border-gray-300 dark:border-slate-600 rounded bg-transparent dark:text-white text-center outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-md mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating Custom Paper..." : "Generate Custom Practice Set"}
              </button>
            </form>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-slate-700 h-fit">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-300 dark:border-slate-600 pb-2">
              Practice Rules
            </h3>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <span><strong>Search & Sort:</strong> Quickly find specific chapters using the search bar above the topics list.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <span><strong>Targeted Levels:</strong> Use the PUC Level filter to restrict questions to Class 11 or Class 12 syllabus.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <span><strong>Granular Control:</strong> Specify exactly how many easy, moderate, and hard questions you want to face.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PracticeConfigPage;