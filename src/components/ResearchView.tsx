import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Cpu, Award, Globe, Check, Copy } from 'lucide-react';
import { projectsList, publicationsList } from '../data';

export default function ResearchView() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="text-xs font-mono font-bold text-[#1C1B19] uppercase tracking-widest bg-[#EAE6DF] inline-block px-2.5 py-0.5 rounded-sm">
          Scientific Ledger
        </div>
        <h1 id="research-page-title" className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#1C1B19]">
          Research & Projects
        </h1>
        <p className="text-sm sm:text-base font-sans font-light tracking-wide text-[#1C1B19]/75 max-w-2xl leading-relaxed">
          Exploring the application of AI and Machine Learning models to safeguard high-speed telecom carrier streams and automate target identification hardware.
        </p>
      </motion.div>

      {/* Primary Projects Section */}
      <div className="space-y-10">
        <motion.div variants={itemVariants} className="flex items-center space-x-3 pb-2 border-b border-[#1C1B19]/10">
          <Cpu className="h-5 w-5 text-[#1C1B19]" />
          <h2 className="text-lg font-bold tracking-tight font-sans text-[#1C1B19]">Core Engineering Thesis Projects</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projectsList.map((project) => {
            const isMS = project.type === 'ms';
            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group flex flex-col bg-white border border-[#1C1B19]/10 p-6 space-y-4 rounded-xl shadow-sm"
              >
                {/* Project Header without Photos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-block px-2.5 py-0.5 bg-[#1C1B19] text-white text-[9px] font-mono font-bold tracking-wider uppercase rounded">
                      {isMS ? 'MS Thesis Project' : 'BS Final Year Project'}
                    </span>
                    <div className="text-[10px] font-mono font-bold text-[#1C1B19] bg-[#EAE6DF] border border-[#1C1B19]/10 px-2.5 py-0.5 inline-block uppercase rounded">
                      {project.sponsor}
                    </div>
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-[#1C1B19] leading-snug">
                    {project.title}
                  </h3>
                </div>

                {/* Project Body */}
                <div className="flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs font-sans font-light tracking-wide text-[#1C1B19]/80 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Bullet Highlights */}
                    <ul className="space-y-2 pt-2">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start text-xs font-sans font-light tracking-wide text-[#1C1B19]/70 leading-relaxed">
                          <span className="h-1.5 w-1.5 bg-[#1C1B19]/70 mt-2 mr-2.5 flex-shrink-0 rounded-full" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!isMS && (
                    <div className="pt-3 border-t border-[#1C1B19]/10 flex items-center space-x-2 text-[10px] font-bold text-[#1C1B19] font-mono">
                      <Award className="h-3.5 w-3.5 text-[#1C1B19]" />
                      <span className="uppercase tracking-wide">DEPLOYED RECORD: HEAVY INDUSTRIES TAXILA (HIT)</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Publications Section */}
      <div className="space-y-8 pt-6">
        <motion.div variants={itemVariants} className="flex items-center space-x-3 pb-2 border-b border-[#1C1B19]/10">
          <BookOpen className="h-5 w-5 text-[#1C1B19]" />
          <h2 className="text-lg font-bold tracking-tight font-sans text-[#1C1B19]">Peer-Reviewed Conference Presentations</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publicationsList.map((pub) => {
            return (
              <motion.div
                key={pub.id}
                variants={itemVariants}
                className="p-6 border border-[#1C1B19]/10 bg-white hover:bg-[#F4F0E8] rounded-xl shadow-sm transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2.5 py-0.5 border border-[#1C1B19]/10 text-[9px] font-mono font-bold tracking-wider uppercase bg-[#EAE6DF] text-[#1C1B19] rounded">
                      {pub.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#1C1B19]/60">
                      {pub.year}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1C1B19] uppercase leading-snug tracking-tight">
                    "{pub.title}"
                  </h3>

                  <div className="text-xs font-sans font-light tracking-wide text-[#1C1B19]/80">
                    Presented at: <strong className="text-[#1C1B19] font-semibold">{pub.conference}</strong>
                  </div>

                  <div className="flex items-center text-[10px] text-[#1C1B19]/60 font-mono font-bold">
                    <Globe className="h-3.5 w-3.5 mr-1.5 text-[#1C1B19]/50" />
                    <span className="uppercase">{pub.location}</span>
                  </div>
                </div>

                {/* Citation Copy panel */}
                <div className="pt-4 border-t border-[#1C1B19]/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-[#1C1B19]/50 uppercase">Oral Presentation (Turkey)</span>
                  <button
                    id={`copy-citation-${pub.id}`}
                    onClick={() => handleCopyCitation(pub.id, `${pub.title}. Presented at ${pub.conference}, ${pub.location}, ${pub.year}.`)}
                    className="px-3 py-1.5 border border-[#1C1B19]/20 hover:bg-[#EAE6DF] rounded transition-colors text-[10px] font-mono font-bold flex items-center space-x-1.5 cursor-pointer bg-white"
                    title="Copy standard citation"
                  >
                    {copiedId === pub.id ? (
                      <>
                        <Check className="h-3 w-3 text-[#1C1B19]" />
                        <span className="text-[9px] text-[#1C1B19] font-mono font-bold uppercase">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-[#1C1B19]/60" />
                        <span className="text-[9px] font-mono uppercase">Cite</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
