import { motion } from 'motion/react';
import { GraduationCap, Award, BookOpen, Building2, Star } from 'lucide-react';
import { educationList, achievementList } from '../data';

export default function EducationView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 80, 
        damping: 18,
        mass: 1 
      } 
    }
  };

  return (
    <div className="space-y-16">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        className="space-y-4"
      >
        <div className="text-xs font-mono font-bold text-[#1C1B19] uppercase tracking-widest bg-[#EAE6DF] inline-block px-2.5 py-0.5 rounded-sm">
          Academic Background
        </div>
        <h1 id="edu-page-title" className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#1C1B19]">
          Education & Honors
        </h1>
        <p className="text-sm sm:text-base font-sans font-light tracking-wide text-[#1C1B19]/75 max-w-2xl leading-relaxed">
          Combining deep technical study in telecommunications engineering with pedagogical development, educational certifications, and awards.
        </p>
      </motion.div>

      {/* Grid: Timeline on left (6 cols), Awards on right (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Education Timeline */}
        <div className="lg:col-span-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 pb-2 border-b border-[#1C1B19]/10"
          >
            <GraduationCap className="h-5 w-5 text-[#1C1B19]" />
            <h2 className="text-lg font-bold tracking-tight font-sans text-[#1C1B19]">Academic Chronology</h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="relative pl-6 border-l border-[#1C1B19]/15 space-y-8"
          >
            {educationList.map((edu, idx) => {
              const isEngineering = edu.degree.includes('Engineering');
              return (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className="relative space-y-2 group"
                >
                  {/* Timeline Node Dot (Circle) */}
                  <div className={`absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full border border-[#1C1B19]/30 transition-transform duration-300 group-hover:scale-125 ${
                    isEngineering ? 'bg-[#1C1B19]' : 'bg-white'
                  }`} />

                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="inline-block px-2.5 py-0.5 border border-[#1C1B19]/10 text-[9px] font-mono font-bold text-[#1C1B19]/70 bg-[#FCFBF7] rounded">
                      {edu.years}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-white bg-[#1C1B19] px-2 py-0.5 rounded">
                      {edu.result}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1C1B19] tracking-tight group-hover:text-[#1C1B19]/80 transition-colors">
                    {edu.degree}
                  </h3>

                  <div className="flex items-center text-xs font-mono text-[#1C1B19]/60">
                    <Building2 className="h-3.5 w-3.5 mr-1.5 text-[#1C1B19]/50 flex-shrink-0" />
                    <span className="font-semibold uppercase">{edu.institution}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Column: Achievements Cards */}
        <div className="lg:col-span-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-3 pb-2 border-b border-[#1C1B19]/10"
          >
            <Award className="h-5 w-5 text-[#1C1B19]" />
            <h2 className="text-lg font-bold tracking-tight font-sans text-[#1C1B19]">Distinctions & Awards</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {achievementList.map((ach) => {
              return (
                <motion.div
                  key={ach.id}
                  variants={itemVariants}
                  className="group relative flex flex-col bg-white border border-[#1C1B19]/10 p-4 rounded-xl space-y-3 hover:shadow-md transition-shadow"
                >
                  {/* Visual Image container */}
                  <div className="h-40 overflow-hidden relative border border-[#1C1B19]/10 bg-[#F4F0E8] p-1 rounded-lg">
                    <img
                      src={ach.image}
                      alt={ach.title}
                      className="w-full h-full object-cover object-top grayscale contrast-[1.01] hover:grayscale-0 transition-all duration-500 rounded-md"
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay badge */}
                    <div className="absolute top-2.5 left-2.5 bg-white px-2 py-0.5 text-[9px] font-mono text-[#1C1B19] font-bold border border-[#1C1B19]/10 flex items-center space-x-1 uppercase tracking-wider rounded">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                      <span>HONOR</span>
                    </div>
                  </div>

                  {/* Content body */}
                  <div className="flex-grow flex flex-col justify-between space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-[#1C1B19] leading-snug">
                      {ach.title}
                    </h3>
                    <p className="text-[11px] font-sans font-light tracking-wide text-[#1C1B19]/70 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Bottom Academic Statement Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: 'spring', stiffness: 70, damping: 16 }}
        className="border border-[#1C1B19]/10 bg-[#F4F0E8] p-6 md:p-8 rounded-2xl shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#1C1B19]">
              <BookOpen className="h-4 w-4" />
              <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#1C1B19]/60">Active Academic Candidacy</span>
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight text-[#1C1B19]">MS Telecommunication Thesis Defense Preparation</h3>
            <p className="text-xs font-sans font-light tracking-wide text-[#1C1B19]/70 max-w-3xl leading-relaxed">
              Actively working alongside the Telecommunication Engineering research division at UET Mardan to defend final MS Thesis findings. Representing hybrid optimization models that solve network cybersecurity deficits on edge nodes.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white border border-[#1C1B19]/10 px-5 py-4 text-center min-w-[120px] rounded-xl shadow-sm">
            <span className="block text-3xl font-bold text-[#1C1B19] font-mono leading-none">4.00</span>
            <span className="block text-[8px] font-mono text-[#1C1B19]/40 font-bold uppercase mt-1">MS CGPA</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
