import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ ALLOW your Firebase domain
app.use(cors({
  origin: "https://collegepulse-72ac4.web.app"
}));

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/summarize", async (req, res) => {
  const { text } = req.body;
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes short college announcements." },
        { role: "user", content: `Summarize this update: ${text}` }
      ],
    });

    const summary = completion.data.choices[0].message.content.trim();
    res.json({ summary });
  } catch (err) {
    console.error("OpenAI Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to summarize text." });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
