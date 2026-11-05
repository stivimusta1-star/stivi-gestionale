const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/state', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json({});
  }
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Errore lettura dati' });
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.json({});
    }
  });
});
app.post('/api/state', (req, res) => {
  fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Errore salvataggio dati' });
    }
    res.json({ success: true });
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
