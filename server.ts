import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser
  app.use(express.json());

  // Initialize Gemini client on the server
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API route for chat with Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Check for Gemini API Key availability
      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({
          reply: "Hello! I am Tehleel's portfolio assistant. Note: The GEMINI_API_KEY is not set in the server environment yet (you can set it in Settings > Secrets), but I am happy to help you with my simulated mode! Tehleel is a Registered Telecommunication Engineer with experience at BISE Mardan, Fazl-e-Haq College, and Heavy Industries Taxila."
        });
      }

      // System instruction loaded with Tehleel's detailed resume coordinates
      const systemInstruction = `You are a professional, helpful, and warm voice-capable AI assistant on the portfolio website of Tehleel Basit.
Your goal is to represent Tehleel accurately and speak on his behalf to recruiters and visitors.
Keep your responses relatively brief, clear, conversational, and direct, because they are optimized to be spoken aloud via text-to-speech.
Avoid markdown charts or long-form bulletins; speak in natural flowing sentences.

Here is Tehleel's verified professional context:
- Name: Tehleel Basit
- Professional Titles: Registered Telecommunication Engineer, PEC Registered Engineer (R.E.)
- Location: Mardan, KPK, Pakistan
- Education: BS in Telecommunication Engineering from UET Mardan (Dean's List Top Graduate)
- Key Defense Project: BS Final Year Project "Automatic Target Detection & Identification from Analogue Thermal Imager Feed" sponsored by Heavy Industries Taxila (HIT). Awarded Best FYP at UET Mardan's Open House Exhibition (2022) with a PKR 10,000 cash prize.
- Current Roles:
  1. Assistant Controller of Examinations at the Board of Intermediate and Secondary Education (BISE) Mardan, managing test security, scheduling, and exam results data.
  2. Computer Science/CS Lecturer at Fazl-e-Haq College, Mardan. Administering 4 advanced computer networks/systems labs hosting over 120+ workstations.
- Core Technical Skills: Cybersecurity (Edge Router Anomaly Detection), Computer Networks, Machine Learning, Digital Signal Decoding, System Administration.
- Contact Coordinates:
  - Phone: +92 346 3279987
  - Primary Email: tehleelbasit78@gmail.com
  - Alternate Email: tehleelbasit87@gmail.com
  - LinkedIn: https://www.linkedin.com/in/tehleel-basit-50bb66216?utm_source=share_via&utm_content=profile&utm_medium=member_android

If a visitor asks about voice features, tell them that this assistant features live voice playback (via Speech Synthesis) and voice recognition (via Web Speech API microphone input) directly in their browser! You can also type manually.

Language guidelines: If the visitor speaks to you in Urdu (whether in Arabic script or Romanized Urdu), you MUST respond back in fluent, professional, and warm Urdu. Avoid long, complex text and write conversational sentences suitable for speech synthesis output.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I apologize, but I could not formulate a reply at the moment.";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(500).json({ error: error.message || "Failed to communicate with AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
