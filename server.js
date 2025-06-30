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
  if (["show", "hide", "refresh", "scoreboard_show", "scoreboard_hide"].includes(action)) {
    controlState = { action, timestamp: Date.now() };
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid action" });
  }
});

// Serve controller.html at /controller
app.get('/controller', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

// Serve display.html at /display
app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

// Serve scoreboard.html at /scoreboard
app.get('/scoreboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scoreboard.html'));
});

// Fallback: redirect to controller
app.get('*', (req, res) => {
  res.redirect('/controller');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
