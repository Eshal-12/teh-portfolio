import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mic, MicOff, Volume2, VolumeX, Send, Bot, User, Sparkles, AlertCircle 
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
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I am Tehleel's portfolio AI assistant. I support voice-to-voice interaction in both English and Urdu!\n\n🇵🇰 اردو میں بات کرنے کے لیے اوپر موجود بٹن سے اردو زبان (UR) منتخب کریں اور مائیک پر کلک کریں۔\n\n💡 Note: If you cannot speak or hear the AI, browsers often block microphone & audio access inside the embedded preview. Please click the \"Open in New Tab\" icon at the top-right of the preview window to enable full microphone permissions!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micPermissionError, setMicPermissionError] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const sendMessageRef = useRef<(text?: string) => void>(() => {});

  // Initialize Speech Recognition
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

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setMicPermissionError(true);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    } catch (e) {
      console.error("Failed to initialize speech recognition:", e);
      setSpeechSupported(false);
    }
  }, []);

  // Dynamically switch microphone listening language when state changes
  useEffect(() => {
    if (recognition) {
      recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';
    }
  }, [language, recognition]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Pre-load Speech Synthesis voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // Helper to unlock audio playback in restricted browser frames via a user-gesture trigger
  const unlockAudio = () => {
    if ('speechSynthesis' in window && isVoiceEnabled) {
      try {
        const u = new SpeechSynthesisUtterance("");
        u.volume = 0;
        window.speechSynthesis.speak(u);
      } catch (e) {
        console.warn("Could not pre-warm speech engine:", e);
      }
    }
  };

  // Handle speaking text output
  const speakText = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // On some browsers (e.g. Chrome), speechSynthesis gets stuck in a paused state.
      // Resuming explicitly here prevents any queued audio from being stuck silently.
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      
      // Clean up markdown syntax, parentheticals, and links for natural speaking
      const cleanedText = text
        .replace(/[*_`#]/g, '') // Remove bold/italic markdown
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text, remove URL
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      
      // Detect if text contains Urdu/Arabic characters
      const isUrduText = /[\u0600-\u06FF]/.test(cleanedText);
      
      if (isUrduText) {
        utterance.lang = 'ur-PK';
      } else {
        utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      }
      
      const voices = window.speechSynthesis.getVoices();
      let preferredVoice;
      
      if (utterance.lang.startsWith('ur') || isUrduText) {
        // Prioritize premium/Google Hindi or Urdu voices first for the most natural Hindustani/Urdu accent
        preferredVoice = voices.find(v => 
          (v.lang.startsWith('ur') || v.lang.startsWith('hi')) && 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Siri') || v.name.includes('Premium'))
        );
        if (!preferredVoice) {
          preferredVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('hi'));
        }
      } else {
        // Choose a nice natural-sounding English voice if available
        preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Siri') || v.name.includes('Premium'))
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        // Match the language parameter exactly with the chosen voice to prevent pronunciation synthesis errors
        utterance.lang = preferredVoice.lang;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Utterance error event:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis failed:", err);
      setIsSpeaking(false);
    }
  };

  // Toggle or start mic listening
  const toggleListening = () => {
    // Unlock speech synthesis in response to user gesture
    unlockAudio();

    if (!speechSupported) {
      alert("Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        // Cancel speaking to avoid feeding synthesized voice back to microphone
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  // Send message to Express API
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Pre-warm the SpeechSynthesis system on user click/interaction
    unlockAudio();

    if (!textToSend) {
      setInputText('');
    }

    // Add user message
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
        throw new Error("Failed to get response from AI assistant");
      }

      const data = await response.json();
      const reply = data.reply || "I couldn't generate a response. Please try again.";

      // Add assistant message
      setMessages(prev => [...prev, { sender: 'assistant', text: reply, timestamp: new Date() }]);
      setIsLoading(false);

      // Play back response via TTS
      speakText(reply);
    } catch (error) {
      console.error("Error communicating with AI assistant:", error);
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: "I encountered an error connecting to the server. Please check your connection and verify that your server is running with a valid GEMINI_API_KEY.",
        timestamp: new Date() 
      }]);
      setIsLoading(false);
    }
  };

  // Keep ref updated to handleSendMessage with latest closures
  sendMessageRef.current = handleSendMessage;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Clean speech synthesis on close
  const handleClose = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (isListening && recognition) {
      recognition.stop();
    }
    onClose();
  };

  // Suggestions for visitor clicks
  const suggestions = [
    { text: "Who is Tehleel Basit?", label: "Background" },
    { text: "What is his Heavy Industries Taxila project?", label: "HIT Defense Project" },
    { text: "Where does Tehleel teach?", label: "Academic Lectureship" },
    { text: "How do I contact Tehleel?", label: "Contact Info" }
  ];

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
        {/* Header (Solid Black with high visibility) */}
        <div className="bg-[#1C1B19] text-white p-4 flex items-center justify-between border-b border-[#1C1B19]/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#FCFBF7]/10 rounded-lg text-white">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold tracking-tight">Portfolio AI Assistant</h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isSpeaking ? 'bg-amber-400 animate-ping' : isListening ? 'bg-emerald-500 animate-ping' : 'bg-[#FCFBF7]/40'}`} />
                <span className="text-[10px] font-mono text-[#FCFBF7]/60 tracking-wider uppercase font-semibold">
                  {isSpeaking ? 'Speaking Output' : isListening ? 'Listening Mic...' : language === 'ur' ? 'Urdu Mode (اردو)' : 'English Mode (EN)'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Switcher button */}
            <button
              onClick={() => {
                const nextLang = language === 'en' ? 'ur' : 'en';
                setLanguage(nextLang);
                if (recognition) {
                  recognition.lang = nextLang === 'ur' ? 'ur-PK' : 'en-US';
                }
              }}
              className="px-2 py-1 text-[10px] font-mono font-bold uppercase rounded bg-[#FCFBF7]/10 hover:bg-[#FCFBF7]/20 text-[#FCFBF7] transition-all cursor-pointer flex items-center space-x-1"
              title="Toggle Speak/Listen Language: English / Urdu"
            >
              <span>{language === 'en' ? '🇬🇧 EN' : '🇵🇰 UR'}</span>
            </button>

            {/* Voice enable/disable toggle */}
            <button
              onClick={() => {
                if (isVoiceEnabled) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className="p-1.5 rounded-md hover:bg-[#FCFBF7]/15 text-[#FCFBF7]/80 hover:text-white transition-colors cursor-pointer"
              title={isVoiceEnabled ? "Mute audio response" : "Unmute audio response"}
            >
              {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-red-400" />}
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

        {/* Message Log */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#FCFBF7] text-[#1C1B19]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`p-1.5 rounded-lg border text-xs shrink-0 ${msg.sender === 'user' ? 'bg-[#1C1B19] text-white border-[#1C1B19]' : 'bg-[#EAE6DF] text-[#1C1B19] border-[#1C1B19]/10'}`}>
                  {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                {/* Bubble */}
                <div className={`p-3 rounded-xl text-xs font-sans shadow-xs border ${msg.sender === 'user' ? 'bg-[#1C1B19] text-white border-[#1C1B19]' : 'bg-white text-[#1C1B19] border-[#1C1B19]/10'}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className={`block text-[9px] font-mono mt-1.5 uppercase font-medium text-right ${msg.sender === 'user' ? 'text-white/60' : 'text-[#1C1B19]/40'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-[#EAE6DF] border border-[#1C1B19]/10 text-[#1C1B19]">
                  <Bot className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="bg-white border border-[#1C1B19]/10 p-3 rounded-xl flex items-center space-x-1.5 shadow-xs">
                  <span className="h-1.5 w-1.5 bg-[#1C1B19]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 bg-[#1C1B19]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 bg-[#1C1B19]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Soundwave Visualizer when Speaking or Listening */}
          <AnimatePresence>
            {(isSpeaking || isListening) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`p-3 border rounded-xl flex items-center justify-between shadow-xs ${isListening ? 'bg-emerald-50/50 border-emerald-500/20 text-emerald-800' : 'bg-amber-50/50 border-amber-500/20 text-amber-800'}`}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className={`h-4 w-4 ${isListening ? 'text-emerald-600 animate-pulse' : 'text-amber-600 animate-spin'}`} />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                    {isListening ? 'Listening via Microphone' : 'Speaking response...'}
                  </span>
                </div>
                {/* Visualizer bars */}
                <div className="flex items-end space-x-0.5 h-4 px-1">
                  {[1, 2, 3, 4, 5, 6].map((bar) => (
                    <span 
                      key={bar} 
                      className={`w-0.5 rounded-full ${isListening ? 'bg-emerald-500' : 'bg-amber-500'} animate-[bounce_1s_infinite]`}
                      style={{ 
                        animationDelay: `${bar * 120}ms`,
                        height: `${Math.random() * 100}%`
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {micPermissionError && (
            <div className="p-3 border border-red-500/10 bg-red-50/50 text-red-800 rounded-xl flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <div className="text-[11px] font-sans font-medium">
                <strong>Microphone Permission Error:</strong> Please enable microphone access in your browser settings to use voice input features.
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 border-t border-[#1C1B19]/10 bg-white">
          <p className="text-[10px] font-mono text-[#1C1B19]/50 uppercase tracking-widest font-bold mb-1.5 sm:mb-2 px-1">Frequently Asked Guides</p>
          <div className="flex sm:flex-wrap gap-1.5 overflow-x-auto sm:overflow-x-visible pb-1 sm:pb-0 scrollbar-none px-1">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (sug.label === "Contact Info") {
                    handleClose();
                    onNavigateContact();
                  } else {
                    handleSendMessage(sug.text);
                  }
                }}
                className="px-2.5 py-1.5 border border-[#1C1B19]/10 hover:border-[#1C1B19]/35 bg-[#FCFBF7] hover:bg-[#F4F0E8] text-[10px] font-sans font-semibold text-[#1C1B19]/80 rounded-md transition-colors text-left cursor-pointer shadow-2xs shrink-0 whitespace-nowrap sm:whitespace-normal"
              >
                {sug.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar (Solid high contrast controls) */}
        <div className="p-4 bg-white border-t border-[#1C1B19]/10 flex items-center space-x-2 pb-5 sm:pb-4">
          {speechSupported && (
            <button
              onClick={toggleListening}
              className={`p-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer border ${isListening ? 'bg-red-500 border-red-600 text-white animate-pulse' : 'bg-[#1C1B19] border-[#1C1B19] text-white hover:bg-neutral-800'}`}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isListening ? "Listening... speak now" : "Type your inquiry..."}
            disabled={isListening}
            className="flex-grow px-4 py-3 border border-[#1C1B19]/15 rounded-full text-base sm:text-xs font-sans focus:outline-none focus:border-[#1C1B19]/45 focus:bg-[#FCFBF7] disabled:opacity-50 transition-colors bg-white text-[#1C1B19]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isListening}
            className="p-3.5 bg-[#1C1B19] hover:bg-neutral-800 disabled:opacity-40 text-white rounded-full transition-all flex items-center justify-center cursor-pointer"
            title="Send inquiry"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
