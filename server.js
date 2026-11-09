// Server minimale per il gestionale (nessuna dipendenza da installare).
// Variabili ambiente opzionali su Render:
//   APP_USER e APP_PASS -> chiedono nome utente e password a chi apre il sito
//   DATA_DIR            -> cartella del disco permanente (es. /var/data)
const http = require("http");
const fs = require("fs");
const path = require("path");

const DIR = process.env.DATA_DIR || __dirname;
const FILE = path.join(DIR, "data.json");
const USER = process.env.APP_USER || "";
const PASS = process.env.APP_PASS || "";

let state = null;
try { state = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch (e) {}

function persist() {
  try {
    fs.writeFileSync(FILE + ".tmp", JSON.stringify(state));
    fs.renameSync(FILE + ".tmp", FILE);
  } catch (e) { console.error("Salvataggio non riuscito:", e.message); }
}

function autorizzato(req) {
  if (!USER && !PASS) return true;
  const h = req.headers.authorization || "";
  if (!h.startsWith("Basic ")) return false;
  const [u, ...p] = Buffer.from(h.slice(6), "base64").toString().split(":");
  return u === USER && p.join(":") === PASS;
}

http.createServer((req, res) => {
  if (!autorizzato(req)) {
    res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Gestionale"' });
    return res.end("Accesso riservato");
  }
  const url = req.url.split("?")[0];

  if (url === "/api/state") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      return res.end(JSON.stringify(state || {}));
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", c => { body += c; if (body.length > 20e6) req.destroy(); });
      req.on("end", () => {
        try { state = JSON.parse(body); persist(); res.writeHead(200); res.end("ok"); }
        catch (e) { res.writeHead(400); res.end("dati non validi"); }
      });
      return;
    }
  }

  if (req.method === "GET" && (url === "/" || url === "/index.html")) {
    return fs.readFile(path.join(__dirname, "gestionale.html"), (err, data) => {
      if (err) { res.writeHead(404); return res.end("gestionale.html mancante nel repository"); }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
      res.end(data);
    });
  }

  res.writeHead(404);
  res.end("Non trovato");
}).listen(process.env.PORT || 3000, "0.0.0.0", () => console.log("Gestionale attivo"));
