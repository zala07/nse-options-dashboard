// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/option-chain/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const url = `https://www.nseindia.com/api/option-chain-equities?symbol=${symbol}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`NSE fetch failed: ${response.status}`);
    }

    const data = await response.json();
    res.json(data.records.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
