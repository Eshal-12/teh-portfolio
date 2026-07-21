import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Calendar, Clock, ArrowRight, BookOpen, X, 
  Tag, ArrowLeft, ChevronRight, User, Sparkles
} from 'lucide-react';
import { BlogItem } from '../types';

const BLOG_POSTS: BlogItem[] = [
  {
    id: 'blog-fyp-thermal',
    title: "Target Identification & Decoding from Analogue Thermal Imager Feeds",
    excerpt: "Exploring the computer vision models and digital signal decoding techniques sponsored by Heavy Industries Taxila (HIT) for automatic target tracking.",
    date: "June 18, 2026",
    readTime: "8 min read",
    tags: ["Computer Vision", "Defense Projects", "Signal Decoding", "ML"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    content: `## 1. Introduction & Background

In defense and tactical surveillance, analog imager feeds are still prevalent due to their low latency and legacy integration. However, automated tracking requires translating these raw analogue signal streams into digital buffers suitable for convolution neural network (CNN) feature extraction. 

Our graduation project, sponsored by **Heavy Industries Taxila (HIT)** and recognized with the **Best FYP Award (PKR 10,000 Cash Prize)** at UET Mardan's 2022 Open House, addressed this challenge by building an edge decoding interface capable of real-time target identification.

---

## 2. Deciphering the Analog Stream

The first phase involves digitizing the NTSC/PAL composite signal. Analog signals are characterized by vertical and horizontal synchronization pulses (V-SYNC and H-SYNC). We utilized high-speed analog-to-digital converters (ADCs) to extract the active video lines. 

Once pixel streams are digitized, spatial noise filter matrices are applied to suppress atmospheric distortion typical in thermal cameras. We implemented a localized Gaussian smoothing kernel on a field-programmable gate array (FPGA) logic block, achieving ultra-low latency before passing the frame to the deep learning host.

---

## 3. Deep Learning Architecture for Target Identification

A customized, lightweight object detector based on a modified **MobileNet-YOLOv4** architecture was trained to identify military vessels, armored personnel carriers (APCs), and personnel:

- **Backbone Optimization:** Standard YOLO backbones were too heavy for low-wattage edge processors. By leveraging depthwise separable convolutions, we decreased parameter count by **75%** while retaining **91.8% mAP (Mean Average Precision)**.
- **Thermal Invariance:** Thermal signatures vary drastically based on ambient temperature and engine heat. We addressed this using intensive transfer learning, augmenting training sets with synthetic cold/hot contrast variations.

---

## 4. Key Takeaways & Impact

The resulting software demonstrated real-time automatic detection at **30 frames per second** with a high noise tolerance. This research underscores the potential of repurposing existing legacy hardware with modern edge AI processors, protecting investments while drastically elevating active battlefield awareness.`
  },
  {
    id: 'blog-lab-infra',
    title: "Administering 4 Enterprise-Scale Computer Labs with 120+ Active Workstations",
    excerpt: "A deep dive into network traffic segmentation, edge firewall defense, and automated deployment scripts implemented at Fazl-e-Haq College, Mardan.",
    date: "April 12, 2026",
    readTime: "6 min read",
    tags: ["Networking", "Lab Administration", "Cybersecurity", "IT Operations"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    content: `## 1. The Challenge of Scale

Serving as a Computer Science Lecturer at **Fazl-e-Haq College, Mardan** involves more than instructing curriculum. I manage the administration of four highly utilized, advanced computer networking and systems labs housing over **120 high-performance workstations**.

With dozens of students running high-bandwidth compilation tasks, network programming scripts, and general web traffic concurrently, the network infrastructure was prone to collision cascades and latency spikes.

---

## 2. Architectural Redesign: Layer-3 VLAN Segmentation

To resolve packet collision, we implemented strict physical and virtual segmentation:

- **Virtual Local Area Networks (VLANs):** The labs were split into 4 distinct VLAN segments (VLAN-10 for Lab A to VLAN-40 for Lab D). This contained broadcast domains and improved security.
- **Inter-VLAN Routing Restriction:** Access between labs was restricted using strict Access Control Lists (ACLs) executed at the core switch layer. This prevented malware traversal across the entire college intranet.

---

## 3. Edge Router Anomaly Detection

As a cyber-security enthusiast, I introduced automated traffic inspection on our edge gateway. Using a customized Python script querying the gateway API:

1. **Traffic Benchmarking:** We mapped standard hourly traffic margins for normal school hours.
2. **Anomaly Triggers:** If any host workstation triggers high outbound connections (indicative of port scans, cryptomining, or local DDoS loops), the edge script flags the internal IP and dynamically updates firewall rules to quarantine the node.

---

## 4. Operational Results

Following the deployment of VLAN segmentation and automated anomaly quarantine, network downtime plummeted by **88%** over three semesters. Student compilation environments load faster, and lab security is maintained at industry-level standards.`
  },
  {
    id: 'blog-bise-data',
    title: "The Mechanics of Public Exam Administration and Large-Scale Data Security",
    excerpt: "Analyzing the operational safeguards, result processing, and data encryption strategies deployed while serving as Assistant Controller at BISE Mardan.",
    date: "January 25, 2026",
    readTime: "5 min read",
    tags: ["Data Security", "Public Service", "Operations", "Databases"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    content: `## 1. A High-Stakes Public Responsibility

Serving as the **Assistant Controller of Examinations** at the Board of Intermediate and Secondary Education (BISE) Mardan places me at the center of high-stakes public data management. Every year, our systems process and manage examinations for tens of thousands of students across the region. 

The integrity of this process is paramount. Any database leak or scheduling inconsistency can have severe social and institutional repercussions.

---

## 2. Safeguarding the Exam Pipeline

The exam pipeline consists of three critical phases: Paper Compilation, Secure Transport, and Digital Result Grading. Here is how we enforce operational security:

- **Metadata Encryption:** Student identities are anonymized during evaluation using a random hashing sequence, matching the physical exam sheets to digital records only after grading completes. This eliminates bias and leak risks.
- **Dual-Control Auditing:** Changes to result databases require a dual-key cryptographic authorization signature from two verified administrators, recorded permanently in our access ledger.

---

## 3. Conclusion

Public service operations require the integration of technical security principles with strict logistical discipline. By applying modern database safeguards and strict access controls, BISE Mardan successfully delivers unbiased and secure results for the future youth of Pakistan.`
  }
];

export default function BlogView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activePost, setActivePost] = useState<BlogItem | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(BLOG_POSTS.flatMap(post => post.tags))
  );

  // Filter posts based on search term and selected tag
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#1C1B19] py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="border-b border-[#1C1B19]/10 pb-8 mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2.5 mb-2">
            <span className="p-1.5 bg-[#1C1B19] text-[#FCFBF7] rounded-md">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#1C1B19]/60">
              Technical Journal & Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#1C1B19]">
            Engineer's Blog
          </h1>
          <p className="mt-2 text-sm text-[#1C1B19]/70 font-sans max-w-xl leading-relaxed">
            Technical write-ups, engineering logs, and reflections on computer networks, signal decoding, and public service databases by Tehleel Basit.
          </p>
        </div>

        {/* Back navigation if reading a post */}
        {activePost ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <button
              onClick={() => setActivePost(null)}
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1C1B19] hover:text-[#1C1B19]/70 cursor-pointer border border-[#1C1B19]/10 px-3 py-2 bg-white rounded-md shadow-2xs transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </button>

            {/* Main Article Container */}
            <article className="bg-white border border-[#1C1B19]/15 rounded-2xl overflow-hidden shadow-sm max-w-4xl mx-auto">
              <div className="relative h-64 sm:h-96 w-full">
                <img 
                  src={activePost.image} 
                  alt={activePost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/80 via-[#1C1B19]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {activePost.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-amber-400 text-[#1C1B19] text-[9px] font-mono font-bold uppercase tracking-widest rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl sm:text-3xl font-serif font-bold tracking-tight text-white leading-tight">
                    {activePost.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#1C1B19]/60 border-b border-[#1C1B19]/10 pb-5">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1.5" />
                    By Tehleel Basit, R.E.
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    {activePost.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {activePost.readTime}
                  </span>
                </div>

                {/* Article Body Content */}
                <div className="prose max-w-none text-sm text-[#1C1B19]/80 leading-relaxed space-y-5 font-sans">
                  {activePost.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h3 key={index} className="text-lg font-serif font-bold text-[#1C1B19] pt-4 border-b border-[#1C1B19]/5 pb-1">
                          {paragraph.replace('## ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={index} className="list-disc pl-5 space-y-2 text-xs font-medium">
                          {paragraph.split('\n').map((li, i) => (
                            <li key={i}>{li.replace('- ', '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
                      return (
                        <ol key={index} className="list-decimal pl-5 space-y-2 text-xs font-medium">
                          {paragraph.split('\n').map((li, i) => (
                            <li key={i}>{li.replace(/^\d+\.\s+/, '')}</li>
                          ))}
                        </ol>
                      );
                    }
                    if (paragraph.startsWith('---')) {
                      return <hr key={index} className="border-[#1C1B19]/10 my-4" />;
                    }
                    return <p key={index}>{paragraph}</p>;
                  })}
                </div>
              </div>
            </article>

            {/* Back to top helper inside post */}
            <div className="text-center pt-6">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActivePost(null);
                }}
                className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase text-[#1C1B19]/60 hover:text-[#1C1B19]"
              >
                <span>Back to Articles</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Search and Filters panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-center">
              
              {/* Search Bar */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1C1B19]/40" />
                <input
                  type="text"
                  placeholder="Search articles or methodologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#1C1B19]/15 rounded-xl text-xs font-sans focus:outline-none focus:border-[#1C1B19]/40 focus:bg-[#FCFBF7] transition-colors"
                />
              </div>

              {/* Reset filter trigger */}
              <div className="flex justify-end">
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 border border-red-500/10 bg-red-50 text-red-800 text-[10px] font-mono font-bold uppercase rounded-md cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    <span>Clear filter: {selectedTag}</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Tag Cloud */}
            <div className="mb-10">
              <span className="block text-[10px] font-mono font-bold text-[#1C1B19]/50 uppercase tracking-widest mb-3">Filter by Topic:</span>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isSelected ? null : tag)}
                      className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-md transition-colors cursor-pointer border ${
                        isSelected 
                          ? 'bg-[#1C1B19] border-[#1C1B19] text-white' 
                          : 'bg-white border-[#1C1B19]/10 text-[#1C1B19]/70 hover:bg-[#F4F0E8] hover:text-[#1C1B19]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post list */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map(post => (
                  <motion.div
                    key={post.id}
                    layoutId={`post-container-${post.id}`}
                    onClick={() => {
                      setActivePost(post);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white border border-[#1C1B19]/15 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer group"
                  >
                    {/* Image Header */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/50 to-transparent opacity-60" />
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        {/* Meta tags */}
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-[#1C1B19]/50 mb-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-base font-serif font-bold text-[#1C1B19] group-hover:text-[#1C1B19]/80 transition-colors leading-tight mb-2">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-xs text-[#1C1B19]/70 font-sans leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-[#1C1B19]/5 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-[#FCFBF7] border border-[#1C1B19]/10 text-[#1C1B19]/60 text-[9px] font-mono rounded-sm">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1C1B19] inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                          <span>Read Log</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-[#1C1B19]/15 rounded-2xl bg-white">
                <p className="text-sm font-mono text-[#1C1B19]/60">No articles matched your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag(null);
                  }}
                  className="mt-4 px-4 py-2 bg-[#1C1B19] text-white text-xs font-mono font-bold uppercase rounded-md cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
