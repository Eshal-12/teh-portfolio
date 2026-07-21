import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Send, MessageSquare, Languages } from 'lucide-react';
import { skillsList, certificationsList, languages, interests, personalInfo } from '../data';

export default function SkillsView() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'telecom' | 'analysis' | 'software' | 'soft'>('all');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const categories: { id: typeof activeCategory; label: string }[] = [
    { id: 'all', label: 'All Competencies' },
    { id: 'telecom', label: 'Telecom & Networks' },
    { id: 'analysis', label: 'Data & Traffic' },
    { id: 'software', label: 'Engineering Tools' },
    { id: 'soft', label: 'Coordination & Writing' }
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skillsList 
    : skillsList.filter(sk => sk.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
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
          Capacity & Message Dispatch
        </div>
        <h1 id="skills-page-title" className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#1C1B19]">
          Skills & Direct Contact
        </h1>
        <p className="text-sm sm:text-base font-sans font-light tracking-wide text-[#1C1B19]/75 max-w-2xl leading-relaxed">
          Comprehensive register of technical skill indices, structural engineering tools, certifications, and communication protocols.
        </p>
      </motion.div>

      {/* Grid: Skills on Left (7 cols), Contact on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Skills and Certifications */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-[#1C1B19]/10 pb-2">
              <div className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-[#1C1B19]" />
                <h2 className="text-lg font-bold tracking-tight font-sans text-[#1C1B19]">Competency Matrix</h2>
              </div>
            </motion.div>

            {/* Category Filter Pills */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  id={`filter-btn-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 border text-xs font-sans font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#1C1B19] text-white border-[#1C1B19]'
                      : 'bg-white text-[#1C1B19] border-[#1C1B19]/15 hover:bg-[#F4F0E8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>

            {/* Render Skill Progress Blocks */}
            <div className="space-y-6 pt-2">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map(sk => (
                  <motion.div
                    key={sk.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3.5 border border-[#1C1B19]/10 p-5 bg-white hover:bg-[#F4F0E8] rounded-xl transition-colors shadow-sm"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-tight text-[#1C1B19]">{sk.name}</span>
                      <span className="font-mono text-[10px] font-bold text-white bg-[#1C1B19] px-2 py-0.5 rounded">
                        RATING: {sk.rating}%
                      </span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="h-2 w-full bg-[#EAE6DF] border border-[#1C1B19]/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sk.rating}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-[#1C1B19]"
                      />
                    </div>
                    <p className="text-[11px] font-sans font-light tracking-wide text-[#1C1B19]/70 leading-relaxed pt-1">
                      {sk.details}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Certifications and Languages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#1C1B19]/10">
            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1C1B19] flex items-center">
                <span className="h-2 w-2 bg-[#1C1B19] mr-2 rounded-full" />
                Certificates Record
              </h3>
              <ul className="space-y-2">
                {certificationsList.map(cert => (
                  <li key={cert.id} className="flex items-start text-xs font-sans font-light tracking-wide text-[#1C1B19]/75 font-medium">
                    <span className="h-1.5 w-1.5 bg-[#1C1B19]/50 mt-1.5 mr-2.5 flex-shrink-0 rounded-full" />
                    <span>{cert.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1C1B19] flex items-center">
                <Languages className="h-4 w-4 text-[#1C1B19] mr-2" />
                Linguistic Skills
              </h3>
              <div className="space-y-3">
                {languages.map((lang, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="text-xs font-sans font-bold uppercase tracking-tight text-[#1C1B19]">{lang.name}</div>
                    <div className="text-[10px] font-mono text-[#1C1B19]/50 font-bold uppercase leading-none">{lang.level}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form & Reach Me */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-6 border border-[#1C1B19]/10 bg-white rounded-xl shadow-sm space-y-6">
            <h2 className="text-md font-bold uppercase tracking-tight font-sans text-[#1C1B19] flex items-center">
              <MessageSquare className="h-4 w-4 text-[#1C1B19] mr-2" />
              Direct Message Dispatch
            </h2>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleFormSubmit} 
                  className="space-y-4 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-[#1C1B19]/70 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Muhammad Khan"
                      className="w-full px-3 py-2.5 border border-[#1C1B19]/15 rounded-lg bg-white text-[#1C1B19] font-sans font-light focus:outline-none focus:border-[#1C1B19]/50 focus:bg-[#F4F0E8] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-[#1C1B19]/70 uppercase">Email coordinates *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@organization.com"
                      className="w-full px-3 py-2.5 border border-[#1C1B19]/15 rounded-lg bg-white text-[#1C1B19] font-sans font-light focus:outline-none focus:border-[#1C1B19]/50 focus:bg-[#F4F0E8] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-[#1C1B19]/70 uppercase">Subject Heading</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Research Collaboration Inquiry"
                      className="w-full px-3 py-2.5 border border-[#1C1B19]/15 rounded-lg bg-white text-[#1C1B19] font-sans font-light focus:outline-none focus:border-[#1C1B19]/50 focus:bg-[#F4F0E8] transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-bold text-[#1C1B19]/70 uppercase">Message Content *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your brief here..."
                      className="w-full px-3 py-2.5 border border-[#1C1B19]/15 rounded-lg bg-white text-[#1C1B19] font-sans font-light focus:outline-none focus:border-[#1C1B19]/50 focus:bg-[#F4F0E8] resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1C1B19] hover:bg-[#1C1B19]/90 text-white rounded-lg font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Message</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="form-success-banner"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#F4F0E8] border border-[#1C1B19]/10 p-6 text-center space-y-3 rounded-xl"
                >
                  <div className="h-10 w-10 rounded-full border border-[#1C1B19]/10 bg-white text-[#1C1B19] flex items-center justify-center mx-auto font-mono font-bold shadow-sm">
                    ✓
                  </div>
                  <h3 className="text-xs font-mono font-bold uppercase text-[#1C1B19]">Message Dispatched!</h3>
                  <p className="text-xs font-sans font-light tracking-wide text-[#1C1B19]/75 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your inquiry has been simulated as successfully sent. We will get back to you shortly!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Contact Info */}
          <div className="p-6 border border-[#1C1B19]/10 bg-[#F4F0E8] rounded-xl space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-[#1C1B19] tracking-wider uppercase border-b border-[#1C1B19]/10 pb-1">Direct Communication Channels</h3>
            
            <div className="space-y-3 font-mono text-xs text-[#1C1B19] font-bold">
              <div className="flex items-center space-x-2.5">
                <span className="w-12 uppercase text-[#1C1B19]/50">PH:</span>
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-12 uppercase text-[#1C1B19]/50">EM1:</span>
                <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-12 uppercase text-[#1C1B19]/50">EM2:</span>
                <a href={`mailto:${personalInfo.alternateEmail}`} className="underline">{personalInfo.alternateEmail}</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-12 uppercase text-[#1C1B19]/50">LNK:</span>
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="underline text-amber-800 hover:text-amber-950 break-all">LinkedIn Profile</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="w-12 uppercase text-[#1C1B19]/50">LOC:</span>
                <span>Mardan, KPK, Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interests Section (Bottom) */}
      <div className="border-t border-[#1C1B19]/10 pt-10">
        <h3 className="text-xs font-mono font-bold text-[#1C1B19] uppercase tracking-widest bg-[#EAE6DF] inline-block px-2.5 py-0.5 rounded-sm mb-6">
          Investigative Focus & Hobbies
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {interests.map((interest, idx) => (
            <span 
              key={idx}
              className="px-3 py-1.5 border border-[#1C1B19]/10 bg-white text-xs text-[#1C1B19]/80 font-sans font-bold uppercase hover:bg-[#F4F0E8] transition-colors rounded-md shadow-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
