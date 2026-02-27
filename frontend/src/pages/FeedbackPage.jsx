import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🌟 FIX: Use the central api config
import api from '../api/axiosConfig'; 
import Footer from '../components/layout/Footer';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import ThemeToggle from '../components/layout/ThemeToggle';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', feedback: '' });
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.feedback.trim()) {
      return alert("Please fill out all fields.");
    }

    try {
      setStatus('sending');
      setMessage(''); 
      
      // 🌟 FIX: Clean API call (baseURL already includes /api)
      await api.post('/feedback', {
        name: formData.name.trim(),
        feedback: formData.feedback.trim()
      });
      
      setStatus('success');
      setMessage("Feedback submitted successfully! Thank you.");
      setFormData({ name: '', feedback: '' }); 
      
      setTimeout(() => setMessage(''), 5000);
      
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
      setMessage("Failed to submit. Please check your internet connection.");
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 font-sans">
      
      {/* FIXED: Header alignment */}
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-8 md:-mt-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-gray-900 dark:text-white mb-8">
          EXAM ENGINE
        </h1>

        <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="text-blue-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Feedback</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={50}
                placeholder="What should we call you?"
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-400 transition-shadow placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                maxLength={500}
                rows={4}
                placeholder="Share your thoughts, suggestions, or feature requests..."
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-400 transition-shadow resize-none placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>
            
            {/* FIXED: Uses the status state to show loading text and disable clicks */}
            <button 
              type="submit"
              disabled={status === 'sending'}
              className="mt-2 w-full bg-gray-900 dark:bg-white text-white dark:text-black p-3 rounded-lg font-bold hover:bg-black dark:hover:bg-gray-200 flex justify-center items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{status === 'sending' ? 'Sending...' : 'Send Feedback'}</span>
              {status !== 'sending' && <Send size={18} />}
            </button>

            {/* FIXED: Form message display formatting */}
            {message && (
              <p className={`text-sm font-medium text-center mt-2 ${status === 'error' ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeedbackPage;