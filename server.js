const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware di sistema
app.use(express.json({ limit: '10mb' })); // Supporto sicuro per dati complessi (menu, magazzino, comande)
app.use(express.static(path.join(__dirname, 'public')));

// Schema di default rigoroso (Contratto dati del gestionale)
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

// Rotta GET: Lettura protetta e auto-configurazione dello stato
app.get('/api/state', (req, res) => {
  try {
    // Se il file data.json non esiste, lo crea automaticamente con lo schema base
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = getDefaultData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
      return res.json(initialData);
    }

    fs.readFile(DATA_FILE, 'utf8', (err, fileContent) => {
      if (err) {
        console.error('[ERRORE LETTURA DB]:', err);
        return res.status(500).json({ error: 'Impossibile leggere il database.' });
      }
      
      try {
        const parsedData = JSON.parse(fileContent);
        // Merge strutturale difensivo: garantisce che nessuna chiave manchi mai
        const mergedData = { ...getDefaultData(), ...parsedData };
        return res.json(mergedData);
      } catch (parseError) {
        console.error('[ERRORE PARSING JSON - File corrotto o vuoto]:', parseError);
        // Fallback di sicurezza per evitare crash se il file JSON è malformato
        const fallbackData = getDefaultData();
        return res.json(fallbackData);
      }
    });
  } catch (criticalErr) {
    console.error('[ERRORE CRITICO GET /api/state]:', criticalErr);
    return res.status(500).json({ error: 'Errore interno del server.' });
  }
});

// Rotta POST: Persistenza sicura e validata dei dati
app.post('/api/state', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Payload non valido o vuoto.' });
    }

    // Assicura che i dati salvati mantengano sempre la struttura completa
    const dataToSave = { ...getDefaultData(), ...req.body };

    fs.writeFile(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('[ERRORE SCRITTURA DB]:', err);
        return res.status(500).json({ error: 'Impossibile salvare i dati.' });
      }
      return res.json({ success: true, message: 'Stato sincronizzato con successo.' });
    });
  } catch (criticalErr) {
    console.error('[ERRORE CRITICO POST /api/state]:', criticalErr);
    return res.status(500).json({ error: 'Errore interno durante il salvataggio.' });
  }
});

// Avvio del server su porta dinamica (Render) o fissa (locale)
app.listen(PORT, () => {
  console.log(`[PERLA DI MARE] Server operativo e in ascolto sulla porta ${PORT}`);
});
