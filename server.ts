import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Mock Persistence
  const DATA_FILE = path.join(process.cwd(), "data.json");
  let data = { totalVisits: 0, reviews: [] };

  if (fs.existsSync(DATA_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading data file", e);
    }
  }

  const saveData = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  };

  app.get("/api/visit-count", (req, res) => {
    res.json({ count: data.totalVisits });
  });

  app.post("/api/increment-visit", (req, res) => {
    data.totalVisits++;
    saveData();
    res.json({ success: true, count: data.totalVisits });
  });

  app.post("/api/submit-review", async (req, res) => {
    const { stars, note } = req.body;
    const newReview = { stars, note, timestamp: new Date().toISOString() };
    data.reviews.push(newReview as never);
    saveData();
    
    console.log(`New Review: ${stars} stars, Note: ${note}`);
    
    res.json({ 
      success: true, 
      message: "تم استلام تقييمك بنجاح! شكراً لك.",
      debugInfo: "Email notification simulation: Sent to " + (process.env.OWNER_EMAIL || "owner")
    });
  });

  app.get("/api/reviews", (req, res) => {
    res.json(data.reviews);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
