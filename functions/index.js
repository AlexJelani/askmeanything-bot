const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

// Get the OpenAI API key from Firebase Functions configuration
const apiKey = functions.config().openai.apikey;

app.get('/getApiKey', (req, res) => {
  res.status(200).json({ apiKey });
});

exports.api = functions.https.onRequest(app);
