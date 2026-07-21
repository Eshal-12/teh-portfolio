import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, ChevronUp } from 'lucide-react';
import { PageType } from './types';
import { personalInfo } from './data';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import EducationView from './components/EducationView';
import ExperienceView from './components/ExperienceView';
import ResearchView from './components/ResearchView';
import SkillsView from './components/SkillsView';
import VoiceAssistant from './components/VoiceAssistant';
import FloatingDock from './components/FloatingDock';
import BlogView from './components/BlogView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Monitor scroll height to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top instantly when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView setCurrentPage={setCurrentPage} openAiAssistant={() => setIsAiOpen(true)} />;
      case 'education':
        return <EducationView />;
      case 'experience':
        return <ExperienceView />;
      case 'research':
        return <ResearchView />;
      case 'skills':
        return <SkillsView />;
      case 'blog':
        return <BlogView />;
      default:
        return <HomeView setCurrentPage={setCurrentPage} openAiAssistant={() => setIsAiOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text flex flex-col font-sans selection:bg-editorial-accent">
      {/* Dynamic Header & Navigation */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={mobileMenuOpen} 
        setIsOpen={setMobileMenuOpen} 
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#F4F0E8] border-t border-[#1C1B19]/10 text-[#1C1B19] select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[#1C1B19]/10">
            {/* Left side: branding & profile summary */}
            <div className="space-y-4">
              <div className="flex flex-col text-left">
                <span className="font-serif text-xl font-bold tracking-tight text-[#1C1B19]">
                  Tehleel Basit
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#1C1B19]/60 uppercase leading-none mt-1">
                  Telecommunication Engineer
                </span>
              </div>
              <p className="text-xs text-[#1C1B19]/70 leading-relaxed max-w-xs font-serif">
                Telecommunication Engineer specializing in AI-driven anomaly detection, network diagnostics, and examination administration models.
              </p>
            </div>

            {/* Middle: Quick navigation */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#1C1B19]/50">Portfolio Index</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans font-semibold">
                <button onClick={() => setCurrentPage('home')} className="text-left hover:underline cursor-pointer">Profile</button>
                <button onClick={() => setCurrentPage('education')} className="text-left hover:underline cursor-pointer">Education & Awards</button>
                <button onClick={() => setCurrentPage('experience')} className="text-left hover:underline cursor-pointer">Professional Experience</button>
                <button onClick={() => setCurrentPage('research')} className="text-left hover:underline cursor-pointer">Research & Projects</button>
                <button onClick={() => setCurrentPage('skills')} className="text-left hover:underline cursor-pointer">Skills & Contact</button>
              </div>
            </div>

            {/* Right: Quick contact cards */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#1C1B19]/50">Contact Coordinates</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <Phone className="h-3.5 w-3.5 text-[#1C1B19]/70" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-3.5 w-3.5 text-[#1C1B19]/70" />
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3.5 w-3.5 text-[#1C1B19]/70" />
                  <span>Mardan, KPK, Pakistan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#1C1B19]/60">
            <div>
              &copy; 2026 Tehleel Basit. Portfolio Ledger.
            </div>
            <div className="border border-[#1C1B19]/15 px-2.5 py-1 bg-white">
              Doc Ref: TB-RES-2026-KPK
            </div>
            <div>
              Status: Active Candidate
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Draggable Dock for Voice AI and Direct Contact */}
      <FloatingDock 
        onOpenAiAssistant={() => setIsAiOpen(true)}
        onNavigateContact={() => {
          setCurrentPage('skills');
          setTimeout(() => {
            const element = document.getElementById('skills-page-title');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        }}
      />

      {/* Floating Scroll-to-Top Button (Repositioned to the left of FloatingDock) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-24 p-3 bg-[#1C1B19] text-[#FCFBF7] rounded-full shadow-lg hover:opacity-90 transition-all z-40 cursor-pointer border border-[#FCFBF7]/10"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Voice-enabled AI Assistant Modal */}
      <AnimatePresence>
        {isAiOpen && (
          <VoiceAssistant 
            isOpen={isAiOpen} 
            onClose={() => setIsAiOpen(false)} 
            onNavigateContact={() => {
              setCurrentPage('skills');
              setTimeout(() => {
                const element = document.getElementById('skills-page-title');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 200);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
