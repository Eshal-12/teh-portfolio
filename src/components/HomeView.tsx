import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Download, Cpu, GraduationCap, 
  Briefcase, Award, X, MapPin, Calendar, Maximize2, Mic, MessageSquare
} from 'lucide-react';
import { personalInfo, galleryList } from '../data';
import { GalleryItem } from '../types';

interface HomeViewProps {
  setCurrentPage: (page: import('../types').PageType) => void;
}

export default function HomeView({ setCurrentPage }: HomeViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'academic' | 'research' | 'awards' | 'portrait'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredGallery = galleryList.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-20"
    >
      {/* Editorial Header / Tagline */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1C1B19]/10 pb-4 text-xs font-mono text-[#1C1B19]/60 tracking-wider">
        <div className="font-bold uppercase">Field Notes — Portfolio</div>
        <div className="mt-1 sm:mt-0 uppercase font-semibold">{personalInfo.location}</div>
      </motion.div>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left column - Intro Text */}
        <motion.div variants={itemVariants} className="lg:col-span-7 space-y-8">
          
          <h1 id="hero-title" className="text-5xl sm:text-6xl lg:text-7.5xl font-serif font-bold leading-tight tracking-tight text-[#1C1B19]">
            {personalInfo.name}
          </h1>
          
          <div className="text-md sm:text-lg font-sans font-semibold text-[#1C1B19]/80 tracking-wide border-l-2 border-[#1C1B19] pl-4">
            {personalInfo.title}
          </div>
          
          <p className="text-sm sm:text-base text-[#1C1B19]/75 leading-relaxed font-sans max-w-2xl font-light tracking-wide">
            {personalInfo.profileText}
          </p>



        </motion.div>

        {/* Right column - Elegant Frame for Profile Image */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-5 flex flex-col items-center"
        >
          <div className="w-full max-w-sm">
            <div className="border border-[#1C1B19]/15 bg-[#F4F0E8] p-4 text-center rounded-2xl shadow-sm">
              <div className="border border-[#1C1B19]/10 bg-white p-2 rounded-xl overflow-hidden">
                <img
                  src={personalInfo.avatar}
                  alt="Tehleel Basit - Telecommunication Engineer"
                  className="w-full h-auto aspect-square object-cover object-top filter contrast-[1.01]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4 border-t border-[#1C1B19]/10 pt-3 text-center flex items-center justify-center space-x-2 font-mono text-[10px] text-[#1C1B19]/60 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1C1B19]" />
                <span className="tracking-widest uppercase">Mardan · SEC: NETWORK ENG.</span>
              </div>
            </div>
            <div className="text-[9px] uppercase font-mono font-bold tracking-widest text-right mt-2.5 text-[#1C1B19]/40">
              Primary Portrait Record
            </div>
          </div>
        </motion.div>
      </div>

      {/* Professional Pillars / Stats Grid */}
      <div className="border-t border-[#1C1B19]/10 pt-16">
        <motion.div variants={itemVariants} className="text-left space-y-3">
          <div className="text-[10px] font-mono font-bold text-[#1C1B19] uppercase tracking-widest bg-[#EAE6DF] inline-block px-2.5 py-0.5 rounded-sm">
            Pillars of Practice
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-[#1C1B19]">
            Academic & System Focus Areas
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#1C1B19]/70 leading-relaxed max-w-2xl font-light tracking-wide">
            Synthesizing high-speed telecommunications research with functional examination administration and multi-user hardware management.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10"
        >
          <div className="p-6 border border-[#1C1B19]/10 rounded-xl bg-white hover:bg-[#F4F0E8] transition-colors space-y-4 shadow-sm">
            <div className="h-10 w-10 border border-[#1C1B19]/10 bg-[#FCFBF7] flex items-center justify-center text-[#1C1B19] rounded-lg">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider font-sans text-[#1C1B19]">AI & Cybersecurity</h3>
            <p className="text-xs text-[#1C1B19]/70 leading-relaxed font-sans font-light tracking-wide">
              Applying machine learning networks to identify anomalous packet behaviors and protect edge routers from threats.
            </p>
          </div>

          <div className="p-6 border border-[#1C1B19]/10 rounded-xl bg-white hover:bg-[#F4F0E8] transition-colors space-y-4 shadow-sm">
            <div className="h-10 w-10 border border-[#1C1B19]/10 bg-[#FCFBF7] flex items-center justify-center text-[#1C1B19] rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider font-sans text-[#1C1B19]">IT Pedagogy</h3>
            <p className="text-xs text-[#1C1B19]/70 leading-relaxed font-sans font-light tracking-wide">
              Teaching computer systems at Fazl-e-Haq College and administering 4 distinct systems labs (120+ active hosts).
            </p>
          </div>

          <div className="p-6 border border-[#1C1B19]/10 rounded-xl bg-white hover:bg-[#F4F0E8] transition-colors space-y-4 shadow-sm">
            <div className="h-10 w-10 border border-[#1C1B19]/10 bg-[#FCFBF7] flex items-center justify-center text-[#1C1B19] rounded-lg">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider font-sans text-[#1C1B19]">BISE Mardan</h3>
            <p className="text-xs text-[#1C1B19]/70 leading-relaxed font-sans font-light tracking-wide">
              Assisting as Controller of Examinations, standardizing test security protocols, and managing results data.
            </p>
          </div>

          <div className="p-6 border border-[#1C1B19]/10 rounded-xl bg-white hover:bg-[#F4F0E8] transition-colors space-y-4 shadow-sm">
            <div className="h-10 w-10 border border-[#1C1B19]/10 bg-[#FCFBF7] flex items-center justify-center text-[#1C1B19] rounded-lg">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider font-sans text-[#1C1B19]">Defense R&D</h3>
            <p className="text-xs text-[#1C1B19]/70 leading-relaxed font-sans font-light tracking-wide">
              Designing hardware thermal targeting setups with signal decoders tested and running on active armored fighting vehicles.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Interactive Photo Ledger & Field Records Gallery */}
      <div className="border-t border-[#1C1B19]/10 pt-16">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold text-[#1C1B19] uppercase tracking-widest bg-[#EAE6DF] inline-block px-2.5 py-0.5 rounded-sm">
              Photographic Proof of Practice
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-[#1C1B19]">
              Academic & Field Records
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#1C1B19]/70 leading-relaxed max-w-2xl font-light tracking-wide">
              An interactive visual catalog documenting research projects, state examinations, national honors, and official academic coordination.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold uppercase">
            {(['all', 'academic', 'research', 'awards', 'portrait'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 border rounded transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#1C1B19] border-[#1C1B19] text-[#FCFBF7]'
                    : 'bg-white border-[#1C1B19]/15 text-[#1C1B19] hover:bg-[#F4F0E8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedPhoto(item)}
                className="group border border-[#1C1B19]/10 bg-white p-3 rounded-xl shadow-sm hover:border-[#1C1B19]/30 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] bg-[#F4F0E8] overflow-hidden rounded-lg border border-[#1C1B19]/10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top grayscale contrast-[1.01] group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">
                        View Details
                      </span>
                      <Maximize2 className="h-4 w-4" />
                    </div>
                    {/* Badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#1C1B19]/90 border border-white/10 text-white text-[9px] font-mono font-bold uppercase tracking-wider rounded">
                      {item.category}
                    </span>
                  </div>

                  {/* Photo details */}
                  <div className="space-y-1 px-1">
                    <h3 className="text-xs font-bold uppercase text-[#1C1B19] tracking-tight group-hover:text-[#1C1B19]/80 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-sans font-light text-[#1C1B19]/70 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex items-center justify-between text-[9px] font-mono text-[#1C1B19]/65 pt-3 border-t border-[#1C1B19]/5 px-1 mt-3">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-[#1C1B19]/50" />
                    {item.date}
                  </span>
                  <span className="flex items-center truncate max-w-[120px]" title={item.location}>
                    <MapPin className="h-3 w-3 mr-1 text-[#1C1B19]/50" />
                    {item.location}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox / Modal Portal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-[#1C1B19]/90 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-4xl bg-white border border-[#1C1B19]/20 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1C1B19]/10 hover:bg-[#1C1B19]/20 text-[#1C1B19] transition-colors cursor-pointer"
                aria-label="Close photo view"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Side: Photo Frame */}
              <div className="md:w-3/5 bg-[#F4F0E8] p-4 flex items-center justify-center relative min-h-[300px] md:min-h-0 border-b md:border-b-0 md:border-r border-[#1C1B19]/10 overflow-hidden">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[50vh] md:max-h-[70vh] object-contain rounded-lg border border-[#1C1B19]/10 shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Side: Museum Metadata Label */}
              <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                  {/* Category Badge */}
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-[#EAE6DF] border border-[#1C1B19]/15 text-[#1C1B19] text-[9px] font-mono font-bold uppercase tracking-widest rounded">
                      Category // {selectedPhoto.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1C1B19] uppercase leading-tight">
                      {selectedPhoto.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-[10px] font-mono text-[#1C1B19]/60">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#1C1B19]/40" />
                        {selectedPhoto.date}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-[#1C1B19]/40" />
                        {selectedPhoto.location}
                      </span>
                    </div>
                  </div>

                  {/* Museum Label style line */}
                  <div className="h-px bg-[#1C1B19]/10 w-12" />

                  <p className="text-xs sm:text-sm font-sans font-light tracking-wide text-[#1C1B19]/80 leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-[#1C1B19]/10 flex items-center justify-between text-[9px] font-mono font-bold uppercase text-[#1C1B19]/40 mt-8">
                  <span>Photo Ledger Ref: {selectedPhoto.id.toUpperCase()}</span>
                  <span>Doc Status: Verified</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Featured Quote / Research Summary */}
      <motion.div 
        variants={itemVariants} 
        className="rounded-2xl border border-[#1C1B19]/10 bg-white p-8 md:p-10 text-[#1C1B19] relative shadow-sm"
      >
        <div className="absolute top-0 right-0 p-6 text-[#1C1B19]/5 text-9xl font-serif pointer-events-none select-none leading-none">
          ”
        </div>
        <div className="relative max-w-3xl space-y-4">
          <div className="text-[9px] font-mono font-bold tracking-widest text-[#1C1B19]/50 uppercase">
            Active Thesis Abstract
          </div>
          <blockquote className="text-sm sm:text-base font-sans italic font-light tracking-wide text-[#1C1B19]/85 leading-relaxed">
            "By deploying federated learning and lightweight feature-selection algorithms on network edge gateways, we can identify high-speed carrier traffic anomalies with minimal compute overhead while fully preserving packet privacy."
          </blockquote>
          <div className="pt-2">
            <span className="block text-sm font-sans font-bold uppercase tracking-wider">Tehleel Basit</span>
            <span className="block text-xs text-[#1C1B19]/60 font-mono font-medium">UET Mardan · MS Telecommunication Candidate</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
