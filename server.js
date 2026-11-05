const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Struttura dati di default per evitare che il frontend riceva dati vuoti o indefiniti
const getDefaultData = () => ({
  res: [],
  staff: [],
  tks: [],
  ch: [],
  cms: [],
  menu: [],
  tables: [],
  mag: [],
  pren: [],
  inc: []
});

// Rotta per leggere lo stato
app.get('/api/state', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = getDefaultData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return res.json(initialData);
  }
  
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Errore lettura dati' });
    try {
      const parsed = JSON.parse(data);
      // Unisce i dati salvati con i default per garantire che nessuna proprietà sia mai 'undefined'
      res.json({ ...getDefaultData(), ...parsed });
    } catch (e) {
      res.json(getDefaultData());
    }
  });
});

// Rotta per salvare lo stato
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
