import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import ThemeToggle from '../components/layout/ThemeToggle';
import { ArrowLeft, ToggleLeft, ToggleRight, FileText, Key, BookOpen, RotateCcw } from 'lucide-react';
// 🌟 FIX 1: Use your central api config
import api from '../api/axiosConfig';

const PreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the questions passed from the previous page
  const { questions = [], config = {}, mode = '' } = location.state || {};

  const [pageSavingMode, setPageSavingMode] = useState(false);
  const [showExtraInfo, setShowExtraInfo] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Initialize selection with the REAL IDs from the backend
  const [selectedQs, setSelectedQs] = useState([]);

  useEffect(() => {
    if (questions.length > 0) {
      setSelectedQs(questions.map(q => q.question_id));
    }
  }, [questions]);

  // Function to handle checking/unchecking individual questions
  const toggleQuestion = (id) => {
    setSelectedQs(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleDownload = async (type) => {
    try {
      const payload = {
        question_ids: selectedQs.map(id => String(id)), 
        document_type: type,
        page_saving_mode: pageSavingMode, 
        show_extra_info: showExtraInfo
      };

      // 🌟 FIX 2: Use api.post('/pdf/download') 
      // It handles the 'https://.../api' part automatically
      const response = await api.post('/pdf/download', payload, {
        responseType: 'blob' 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ExamEngine_${type}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to generate PDF. Check your internet connection.");
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      // 🌟 FIX 3: Relative paths only! Base URL handles the rest.
      const endpoint = mode === 'mock' ? '/mock/generate' : '/practice/generate';
      
      const response = await api.post(endpoint, config);
      const newQuestions = response.data.questions;

      if (newQuestions && newQuestions.length > 0) {
        navigate('/preview', { 
          state: { config, mode, questions: newQuestions },
          replace: true 
        });
      } else {
        alert("No questions found with these settings.");
      }
    } catch (error) {
      console.error("Regeneration failed:", error);
      alert("Error fetching new questions from the server.");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="w-full p-4 flex justify-between items-center bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-l pl-6 border-gray-300 dark:border-slate-600">
            <button onClick={() => setPageSavingMode(!pageSavingMode)} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {pageSavingMode ? <ToggleRight size={24} className="text-blue-500" /> : <ToggleLeft size={24} className="text-gray-400" />}
              Page Saving Mode (Split A4)
            </button>
            
            <button onClick={() => setShowExtraInfo(!showExtraInfo)} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              {showExtraInfo ? <ToggleRight size={24} className="text-blue-500" /> : <ToggleLeft size={24} className="text-gray-400" />}
              Show Extra Info
            </button>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Preview</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {selectedQs.length} of {questions.length} questions selected for PDF generation.
            </p>
          </div>
          <button 
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${isRegenerating 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
          >
            <RotateCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Fetching...' : 'Regenerate Set'}
          </button>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 overflow-y-auto mb-8 space-y-4 max-h-[50vh]">
          {questions.map((q, index) => (
            <div 
              key={q.question_id} 
              className={`p-4 rounded-lg border transition-all flex gap-4 ${
                selectedQs.includes(q.question_id) 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-500' 
                : 'border-gray-200 dark:border-slate-700 opacity-60'
              }`}
            >
              <input 
                type="checkbox" 
                checked={selectedQs.includes(q.question_id)}
                onChange={() => toggleQuestion(q.question_id)}
                className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer shrink-0"
              />
              <div className="flex-1">
                <div className="mb-2">
                  <span className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold font-mono shadow-sm">
                    {q.question_id}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{index + 1}. {q.question_text || q.text}</p>
                {showExtraInfo && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Topic: {q.topic}</span>
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">Year: {q.year}</span>
                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded">Diff: {q.difficulty}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="text-center text-gray-500 py-10">No questions to display.</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto">
          <button 
            onClick={() => handleDownload('Questions')}
            className="bg-gray-900 dark:bg-white text-white dark:text-black p-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black dark:hover:bg-gray-200 transition-all shadow-md"
          >
            <FileText size={20} />
            Download Questions PDF
          </button>
          
          <button 
            onClick={() => handleDownload('Keys')}
            className="bg-emerald-600 text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-emerald-700 transition-all shadow-md"
          >
            <Key size={20} />
            Download Answer Keys
          </button>
          
          <button 
            onClick={() => handleDownload('Solutions')}
            className="bg-blue-600 text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
          >
            <BookOpen size={20} />
            Generate Solutions PDF
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PreviewPage;