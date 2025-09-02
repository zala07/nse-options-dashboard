import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

// For serving frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to fetch NSE Option Chain
app.get("/option-chain/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const url = `https://www.nseindia.com/api/option-chain-equities?symbol=${symbol}`;

    // Step 1: Get cookies from homepage
    const homepage = await fetch("https://www.nseindia.com", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const cookies = homepage.headers.get("set-cookie");

    // Step 2: Fetch option chain with cookies
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36",
        Accept: "application/json",
        Referer: "https://www.nseindia.com",
        Cookie: cookies
      }
    });

    if (!response.ok) {
      throw new Error(`NSE fetch failed: ${response.status}`);
    }

    const data = await response.json();
    res.json(data.records.data);
  } catch (err) {
    console.error("Error fetching NSE data:", err);
    res.status(500).json({ error: err.toString() });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

