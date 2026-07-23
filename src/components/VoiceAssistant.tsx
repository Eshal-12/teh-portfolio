import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mic, MicOff, Volume2, VolumeX, Send, Bot, Sparkles, AlertCircle, 
  Play, Square, Languages, Keyboard, MessageSquare, RefreshCw 
} from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateContact: () => void;
}

export default function VoiceAssistant({ isOpen, onClose, onNavigateContact }: VoiceAssistantProps) {
  // --- SESSION STATE ---
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [isAutoListen, setIsAutoListen] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(true);

  // --- VOICE ENGINE STATE ---
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Welcome to Tehleel's Portfolio Companion. Tap 'Start Conversation' below to initiate a natural, hands-free conversation. You can speak or type your questions at any moment!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micPermissionError, setMicPermissionError] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessageRef = useRef<(text?: string) => void>(() => {});
  
  // State synchronization refs for callbacks to prevent stale closures
  const isSessionActiveRef = useRef(isSessionActive);
  const isAutoListenRef = useRef(isAutoListen);
  const isSpeakingRef = useRef(isSpeaking);
  const isLoadingRef = useRef(isLoading);
  const languageRef = useRef(language);
  const showKeyboardRef = useRef(showKeyboard);
  const isListeningRef = useRef(isListening);
  const lastSpeechStartTimeRef = useRef<number>(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { isSessionActiveRef.current = isSessionActive; }, [isSessionActive]);
  useEffect(() => { isAutoListenRef.current = isAutoListen; }, [isAutoListen]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { showKeyboardRef.current = showKeyboard; }, [showKeyboard]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);

  // --- INITIALIZE SPEECH RECOGNITION ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'ur' ? 'ur-PK' : 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setMicPermissionError(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          sendMessageRef.current(transcript);
        }
      };

      // Stop speaking when user interrupts (Barge-in / Stop when I speak)
      rec.onspeechstart = () => {
        // Only interrupt if the assistant has been speaking for at least 1.2s to prevent echo self-interruption
        if (isSpeakingRef.current && Date.now() - lastSpeechStartTimeRef.current > 1200) {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          setIsSpeaking(false);
        }
      };

      rec.onsoundstart = () => {
        if (isSpeakingRef.current && Date.now() - lastSpeechStartTimeRef.current > 1200) {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          setIsSpeaking(false);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setMicPermissionError(true);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);

        // CONTINUOUS LISTENING RESTART LOOP:
        // Automatically start the microphone again if session is active, hands-free is enabled, and we aren't currently talking or waiting for API
        if (isSessionActiveRef.current && isAutoListenRef.current && !isSpeakingRef.current && !isLoadingRef.current && !showKeyboardRef.current) {
          setTimeout(() => {
            if (isSessionActiveRef.current && isAutoListenRef.current && !isSpeakingRef.current && !isLoadingRef.current && !showKeyboardRef.current && !isListeningRef.current) {
              try {
                recognitionRef.current?.start();
              } catch (e) {
                console.warn("Continuous microphone restart failed:", e);
              }
            }
          }, 300);
        }
      };

      setRecognition(rec);
      recognitionRef.current = rec;
    } catch (e) {
      console.error("Failed to initialize speech recognition:", e);
      setSpeechSupported(false);
    }
  }, []);

  // Sync language with speech recognition
  useEffect(() => {
    if (recognition) {
      recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';
    }
  }, [language, recognition]);

  // Auto-scroll the subtitle container
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Pre-load speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      setVoicesLoaded(true);
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
          setVoicesLoaded(true);
        };
      }
    }
  }, []);

  // --- MICROPHONE TRIGGERS ---
  const startListening = (preventCancel = false) => {
    if (!speechSupported || !recognition) return;
    
    // Cancel speaking first to prevent feedback, unless explicitly bypassed for barge-in listening
    if (!preventCancel && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      recognition.start();
    } catch (err) {
      // Already running or cycling
    }
  };

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (err) {
        console.error("Stop recognition failed:", err);
      }
    }
  };

  // --- AUDIO HARNESS AND VOICE SELECTION ---
  const unlockAudio = () => {
    if ('speechSynthesis' in window) {
      try {
        const u = new SpeechSynthesisUtterance("");
        u.volume = 0;
        window.speechSynthesis.speak(u);
      } catch (e) {
        console.warn("Could not pre-warm speech engine:", e);
      }
    }
  };

  const speakText = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) {
      // If voice output is muted, and Auto-Listen is enabled, trigger auto-listen immediately!
      if (isSessionActive && isAutoListen) {
        setTimeout(() => {
          if (!isSpeakingRef.current && !isLoading) {
            startListening();
          }
        }, 1000);
      }
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // Format text for natural pronunciation
      const cleanedText = text
        .replace(/[*_`#]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      const isUrduText = /[\u0600-\u06FF]/.test(cleanedText);
      utterance.lang = isUrduText ? 'ur-PK' : (language === 'ur' ? 'ur-PK' : 'en-US');

      const voices = window.speechSynthesis.getVoices();
      let preferredVoice;

      if (isUrduText || utterance.lang.startsWith('ur')) {
        // Broad search for Urdu or Hindi (Hindi pronunciations are identical and extremely high quality)
        preferredVoice = voices.find(v => 
          (v.lang.startsWith('ur') || v.lang.startsWith('hi')) && 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Siri') || v.name.includes('Premium'))
        );
        if (!preferredVoice) {
          preferredVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('hi'));
        }
      } else {
        // High quality English voice
        preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Siri') || v.name.includes('Premium'))
        );
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        lastSpeechStartTimeRef.current = Date.now();
        // Keep listening active or start listening to allow barge-in (interruption)!
        if (isSessionActiveRef.current && isAutoListenRef.current && !isListeningRef.current) {
          startListening(true); // Don't cancel speech synthesis on start
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        // Seamless Hands-Free Auto-Listen Trigger!
        if (isSessionActive && isAutoListen && !showKeyboard) {
          setTimeout(() => {
            if (!isSpeakingRef.current && !isLoading) {
              startListening();
            }
          }, 400); // 400ms pause for beautiful conversation cadence
        }
      };

      utterance.onerror = (e) => {
        console.error("Speech Synthesis error:", e);
        setIsSpeaking(false);
        if (isSessionActive && isAutoListen && !showKeyboard) {
          startListening();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech Synthesis failed:", err);
      setIsSpeaking(false);
    }
  };

  // --- API BACKEND CONNECTION ---
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    unlockAudio();
    setInputText('');

    // Stop microphone stream during thinking/API fetch
    stopListening();

    // Auto-detect input language to set matching Web Speech context
    const isUrduInput = /[\u0600-\u06FF]/.test(text);
    if (isUrduInput) {
      setLanguage('ur');
    } else if (text.match(/[A-Za-z]/)) {
      setLanguage('en');
    }

    const userMsg: Message = { sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error("API Connection failed");
      }

      const data = await response.json();
      const reply = data.reply || "I couldn't generate a response. Please try again.";

      // Auto-detect reply language to set correct Speech Synthesis voice
      const isUrduReply = /[\u0600-\u06FF]/.test(reply);
      if (isUrduReply) {
        setLanguage('ur');
      } else {
        setLanguage('en');
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: reply, timestamp: new Date() }]);
      setIsLoading(false);

      // Trigger response speech
      speakText(reply);
    } catch (error) {
      console.error("Error communicating with AI assistant:", error);
      const isUrduSession = language === 'ur' || isUrduInput;
      const errorMsg = isUrduSession
        ? "سرور سے رابطہ قائم کرنے میں مسئلہ درپیش ہے۔ براہ کرم اپنا انٹرنیٹ چیک کریں۔"
        : "I encountered a network or API issue. Please ensure your Gemini key is configured correctly.";
      
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: errorMsg,
        timestamp: new Date() 
      }]);
      setIsLoading(false);
    }
  };

  // Keep ref up to date to prevent closure stale states
  sendMessageRef.current = handleSendMessage;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // --- SESSION CONTROLS ---
  const startSession = () => {
    unlockAudio();
    setIsSessionActive(true);
    setMicPermissionError(false);

    const welcomeText = "Hello! I am Tehleel Basit's voice assistant. What would you like to know about Tehleel's engineering background, research projects, or teaching experience today?";

    setMessages([
      {
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date()
      }
    ]);

    // Speak welcome message immediately
    setTimeout(() => {
      speakText(welcomeText);
    }, 400);
  };

  const endSession = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    stopListening();
    setIsSessionActive(false);
  };

  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    stopListening();
    onClose();
  };

  // Get current active status text
  const getStatusString = () => {
    if (isLoading) {
      return language === 'ur' ? "جواب تیار ہو رہا ہے..." : "Thinking...";
    }
    if (isSpeaking) {
      return language === 'ur' ? "بول رہا ہے..." : "Speaking response...";
    }
    if (isListening) {
      return language === 'ur' ? "آپ کی بات سنی جا رہی ہے..." : "Listening...";
    }
    return language === 'ur' ? "رابطہ بحال (خاموش)" : "Connected (Idle)";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 md:p-8 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-[#1C1B19]/75 backdrop-blur-xs"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full sm:max-w-md bg-white border-t sm:border border-[#1C1B19]/25 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col h-[82vh] sm:h-[580px] max-h-[82vh] sm:max-h-[calc(100vh-64px)]"
      >
        {/* Header (Premium Charcoal) */}
        <div className="bg-[#1C1B19] text-white p-4 flex items-center justify-between border-b border-[#1C1B19]/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#FCFBF7]/10 rounded-lg text-white">
              <Bot className={`h-5 w-5 ${isListening || isSpeaking ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold tracking-tight">
                {isSessionActive ? (language === 'ur' ? 'وائس سیشن' : 'Voice Session') : (language === 'ur' ? 'ہم کلام اسسٹنٹ' : 'Voice Assistant')}
              </h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  isLoading ? 'bg-blue-400 animate-pulse' :
                  isSpeaking ? 'bg-amber-400 animate-ping' : 
                  isListening ? 'bg-emerald-500 animate-ping' : 'bg-[#FCFBF7]/40'
                }`} />
                <span className="text-[10px] font-mono text-[#FCFBF7]/60 tracking-wider uppercase font-semibold">
                  {getStatusString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1.5">
            {/* Silent language toggle with just an icon */}
            <button
              onClick={() => {
                const nextLang = language === 'en' ? 'ur' : 'en';
                setLanguage(nextLang);
              }}
              className="p-1.5 rounded-md hover:bg-[#FCFBF7]/15 text-[#FCFBF7]/80 hover:text-white transition-colors cursor-pointer"
              title="Toggle focus"
            >
              <Languages className="h-4 w-4" />
            </button>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md hover:bg-[#FCFBF7]/15 text-[#FCFBF7]/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Screen Area */}
        <div className="flex-grow flex flex-col bg-[#FCFBF7] overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSessionActive ? (
              // --- WELCOME & INTRO SCREEN ---
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-grow flex flex-col justify-between p-6 overflow-y-auto text-center"
              >
                <div className="my-auto space-y-6">
                  {/* Icon Frame */}
                  <div className="relative mx-auto w-20 h-20 flex items-center justify-center bg-[#1C1B19] text-[#FCFBF7] rounded-full shadow-lg">
                    <Bot className="h-10 w-10" />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-[#FCFBF7] h-5 w-5 rounded-full animate-pulse" />
                  </div>

                  {/* Header text */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-bold text-[#1C1B19]">
                      Tehleel's Voice Companion
                    </h3>
                    <p className="text-xs font-sans text-[#1C1B19]/75 max-w-sm mx-auto leading-relaxed">
                      Initiate a fluid, hands-free conversation. Perfect for recruiters and tech leads to query Tehleel's engineering background, research milestones, or CS pedagogy. Speak or type your questions naturally.
                    </p>
                  </div>

                  {/* Device Note */}
                  <div className="p-3 border border-[#1C1B19]/5 bg-white rounded-lg inline-flex items-center space-x-2 text-[10px] font-mono text-left max-w-xs text-[#1C1B19]/60 leading-normal">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>
                      Utilizes Web Speech engines. Best experienced in Chrome, Edge, or Safari.
                    </span>
                  </div>
                </div>

                {/* Big Tactile Start Button */}
                <button
                  onClick={startSession}
                  className="w-full py-4 bg-[#1C1B19] text-white rounded-xl font-sans font-bold text-sm tracking-wide hover:bg-[#2B2A27] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md mt-4 active:scale-[0.99]"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>
                    Start Conversation
                  </span>
                </button>
              </motion.div>
            ) : (
              // --- ACTIVE VOICE STREAM SCREEN ---
              <motion.div
                key="active-session"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex-grow flex flex-col justify-between p-4 overflow-hidden relative"
              >
                {/* Visualizer Canvas Area (Center Stage) */}
                <div className="flex-grow flex flex-col items-center justify-center min-h-[180px] max-h-[260px] relative">
                  {/* Interactive Waveform / Pulsing Ring Visualizer */}
                  <div className="relative flex items-center justify-center w-40 h-40">
                    {/* Ring 1 (Pulse) */}
                    <motion.div 
                      className={`absolute inset-0 rounded-full border-2 ${
                        isLoading ? 'border-blue-500/20' :
                        isSpeaking ? 'border-amber-500/30' : 
                        isListening ? 'border-emerald-500/35' : 'border-[#1C1B19]/10'
                      }`}
                      animate={
                        isLoading ? { scale: [1, 1.15, 1], rotate: 360 } :
                        isSpeaking ? { scale: [1, 1.35, 1] } :
                        isListening ? { scale: [1, 1.5, 1], opacity: [0.9, 0.2, 0.9] } :
                        { scale: [1, 1.05, 1] }
                      }
                      transition={{
                        duration: isListening ? 0.75 : isSpeaking ? 1.2 : isLoading ? 2.5 : 2.0,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Ring 2 (Pulse Delay) */}
                    <motion.div 
                      className={`absolute -inset-4 rounded-full border ${
                        isLoading ? 'border-blue-300/10' :
                        isSpeaking ? 'border-amber-400/20' : 
                        isListening ? 'border-emerald-400/25' : 'border-[#1C1B19]/5'
                      }`}
                      animate={
                        isLoading ? { scale: [1, 1.2, 1] } :
                        isSpeaking ? { scale: [1, 1.5, 1] } :
                        isListening ? { scale: [1, 1.8, 1], opacity: [0.7, 0.1, 0.7] } :
                        { scale: [1, 1.1, 1] }
                      }
                      transition={{
                        duration: isListening ? 0.75 : isSpeaking ? 1.2 : 2.0,
                        delay: 0.25,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Ring 3 (Pulse Active) */}
                    {isListening && (
                      <motion.div 
                        className="absolute -inset-8 rounded-full border border-emerald-300/15"
                        animate={{ scale: [1, 2.1, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{
                          duration: 0.75,
                          delay: 0.45,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}

                    {/* Central Glowing Orb Core */}
                    <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-500 z-10 ${
                      isLoading ? 'bg-blue-600 ring-4 ring-blue-100' :
                      isSpeaking ? 'bg-amber-500 ring-4 ring-amber-100' : 
                      isListening ? 'bg-emerald-500 ring-4 ring-emerald-100 animate-pulse' : 'bg-[#1C1B19] ring-4 ring-neutral-200'
                    }`}>
                      {isLoading ? (
                        <RefreshCw className="h-8 w-8 animate-spin" />
                      ) : isSpeaking ? (
                        <Volume2 className="h-8 w-8 animate-bounce" />
                      ) : isListening ? (
                        <Mic className="h-8 w-8" />
                      ) : (
                        <Bot className="h-8 w-8" />
                      )}
                      
                      <span className="text-[8px] font-mono uppercase tracking-widest font-extrabold mt-1.5 opacity-90">
                        {isLoading ? 'Thinking' : isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Idle'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitle / Live Transcript Overlay Panel */}
                <div className="flex-grow flex flex-col bg-white border border-[#1C1B19]/10 rounded-xl overflow-hidden shadow-2xs h-[110px] min-h-[90px] p-3 text-left">
                  <span className="text-[8px] font-mono text-[#1C1B19]/40 uppercase tracking-widest font-bold mb-1.5 block">
                    Real-Time Transcript Subtitles
                  </span>
                  
                  <div className="flex-grow overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                    {messages.length === 0 ? (
                      <div className="text-[11px] text-[#1C1B19]/40 font-serif italic">
                        Voice subtitles will appear here as you speak...
                      </div>
                    ) : (
                      messages.slice(-5).map((msg, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-wider ${
                            msg.sender === 'user' ? 'text-emerald-700' : 'text-slate-600'
                          }`}>
                            {msg.sender === 'user' ? 'You' : 'Assistant'}
                          </span>
                          <p className={`text-[11px] leading-relaxed font-sans ${
                            msg.sender === 'user' ? 'text-emerald-950 font-semibold' : 'text-neutral-800'
                          }`}>
                            {msg.text}
                          </p>
                        </div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex items-center space-x-1.5 text-[11px] text-blue-600 font-medium">
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="ml-1 font-mono text-[9px] uppercase tracking-wider">Formulating reply</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Keyboard Text Input Drawer (Permanently Visible) */}
                <div className="border border-[#1C1B19]/10 mt-2 bg-white rounded-lg overflow-hidden flex items-center space-x-1.5 p-1.5 shrink-0 shadow-2xs">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type message or ask anything..."
                    className="flex-grow px-3 py-1.5 border border-[#1C1B19]/5 rounded-md text-xs focus:outline-none focus:border-[#1C1B19]/45 text-[#1C1B19] bg-[#FCFBF7]/50"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim()}
                    className="p-1.5 bg-[#1C1B19] hover:bg-neutral-800 disabled:opacity-30 text-white rounded-md cursor-pointer transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Error Banner */}
                {micPermissionError && (
                  <div className="mt-2 p-2 border border-red-500/10 bg-red-50 text-red-800 rounded-lg flex items-start space-x-2 shrink-0">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-600" />
                    <div className="text-[10px] font-sans font-medium leading-normal">
                      <strong>Mic Access Blocked:</strong> Click the <strong>"Open in New Tab"</strong> icon at the top right of the preview frame to allow full browser microphone permissions.
                    </div>
                  </div>
                )}

                {/* Voice Session Control Dashboard */}
                <div className="mt-3 bg-white border border-[#1C1B19]/10 rounded-xl p-3 space-y-2.5 shrink-0 shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    {/* Auto listen switch */}
                    <button
                      onClick={() => setIsAutoListen(!isAutoListen)}
                      className="flex items-center space-x-1.5 cursor-pointer text-[#1C1B19]/70 hover:text-[#1C1B19]"
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${isAutoListen ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <span className="font-bold tracking-tight">
                        Hands-Free: {isAutoListen ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    {/* Voice sound switch */}
                    <button
                      onClick={() => {
                        if (isVoiceEnabled) {
                          window.speechSynthesis.cancel();
                          setIsSpeaking(false);
                        }
                        setIsVoiceEnabled(!isVoiceEnabled);
                      }}
                      className="flex items-center space-x-1.5 cursor-pointer text-[#1C1B19]/70 hover:text-[#1C1B19]"
                    >
                      {isVoiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-red-400" />}
                      <span className="font-bold tracking-tight">
                        Audio Out: {isVoiceEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>

                  {/* Core Mic Button & Stop Session Badge */}
                  <div className="flex items-center space-x-2 pt-1">
                    {/* Main Mic Button */}
                    <button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isLoading}
                      className={`flex-grow py-2.5 px-4 rounded-lg font-sans font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                          : 'bg-[#1C1B19] hover:bg-[#2B2A27] text-white disabled:opacity-50'
                      }`}
                    >
                      {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                      <span>
                        {isListening ? 'Stop Listening' : 'Tap to Talk'}
                      </span>
                    </button>

                    {/* End Session Button */}
                    <button
                      onClick={endSession}
                      className="px-3.5 py-2.5 border border-red-500/25 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-sans font-bold text-xs transition-colors cursor-pointer flex items-center justify-center"
                      title="End Conversation"
                    >
                      <Square className="h-3.5 w-3.5 fill-red-700" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
