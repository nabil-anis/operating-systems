
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages - to be created
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import DetectionFix from './pages/DetectionFix';
import Learn from './pages/Learn';
import Presentation from './pages/Presentation';

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/detection" element={<DetectionFix />} />
            <Route path="/analysis" element={<Learn />} />
            <Route path="/presentation" element={<Presentation />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
