const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
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
    const newData = req.json ? req.body : req.value;
    fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Errore salvataggio dati' });
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
    console.log(`Server gestionale in ascolto sulla porta ${PORT}`);
});
const MENU_V = 2;
const CATS = ["Antipasti di mare","Antipasti di terra","Primi di mare","Primi di terra","Secondi di mare","Secondi di terra","Contorni","Dessert","Vini bianchi","Vini rossi","Bollicine","Acqua e soft drink","Birre","Amari e distillati"];
const MENU = {"Antipasti di mare":"Fantasia di mare:18;Mare caldo:16;Zuppetta di cozze e vongole al vapore:16;Insalatina di mare tiepida:15;Carpaccio di affumicati:15;Ostriche (cad.):4;Acciughe impanate e fritte:14;Crudo di pesce - fantasia dello Chef:30;Julienne di totani tiepidi:14;Acciughe alla marinara:14","Antipasti di terra":"Antipasto toscano:16;Carpaccio di bresaola, rucola e grana:16;Bruschette miste:10","Primi di mare":"Spaghetti allo scoglio:15;Risotto alla pescatora:15;Risotto al nero di seppia:15;Tagliolino ai mirtilli con scampi e zucchine:16;Ravioli ripieni all’astice con asparagi, gamberi e bottarga:16;Tagliolino all’astice (min. 2 pers.):20;Tagliolino all’aragosta (min. 2 pers.):28;Calamarata ai crostacei al cartoccio:16;Tagliolino mare e monti con polpo e porcini:16;Ravioli al profumo di mare, salmone e rucola:16;La pescata del giorno:16;Spaghetti alle vongole:15","Primi di terra":"Pappardelle al cinghiale:16;Tagliolini speck e tartufo:16;Tagliolini ai funghi e porcini:16;Pappardelle alla lepre:16;Tagliolini alla carbonara:14;Pasta al ragù:10;Pasta al pomodoro:10;Pasta bianca:8","Secondi di mare":"Frittura di totani e gamberi:16;Gran fritto di totani, gamberi e paranza:20;Frittura di paranza:18;Grigliata mista:20;Gamberoni al guazzetto:18;Pesce all’isolana:20;Catalana mix (min. 2 pers.):50;Pesce al sale:20;Scampi alla griglia:18;Gamberi alla griglia:18;Tagliata di tonno:18","Secondi di terra":"Filetto di manzo:0;Bistecca Fiorentina:0;Tagliata, rucola e grana:0","Contorni":"Insalata mista:6;Patatine fritte:5;Verdure fritte:6;Patate al forno:6","Dessert":"Semifreddo al pistacchio:6;Delizia al limone:6;Soufflé al cioccolato:7;Tiramisù:6;Panna cotta:6;Crema catalana:6;Dolce della casa:6;Frutta e macedonia:6;Tartufo bianco o nero:6","Vini bianchi":"Vermentino Fibbiano BIO 0,75 l:20;Mistral Vermentino Bolgheri DOC 0,75 l:25;Vermentino La Pettegola 0,75 l:18;Albizzia Chardonnay Frescobaldi 0,75 l:15;Falanghina DOP Sannio Solopaca 'Prime Vigne' 0,75 l:15;Passerina 'Sansisto' IGT 0,75 l:25;Pinot Grigio DOC Friuli Isonzo '25 - B.go Vassalli 0,75 l:15;Ribolla Gialla - B.go Vassalli 0,75 l:15;Sauvignon Friuli DOC - B.go Vassalli 0,75 l:18;Traminer Aromatico IGT Tre Venezie '24 - B.go Vassalli 0,75 l:18;Vermentino Sardo Donnikalia 0,75 l:28","Vini rossi":"Morellino 'Val delle Rose' 0,75 l:22;Chianti Banfi Superiore DOCG 0,75 l:20","Bollicine":"Prosecco DOC Extra Dry Treviso 'Ville d’Arfanta' 0,75 l:15;Prosecco Millesimato Blu Extra Dry Val d'Oca 0,75 l:18;Spumante Millesimato Cuvée Vittoria Extra Dry Casa Coller 0,75 l:15","Acqua e soft drink":"Acqua Panna 0,75 l:3;Acqua S. Pellegrino 0,75 l:3;Coca-Cola 0,33 l:4;Coca-Cola Zero 0,33 l:4;Estathé limone 0,25 l:4;Estathé pesca 0,25 l:4","Birre":"Birra Giusta Bionda 0,33 l - La Petrognola:6;Birra Metra IPA 0,33 l - La Petrognola:6;Birra Montefiore Bianca 0,33 l - La Petrognola:6","Amari e distillati":"Amaro del Capo:4;Amaro Montenegro:4;Baileys Irish Cream:5;Fernet Branca:5;Grappa Bianca Frattina:4;Grappa Gaiarine 903 Barrique:5;I 3 Ponce 30°:4;Limoncello di Capri:4;Sambuca Molinari:4"};

function freshMenu() {
    let i = 1000;
    const r = [];
    for (const c of CATS) {
        MENU[c].split(";").forEach(x => {
            const k = x.lastIndexOf(":");
            r.push({ id: ++i, n: x.slice(0, k), c, p: +x.slice(k + 1), s: null, min: 0 });
        });
    }
    return r;
}

function loadState() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {}
    }
    return { menu: freshMenu(), tables: {}, sales: [], res: [], staff: [], ing: [], tk: [], ch: [], cn: [], mv: MENU_V };
}

function saveState(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let store = loadState();

app.get('/api/state', (req, res) => {
    res.json(store);
});

app.post('/api/state', (req, res) => {
    store = req.body;
    saveState(store);
    res.json({ success: true, timestamp: Date.now() });
});

app.listen(PORT, () => {
    console.log(`Server gestionale in ascolto sulla porta ${PORT}`);
});