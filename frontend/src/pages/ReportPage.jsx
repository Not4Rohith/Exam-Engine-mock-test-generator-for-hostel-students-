import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🌟 FIX: Use the central api config
import api from '../api/axiosConfig'; 
import Footer from '../components/layout/Footer';
import { ArrowLeft, AlertTriangle, Send } from 'lucide-react';
import ThemeToggle from '../components/layout/ThemeToggle';

const ReportPage = () => {
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!questionId.trim()) return alert("Please enter a Question ID.");
    
    try {
      setIsSubmitting(true);
      // 🌟 FIX: Clean API call to /reports
      await api.post('/reports', {
        question_id: questionId.trim() 
      });
      
      setMessage("Report submitted successfully!");
      alert("Report submitted. We'll look into this question!");
      navigate(-1); 
      
    } catch (error) {
      console.error("Report error:", error);
      alert("Could not submit report. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 font-sans">
      {/* Fixed Header Layout */}
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
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-gray-900 dark:text-white mb-8">
          EXAM ENGINE
        </h1>

        {/* Added Dark Mode Classes to the Card */}
        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-amber-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Report Question</h2>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Found a typo, wrong key, or formatting issue? Enter the Question ID below to let us know.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="questionId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Question ID
              </label>
              <input
                id="questionId"
                type="text"
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
                maxLength={25} 
                placeholder="e.g. KCET-2023-PHY-Q12"
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-400 transition-shadow uppercase placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-gray-900 dark:bg-white text-white dark:text-black p-3 rounded-lg font-bold hover:bg-black dark:hover:bg-gray-200 flex justify-center items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              {!isSubmitting && <Send size={18} />}
            </button>
            
            {message && (
              <p className="text-green-600 dark:text-green-400 text-sm font-medium text-center mt-2">{message}</p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportPage;