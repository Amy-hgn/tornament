// Importieren der erforderlichen Module
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const turnierController = require("./controllers/turnierController");
require("dotenv").config();

/**
 * Express-Anwendung für das Turnier-Management.
 * @type {express.Application}
 */

// Middleware-Konfiguration

/**
 * Middleware für das Parsen von JSON-Anfragen.
 * @middleware
 */
const app = express();

/**
 * Konfiguration für das Bereitstellen von statischen Dateien und Ordnern.
 * @middleware
 */
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("models"));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// HTML-Dateien servieren

/**
 * Route zum Servieren der HTML-Datei für das Erstellen eines Turniers.
 * @route GET /create-turnier
 * @callback
 */
app.get("/create-turnier", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "create-turnier.html"));
});
/**
 * Route zum Servieren der HTML-Datei für die Anzeige der Turniere.
 * @route GET /anzeige-turnier
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/anzeige-turnier", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "anzeige-turnier.html"));
});
/**
 * Route zum Servieren der HTML-Datei für die Detailansicht eines Turniers anhand der ID.
 * @route GET /turnier-byID
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit der Turnier-ID als Query-Parameter.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/turnier-byID", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "turnier-detail.html"));
});
/**
 * Route zum Servieren der HTML-Datei für die Hauptansicht der Turniere.
 * @route GET /
 * @callback
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "anzeige-turnier.html"));
});
/**
 * Route zum Servieren der HTML-Datei für die Eintragung der Ergebnisse von einem Spiel.
 * @route GET /
 * @callback
 */
app.get('/spiel-byID', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'spiel-score.html'));
});

// GET-Endpunkte

/**
 * GET-Endpunkt für das Abrufen der neuesten Turniere.
 * @route GET /recent-turniere
 * @callback
 */
app.get("/recent-turniere", async (req, res) => {
  await turnierController.getRecentTurniere(req, res);
});
/**
 * Route zum Abrufen eines Turniers anhand seiner ID.
 * @route GET /turnier-ID
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit der Turnier-ID als Query-Parameter.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/turnier-ID", async (req, res) => {
  await turnierController.getTurnierById(req, res);
});
/**
 * Route zum Abrufen einer KO-Runde anhand ihrer ID.
 * @route GET /koRunde-ID
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit der KO-Runden-ID als Query-Parameter.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/koRunde-ID", async (req, res) => {
  await turnierController.getKoRundeById(req, res);
});
/**
 * Route zum Abrufen eines Spiels anhand seiner ID.
 * @route GET /spiel-ID
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit der Spiel-ID als Query-Parameter.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/spiel-ID", async (req, res) => {
  await turnierController.getSpielById(req, res);
});
/**
 * Route zum Abrufen eines Teams anhand seiner ID.
 * @route GET /team-ID
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit der Team-ID als Query-Parameter.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/team-ID", async (req, res) => {
  await turnierController.getTeamById(req, res);
});
/**
 * Route zum Abrufen der neuesten Turniere für den Turnier-Meister.
 * @route GET /recent-turniereMaster
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/recent-turniereMaster", async (req, res) => {
  await turnierController.getRecentTurniereMaster(req, res);
});
/**
 * Route zum Abrufen der höchsten Turniernummer.
 * @route GET /turniernummer
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/turniernummer", async (req, res) => {
  await turnierController.getHighestTurnierNummer(req, res);
});
/**
 * Route zum Suchen von Turnieren anhand eines Suchbegriffs.
 * @route GET /search-turniere
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit dem Suchbegriff als Query-Parameter.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/search-turniere", async (req, res) => {
  await turnierController.getTurniereBySearchTerm(req, res);
});
/**
 * Route zum Abrufen von Personendaten.
 * @route GET /person
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/person", async (req, res) => {
  await turnierController.getPerson(req, res);
});

/**
 * Route zum Abrufen der eigenen ID (als Turnier-Meister) basierend auf der IP-Adresse.
 * @route GET /myId
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/myId", async (req, res) => {
  await turnierController.getMyId(req, res);
});
/**
 * Route zum Abrufen von freien Turnieren (ohne maximale Anzahl der Teilnehmer erreicht).
 * @route GET /freie-turniere
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.get("/freie-turniere", async (req, res) => {
  await turnierController.getTurniereMitTeilnehmerAnzahl(req, res);
});

// POST-Endpunkte

/**
 * Route zum Erstellen eines neuen Turniers.
 * @route POST /api/create-turnier
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit den Turnierdaten im Anfragekörper.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.post("/api/create-turnier", async (req, res) => {
  await turnierController.createTurnier(req, res);
});
/**
 * Route zum Erstellen eines neuen Teams.
 * @route POST /api/create-team
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit den Teamdaten im Anfragekörper.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.post("/api/create-team", async (req, res) => {
  await turnierController.createTeam(req, res);
});
/**
 * Route zum Erstellen einer neuen Platzierung.
 * @route POST /api/create-platzierung
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit den Platzierungsdaten im Anfragekörper.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.post("/api/create-platzierung", async (req, res) => {
  await turnierController.createPlatzierung(req, res);
});
/**
 * Route zum Erstellen einer neuen Person.
 * @route POST /api/create-person
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit den Personendaten im Anfragekörper.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.post("/api/create-person", async (req, res) => {
  await turnierController.createPerson(req, res);
});
/**
 * Route zum Erstellen eines neuen Spiels.
 * @route POST /api/create-spiel
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit den Spieldaten im Anfragekörper.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.post("/api/create-spiel", async (req, res) => {
  await turnierController.createSpiel(req, res);
});
/**
 * Route zum Erstellen einer neuen KO-Runde.
 * @route POST /api/create-ko-runde
 * @async
 * @callback
 * @param {express.Request} req - Express-Anfrageobjekt mit den KO-Rundendaten im Anfragekörper.
 * @param {express.Response} res - Express-Antwortobjekt.
 */
app.post("/api/create-ko-runde", async (req, res) => {
  await turnierController.createKORunde(req, res);
});





app.post('/api/set-game-score', async (req, res) => {
    await turnierController.setGameScore(req, res);
});

// MongoDB-Verbindung

/**
 * Verbindung zur MongoDB-Datenbank herstellen und den Server starten.
 */
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
