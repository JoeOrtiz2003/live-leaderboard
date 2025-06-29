// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

let controlState = { action: "show", timestamp: Date.now() };

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get current state
app.get('/api/control', (req, res) => {
  res.json(controlState);
});

// Set new state
app.post('/api/control', (req, res) => {
  const { action } = req.body;
  if (["show", "hide", "refresh"].includes(action)) {
    controlState = { action, timestamp: Date.now() };
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid action" });
  }
});

// Render fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
