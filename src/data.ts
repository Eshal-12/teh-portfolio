import { 
  EducationItem, 
  ExperienceItem, 
  AchievementItem, 
  ProjectItem, 
  PublicationItem, 
  SkillItem, 
  CertificationItem,
  GalleryItem
} from './types';

import avatarImg from './assets/images/profile_avatar_1784096191467.jpg';
import convocationImg from './assets/images/bs_convocation_1784096209998.jpg';
import laptopImg from './assets/images/laptop_award_1784096225279.jpg';
import thermalImg from './assets/images/thermal_project_1784096244618.jpg';
import chequeImg from './assets/images/winner_cheque_1784096261028.jpg';

export const personalInfo = {
  name: 'Tehleel Basit',
  title: 'Telecommunication Engineer · Lecturer · Data & Network Analyst',
  subTitle: 'MS in Telecommunication Engineering, specializing in AI-driven anomaly detection.',
  phone: '+92 346 3279987',
  whatsapp: '923463279987',
  whatsappFormatted: '+92 346 3279987',
  email: 'tehleelbasit78@gmail.com',
  alternateEmail: 'tehleelbasit87@gmail.com',
  location: 'Mardan, Khyber Pakhtunkhwa (KPK), Pakistan',
  github: '#', // placeholder if needed
  linkedin: 'https://www.linkedin.com/in/tehleel-basit-50bb66216?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  profileText: 'Telecommunication Engineer with a strong academic record and hands-on experience in networking, telecom operations, simulation tools, and technical reporting. Skilled in data analysis, problem-solving, teaching, and academic/examination administration, with a research focus on AI-driven anomaly detection in telecom traffic. Seeking to apply strong analytical, technical, and coordination skills in a data-driven or telecom engineering role.',
  avatar: 'https://lh3.googleusercontent.com/d/1ZtZK-04oNOOu5wni3YfEX09VVjGSRbWK'
};

export const educationList: EducationItem[] = [
  {
    id: 'edu-ms',
    degree: 'MS, Telecommunication Engineering',
    institution: 'University of Engineering & Technology (UET), Mardan (HEC, PEC Approved)',
    years: '2022 – 2026',
    result: 'CGPA: 4.00 / 4.00'
  },
  {
    id: 'edu-bs',
    degree: 'BS, Telecommunication Engineering',
    institution: 'University of Engineering & Technology (UET), Mardan (HEC, PEC Approved)',
    years: '2018 – 2022',
    result: 'CGPA: 3.51 / 4.00'
  },
  {
    id: 'edu-bed',
    degree: 'B.Ed (1.5 Years), Education',
    institution: 'Abdul Wali Khan University, Mardan (AWKUM)',
    years: '2025 – 2026',
    result: 'CGPA: 3.62 / 4.00'
  },
  {
    id: 'edu-inter',
    degree: 'Intermediate, Pre-Engineering',
    institution: 'The Peace Group of Schools and Colleges, Mardan',
    years: '2016 – 2018',
    result: 'Marks: 826 / 1100'
  },
  {
    id: 'edu-matric',
    degree: 'Matriculation, Science',
    institution: 'FG Public High School, Mardan Cantt',
    years: '2014 – 2016',
    result: 'Marks: 941 / 1050'
  }
];

export const experienceList: ExperienceItem[] = [
  {
    id: 'exp-bise',
    role: 'Assistant Controller of Examination',
    organization: 'Board of Intermediate and Secondary Education, Mardan (BISE Mardan)',
    location: 'Mardan, Pakistan',
    dateRange: 'MAR 2023 — PRESENT',
    highlights: [
      'Ensure smooth coordination of secondary and intermediate examinations across the Mardan division.',
      'Supervise the administrative processes for examinations, results compiling, and academic documentation.',
      'Liaise with educational institutes, examiners, and board staff to enforce academic guidelines and security standards.'
    ]
  },
  {
    id: 'exp-fhc-exam',
    role: 'Examination Incharge',
    organization: 'The Fazl-e-Haq College, Mardan',
    location: 'Mardan, Pakistan',
    dateRange: 'OCT 2022 — PRESENT',
    highlights: [
      'Coordinate and oversee end-to-end examination processes for college-level students.',
      'Manage and maintain highly organized academic documentation, records, and student assessment sheets.',
      'Standardize grade reports and coordinate with academic heads to improve institutional evaluation models.'
    ]
  },
  {
    id: 'exp-fhc-lecturer',
    role: 'Lecturer, Computer Science',
    organization: 'The Fazl-e-Haq College, Mardan',
    location: 'Mardan, Pakistan',
    dateRange: 'OCT 2022 — PRESENT',
    highlights: [
      'Teach Computer Science and IT fundamentals, cultivating analytical thinking and problem-solving skills in young minds.',
      'Manage 4 computer labs (each equipped with 30+ desktop systems), taking charge of basic LAN setups, device deployment, and hardware/software troubleshooting.',
      'Assemble, configure, and maintain computer systems, network switches, cabling, and router equipment to guarantee zero downtime during classes.',
      'Prepare assessments, technical reports, and comprehensive academic performance analyses.'
    ]
  },
  {
    id: 'exp-ptcl',
    role: 'Telecommunication Engineering Intern',
    organization: 'Pakistan Telecommunication Company Limited (PTCL)',
    location: 'Mardan, Pakistan',
    dateRange: 'AUG 2021 — OCT 2021',
    highlights: [
      'Acquired key hands-on experience in transport networking, switching architectures, and GPON/Fiber-to-the-Home operations.',
      'Assisted network engineers in proactive monitoring, troubleshooting fiber faults, and performing basic optical power level measurements.',
      'Gained deep familiarity with core telecommunication carrier systems and large-scale IP networks.'
    ]
  }
];

export const achievementList: AchievementItem[] = [
  {
    id: 'ach-dean',
    title: "Dean's List Top Graduate",
    description: "Honored on the University Dean's List for exceptional academic performance during the BS Telecommunication Engineering program at UET Mardan.",
    image: 'https://lh3.googleusercontent.com/d/1P1BL4lS3obrBMhmy3oMwXhPtfycs5mbq'
  },
  {
    id: 'ach-pmy',
    title: "Prime Minister's Youth Award",
    description: "Awarded a high-performance laptop and certificate under the Prime Minister's Youth Programme in recognition of academic excellence.",
    image: 'https://lh3.googleusercontent.com/d/1a8hHX7PgiTzBhU5Vgfm_fO6CfwbQ1O2v'
  },
  {
    id: 'ach-open-winner',
    title: "Best FYP Award & Cheque",
    description: "Awarded the Best BS Final Year Project at UET Mardan's Open House Exhibition (2022) with a PKR 10,000 winner's cash prize for the thermal-imaging system.",
    image: 'https://lh3.googleusercontent.com/d/1iJuFcYDEpFCVdg-keu2t-z5BkxEYoJp_'
  },
  {
    id: 'ach-pec',
    title: "PEC Registered Engineer (R.E.)",
    description: "Officially registered and certified as a Registered Engineer (R.E.) by the Pakistan Engineering Council (PEC), authorizing professional engineering practice in Telecommunication Engineering and validating alignment with national engineering standards.",
    image: 'https://lh3.googleusercontent.com/d/1VuPMwnivTpO2TGRT_oSa8jwkHSYqhv5c'
  }
];

export const projectsList: ProjectItem[] = [
  {
    id: 'proj-ms',
    title: 'AI-Driven Anomaly Detection for Cybersecurity in Telecommunication Traffic',
    sponsor: 'UET Mardan · MS Thesis',
    description: 'Developed an advanced framework applying Machine Learning/Deep Learning to identify and mitigate cyber threats, intrusions, and traffic anomalies in telecommunication networks.',
    image: 'https://lh3.googleusercontent.com/d/1mNMndl8vgHF3FAAhWpak68UtYX3ep4hG', // real portrait as representing researcher
    year: '2022 – 2026',
    type: 'ms',
    highlights: [
      'Constructed a model using hybrid feature extraction to identify malicious traffic anomalies with state-of-the-art precision.',
      'Leveraged advanced data analysis techniques on large network datasets (like UNSW-NB15/CICIDS) to model telecom carrier threat profiles.',
      'Designed lightweight deployment models suited for live edge gateways in core networks.'
    ]
  },
  {
    id: 'proj-bs',
    title: 'Automatic Target Detection & Identification from Analogue Thermal Imager Feed',
    sponsor: 'Heavy Industries Taxila (HIT) Sponsored · BS Final Year Project',
    description: 'Designed and built an automated intelligence computer vision system that interprets analogue feeds from combat thermal cameras to detect and categorize military vehicles/personnel.',
    image: 'https://lh3.googleusercontent.com/d/1O20rzEy1piLJwxyyPC2FvKA5dUIiytu6',
    year: '2021 — 2022',
    type: 'bs',
    highlights: [
      'Successfully installed and demonstrated on active armored fighting vehicles at Heavy Industries Taxila.',
      'Engineered an analog-to-digital signal decoding system that processes video streams with ultra-low latency.',
      'Developed robust object detection models tailored for poor visibility, dust storms, and night operations.'
    ]
  }
];

export const galleryList: GalleryItem[] = [
  {
    id: 'gal-pmy',
    title: 'Prime Minister’s Laptop Award Ceremony',
    category: 'awards',
    description: 'Tehleel Basit receiving a high-performance computer from government dignitaries under the Prime Minister’s Youth Programme in recognition of outstanding academic merits.',
    image: 'https://lh3.googleusercontent.com/d/1a8hHX7PgiTzBhU5Vgfm_fO6CfwbQ1O2v',
    date: '2023',
    location: 'Mardan, KPK'
  },
  {
    id: 'gal-convocation',
    title: 'UET Mardan Academic Convocation',
    category: 'academic',
    description: 'Tehleel Basit at the BS Telecommunication Engineering convocation and leadership investiture ceremony, celebrating top academic achievements with peer student commanders.',
    image: 'https://lh3.googleusercontent.com/d/1mNMndl8vgHF3FAAhWpak68UtYX3ep4hG',
    date: '2022',
    location: 'UET Mardan campus'
  },
  {
    id: 'gal-cheque',
    title: 'UET Mardan Exhibition First Prize',
    category: 'awards',
    description: 'Receiving the official PKR 10,000 cash prize cheque and best hardware project award for the Heavy Industries Taxila sponsored thermal image target detection platform.',
    image: 'https://lh3.googleusercontent.com/d/1iJuFcYDEpFCVdg-keu2t-z5BkxEYoJp_',
    date: '2022',
    location: 'Open House Exhibition'
  },
  {
    id: 'gal-fyp',
    title: 'Combat Vehicle Automation System Demonstration',
    category: 'research',
    description: 'Tehleel and the design team presenting the Automatic Target Detection hardware models and combat terrain simulations built for Heavy Industries Taxila.',
    image: 'https://lh3.googleusercontent.com/d/1O20rzEy1piLJwxyyPC2FvKA5dUIiytu6',
    date: '2022',
    location: 'HIT Sponsored Laboratory'
  }
];

export const publicationsList: PublicationItem[] = [
  {
    id: 'pub-1',
    title: 'A Hybrid CNN-LSTM Deep Learning Model for Network Intrusion Detection and Multiclass Cyberattack Classification',
    type: 'JOURNAL PUBLICATION',
    conference: 'International Journal of Advanced Research, Volume 3, Issue 2 (May 2026)',
    location: 'Pakistan',
    year: '2026'
  },
  {
    id: 'pub-2',
    title: 'Mobile Computing for Enhanced Connectivity and Intelligence in the Internet of Things',
    type: 'RESEARCH PUBLICATION',
    conference: 'Research Consortium Archive, Vol. 4, No. 2 (2026)',
    location: 'Online / International',
    year: '2026'
  },
  {
    id: 'pub-3',
    title: 'A Framework with Hybrid Feature Selection for AI-Driven Anomaly Detection in Telecommunication Network Traffic',
    type: 'CONFERENCE PRESENTATION',
    conference: '7th International Conference on Scientific and Innovative Studies (ICSIS 2026)',
    location: 'Konya, Turkey',
    year: '2026'
  },
  {
    id: 'pub-4',
    title: 'Federated Learning Based Predictive Traffic Management with Privacy-Preserving Access Control for Autonomous Vehicles',
    type: 'CONFERENCE PRESENTATION',
    conference: '7th International Conference on Scientific and Innovative Studies (ICSIS 2026)',
    location: 'Konya, Turkey',
    year: '2026'
  }
];

export const skillsList: SkillItem[] = [
  {
    id: 'sk-data',
    name: 'Data & Technical Analysis',
    category: 'analysis',
    rating: 90,
    details: 'Problem identification, root-cause investigation, dataset analysis, and thorough technical reporting.'
  },
  {
    id: 'sk-net',
    name: 'Telecom & Networking',
    category: 'telecom',
    rating: 88,
    details: 'Transport networks, switching fabrics, GPON, FTTH, optical testing, and continuous network traffic monitoring.'
  },
  {
    id: 'sk-matlab',
    name: 'MATLAB & Simulink',
    category: 'software',
    rating: 85,
    details: 'Signal processing algorithms, system simulations, filter design, and math modeling.'
  },
  {
    id: 'sk-ads',
    name: 'ADS & Multisim',
    category: 'software',
    rating: 80,
    details: 'RF circuit simulations, Advanced Design System (ADS) setups, PCB level signal routing validation.'
  },
  {
    id: 'sk-doc',
    name: 'Technical Writing & Office Tools',
    category: 'soft',
    rating: 95,
    details: 'Drafting high-quality research papers, administrative reports, curriculum plans, and presentations.'
  },
  {
    id: 'sk-coord',
    name: 'Coordination & Administration',
    category: 'soft',
    rating: 92,
    details: 'Coordinating high-stakes exams for BISE Mardan, managing multi-member teams, and public speaking.'
  }
];

export const certificationsList: CertificationItem[] = [
  { id: 'cert-1', name: 'AutoCAD (Computer-Aided Design)' },
  { id: 'cert-2', name: 'Digital Literacy Certification' },
  { id: 'cert-3', name: 'Creative Writing Certificate' },
  { id: 'cert-4', name: 'Classroom Management & Pedagogy' }
];

export const languages = [
  { name: 'English', level: 'Professional Fluency (Full professional proficiency in speaking, writing & reading)' },
  { name: 'Urdu', level: 'National Language (Full fluency, bilingual proficiency)' },
  { name: 'Pushto', level: 'Native Tongue (Mother tongue, full command)' }
];

export const interests = [
  'Generative AI & Network Security Research',
  'Art, Digital Painting & Visual Design',
  'Interstate Travel & Exploring Cultural Heritages',
  'Sports (Badminton, Cricket)',
  'Anchoring, Public Speaking, and Event Hosting'
];
