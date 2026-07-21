import { motion } from 'motion/react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { PageType } from '../types';
import { personalInfo } from '../data';

interface NavbarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Navbar({ currentPage, setCurrentPage, isOpen, setIsOpen }: NavbarProps) {
  const navItems: { id: PageType; label: string }[] = [
    { id: 'home', label: 'Profile' },
    { id: 'education', label: 'Education & Awards' },
    { id: 'experience', label: 'Professional Experience' },
    { id: 'research', label: 'Research & Projects' },
    { id: 'blog', label: 'Technical Blog' },
    { id: 'skills', label: 'Skills & Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FCFBF7]/90 backdrop-blur-md border-b border-[#1C1B19]/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button 
              id="nav-logo-btn"
              onClick={() => setCurrentPage('home')} 
              className="flex flex-col text-left cursor-pointer group"
            >
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1B19] group-hover:opacity-80 transition-opacity">
                Tehleel Basit
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#1C1B19]/60 uppercase leading-none mt-1">
                Telecommunication Engineer
              </span>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3 py-2 text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer relative ${
                    isActive 
                      ? 'text-[#1C1B19]' 
                      : 'text-[#1C1B19]/50 hover:text-[#1C1B19]'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1C1B19]"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 border border-[#1C1B19]/20 bg-white text-[#1C1B19] hover:bg-[#F4F0E8] focus:outline-none cursor-pointer rounded-md transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-[#1C1B19]/10 bg-[#FCFBF7]"
        >
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-md text-xs font-sans font-bold uppercase flex items-center justify-between transition-colors cursor-pointer ${
                  currentPage === item.id 
                    ? 'bg-[#1C1B19] text-[#FCFBF7]' 
                    : 'bg-transparent text-[#1C1B19] hover:bg-[#F4F0E8]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* Direct Contact details at bottom of mobile menu */}
            <div className="pt-4 pb-2 border-t border-[#1C1B19]/10 px-4 space-y-2">
              <div className="flex items-center text-[11px] text-[#1C1B19]/60 font-mono">
                <Phone className="h-3.5 w-3.5 text-[#1C1B19] mr-2" />
                {personalInfo.phone}
              </div>
              <div className="flex items-center text-[11px] text-[#1C1B19]/60 font-mono">
                <Mail className="h-3.5 w-3.5 text-[#1C1B19] mr-2" />
                {personalInfo.email}
              </div>
              <div className="flex items-center text-[11px] text-[#1C1B19]/60 font-mono">
                <MapPin className="h-3.5 w-3.5 text-[#1C1B19] mr-2" />
                {personalInfo.location}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
