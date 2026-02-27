import { GithubIcon, LinkedinIcon } from 'lucide-react';

// And then update the tags in the JSX to match:
// <GithubIcon size={20} />
// <LinkedinIcon size={20} />
const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
          A tool built to help hostel students access quality test prep offline. <br/>
          Generate, print, and conquer your exams!
        </p>
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
          Made with ❤️ by Rohith N R
        </div>
        

        <div className="flex gap-4">
          Find me on:
          <a href="https://github.com/Not4Rohith" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
            <GithubIcon size={20} />
          </a>
          <a href="https://www.linkedin.com/in/rohith-n-r-not4rohith/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
            <LinkedinIcon size={20} />
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;