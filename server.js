require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors({
  origin: "https://collegepulse-72ac4.web.app",  // ✅ your deployed frontend
  methods: ["POST"],
  credentials: false
}));

app.use(express.json());

app.post("/summarize", async (req, res) => {
  const inputText = req.body.text;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: inputText
      })
    });

    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error });

    const summary = data[0]?.summary_text || "No summary available.";
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to summarize text." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
