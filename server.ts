import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser with support for high-res images
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Dedicated endpoint for persisting user uploaded images
  app.post("/api/upload-image", (req, res) => {
    try {
      const { image, target } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const fileName = `${target || "avatar"}_user.jpg`;
      const publicFilePath = path.join(publicDir, fileName);
      fs.writeFileSync(publicFilePath, buffer);

      // Also save to src/assets/images if directory exists
      const assetsDir = path.join(process.cwd(), "src", "assets", "images");
      if (fs.existsSync(assetsDir)) {
        fs.writeFileSync(path.join(assetsDir, fileName), buffer);
      }

      // Also copy to dist if dist exists
      const distDir = path.join(process.cwd(), "dist");
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, fileName), buffer);
      }

      console.log(`Successfully stored image ${fileName} (${buffer.length} bytes)`);
      return res.json({ success: true, url: `/${fileName}?t=${Date.now()}` });
    } catch (err: any) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: err.message });
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
    app.get('*', (_req, res) => {
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
