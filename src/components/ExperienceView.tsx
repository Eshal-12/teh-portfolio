import { motion } from 'motion/react';
import { MapPin, Server, Layers } from 'lucide-react';
import { experienceList } from '../data';

export default function ExperienceView() {
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
          Career Index
        </div>
        <h1 id="exp-page-title" className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#1C1B19]">
          Professional Experience
        </h1>
        <p className="text-sm sm:text-base font-sans font-light tracking-wide text-[#1C1B19]/75 max-w-2xl leading-relaxed">
          A career record bridging technical network analysis, information technology pedagogy, and rigorous educational administration.
        </p>
      </motion.div>

      {/* Grid structure: main timeline on left (8 cols), ledger stats on right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Timeline of Professional Experience */}
        <div className="lg:col-span-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="space-y-8"
          >
            {experienceList.map((job) => {
              const isLecturer = job.role.includes('Lecturer');
              return (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className="group p-6 border border-[#1C1B19]/10 bg-white rounded-xl shadow-sm transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C1B19]/10 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1C1B19] uppercase tracking-tight">
                        {job.role}
                      </h3>
                      <div className="text-xs font-mono font-bold text-[#1C1B19]/60 mt-1 uppercase">
                        {job.organization}
                      </div>
                    </div>

                    <div className="sm:text-right flex-shrink-0">
                      <span className="inline-block px-2.5 py-1 border border-[#1C1B19]/10 bg-[#FCFBF7] text-[#1C1B19] text-[10px] font-mono font-bold uppercase rounded">
                        {job.dateRange}
                      </span>
                      <div className="flex items-center text-[10px] font-mono text-[#1C1B19]/60 mt-1.5 sm:justify-end uppercase font-bold">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-[#1C1B19]/50" />
                        {job.location}
                      </div>
                    </div>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-3">
                    {job.highlights.map((bullet, idx) => (
                      <li key={idx} className="flex items-start text-xs font-sans font-light tracking-wide text-[#1C1B19]/80 leading-relaxed">
                        <span className="h-1.5 w-1.5 bg-[#1C1B19] mt-2 mr-3 flex-shrink-0 rounded-full" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Specialty Banner for CS Lecturer */}
                  {isLecturer && (
                    <div className="mt-4 p-4 border border-[#1C1B19]/10 bg-[#F4F0E8] rounded-lg flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="p-2 border border-[#1C1B19]/15 bg-white text-[#1C1B19] flex-shrink-0 rounded">
                        <Server className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-mono font-bold text-[#1C1B19] tracking-wider uppercase">Laboratory Supervision</h4>
                        <p className="text-[11px] font-sans font-light tracking-wide text-[#1C1B19]/75 mt-1 leading-relaxed">
                          Directly in charge of administering <strong>4 distinct computer labs</strong> hosting 120+ active workstations. Configured physical LAN network structures, conducted system upgrades, and ensured high-uptime for student testing modules.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right sidebar details */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="lg:col-span-4 space-y-8"
        >
          <motion.div 
            variants={itemVariants}
            className="p-6 border border-[#1C1B19]/10 bg-[#1C1B19] text-white space-y-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center space-x-2 text-white/50">
              <Layers className="h-4 w-4" />
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase">System Ledger Summary</span>
            </div>
            
            <h3 className="text-xl font-serif font-bold tracking-tight leading-none">
              Administrative Reach
            </h3>
            
            <div className="space-y-4 pt-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-white/60 font-semibold uppercase text-[9px] tracking-wider">Testing Controller</span>
                <span className="font-bold text-[#FCFBF7]">BISE Mardan</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-white/60 font-semibold uppercase text-[9px] tracking-wider">Hardware Under Admin</span>
                <span className="font-bold text-[#FCFBF7]">120+ Hosts</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-white/60 font-semibold uppercase text-[9px] tracking-wider">Lab Infrastructure</span>
                <span className="font-bold text-[#FCFBF7]">4 Active Labs</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-white/60 font-semibold uppercase text-[9px] tracking-wider">Broadband Networks</span>
                <span className="font-bold text-[#FCFBF7]">PTCL Backbone</span>
              </div>
            </div>

            <p className="text-xs text-white/70 font-sans font-light tracking-wide leading-relaxed italic border-t border-white/15 pt-4">
              "Directly auditing academic hardware grids and coordinating exam testing logs prepares me to build resilient, standardized software layouts."
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="p-6 border border-[#1C1B19]/10 bg-white space-y-3 rounded-xl shadow-sm"
          >
            <h4 className="text-[10px] font-mono font-bold text-[#1C1B19] tracking-wider uppercase">Technical Documentation</h4>
            <p className="text-[11px] font-sans font-light tracking-wide text-[#1C1B19]/75 leading-relaxed">
              Extensively trained in generating physical assets audits, examination guidelines booklets, grading rubrics, and educational networking reports.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
