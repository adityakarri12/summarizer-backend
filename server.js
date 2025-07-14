const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Summarization endpoint using Hugging Face
app.post('/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required for summarization' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`, // ✅ Make sure it's set
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const summary = data[0]?.summary_text || 'No summary generated.';
    res.json({ summary });

  } catch (error) {
    console.error('Hugging Face API error:', error);
    res.status(500).json({ error: 'Failed to summarize. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
