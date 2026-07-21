import React from 'react';
import { motion } from 'motion/react';
import { Mic, MessageSquare, GripHorizontal } from 'lucide-react';

interface FloatingDockProps {
  onOpenAiAssistant: () => void;
  onNavigateContact: () => void;
}

export default function FloatingDock({ onOpenAiAssistant, onNavigateContact }: FloatingDockProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-40 bg-[#1C1B19] text-white p-2.5 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center space-y-2 select-none cursor-grab active:cursor-grabbing w-14 touch-none"
      title="Drag me anywhere!"
    >
      {/* Draggable indicator/handle */}
      <div className="text-white/40 hover:text-white/80 transition-colors py-0.5">
        <GripHorizontal className="h-3.5 w-3.5" />
      </div>

      {/* Button 1: Voice AI Assistant (Small, elegant, voice trigger) */}
      <button
        id="floating-ai-assistant-btn"
        onClick={(e) => {
          e.stopPropagation();
          onOpenAiAssistant();
        }}
        className="p-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 text-amber-400 hover:text-amber-300 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-white/10 shadow-md group relative"
        title="Voice AI Assistant"
      >
        <Mic className="h-4 w-4 animate-pulse" />
        <span className="absolute right-14 scale-0 group-hover:scale-100 transition-all origin-right bg-[#1C1B19] text-white text-[10px] font-mono font-bold tracking-wider uppercase py-1 px-2 border border-white/15 rounded-md shadow-lg pointer-events-none whitespace-nowrap">
          Voice AI Assistant
        </span>
      </button>

      {/* Button 2: Direct Contact (Small, elegant, navigates/scrolls) */}
      <button
        id="floating-contact-btn"
        onClick={(e) => {
          e.stopPropagation();
          onNavigateContact();
        }}
        className="p-2.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center border border-white/10 shadow-md group relative"
        title="Direct Contact Section"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="absolute right-14 scale-0 group-hover:scale-100 transition-all origin-right bg-[#1C1B19] text-white text-[10px] font-mono font-bold tracking-wider uppercase py-1 px-2 border border-white/15 rounded-md shadow-lg pointer-events-none whitespace-nowrap">
          Contact Section
        </span>
      </button>
    </motion.div>
  );
}
