import { motion } from 'motion/react';
import { MessageSquare, GripHorizontal } from 'lucide-react';

interface FloatingDockProps {
  onNavigateContact: () => void;
}

export default function FloatingDock({ onNavigateContact }: FloatingDockProps) {
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

      {/* Direct Contact Form Button */}
      <button
        id="floating-contact-btn"
        onClick={(e) => {
          e.stopPropagation();
          onNavigateContact();
        }}
        className="p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center border border-white/10 shadow-md group relative"
        title="Contact Form"
      >
        <MessageSquare className="h-4 w-4 text-white" />
        <span className="absolute right-14 scale-0 group-hover:scale-100 transition-all origin-right bg-[#1C1B19] text-white text-[10px] font-mono font-bold tracking-wider uppercase py-1 px-2 border border-white/15 rounded-md shadow-lg pointer-events-none whitespace-nowrap">
          Contact Form
        </span>
      </button>
    </motion.div>
  );
}
