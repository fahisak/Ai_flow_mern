const express = require("express");
const axios = require("axios");
const Promptdata = require("../models/prompt.js");

const router = express.Router();

// Ask AI
router.post("/ask-ai", async (req, res) => {
  const {prompt} = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({error: "Prompt is required"});
  }

  try {
    const aiRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{role: "user", content: prompt}],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    res.json({
      answer: aiRes.data.choices[0].message.content,
    });
  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);

    if (err.response?.status === 429) {
      return res.status(429).json({
        error:
          "Free AI model is temporarily rate-limited. Please try again shortly.",
      });
    }

    res.status(500).json({error: "AI request failed"});
  }
});

// Save to DB
router.post("/save", async (req, res) => {
  const {prompt, response} = req.body;

  if (!prompt || !response) {
    return res.status(400).json({error: "Prompt and response are required"});
  }

  await Promptdata.create({prompt, response});
  res.json({message: "Saved successfully"});
});

module.exports = router;
