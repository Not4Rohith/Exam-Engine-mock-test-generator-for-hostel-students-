import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SelectModePage from './pages/SelectModePage';
import ExtrasPage from './pages/ExtrasPage';
import ReportPage from './pages/ReportPage';
import FeedbackPage from './pages/FeedbackPage';
import MockConfigPage from './pages/MockConfigPage';
import PracticeConfigPage from './pages/PracticeConfigPage';
import PreviewPage from './pages/PreviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mode" element={<SelectModePage />} />
        <Route path="/extras" element={<ExtrasPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/mock-config" element={<MockConfigPage />} />
        <Route path="/practice-config" element={<PracticeConfigPage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;