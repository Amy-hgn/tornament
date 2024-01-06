const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const turnierController = require('./controllers/turnierController');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('models'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// HTML-Dateien servieren
app.get('/create-turnier', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'create-turnier.html'));
});

app.get('/anzeige-turnier', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'anzeige-turnier.html'));
});

app.get('/turnier-byID', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'turnier-detail.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'anzeige-turnier.html'));
});

// GET-Endpunkte
app.get('/recent-turniere', async (req, res) => {
    await turnierController.getRecentTurniere(req, res);
});

app.get('/turnier-ID', async (req, res) => {
    await turnierController.getTurnierById(req, res);
});

app.get('/koRunde-ID', async (req, res) => {
    await turnierController.getKoRundeById(req, res);
});

app.get('/spiel-ID', async (req, res) => {
    await turnierController.getSpielById(req, res);
});

app.get('/team-ID', async (req, res) => {
    await turnierController.getTeamById(req, res);
});

app.get('/recent-turniereMaster', async (req, res) => {
    await turnierController.getRecentTurniereMaster(req, res);
});

app.get('/turniernummer', async (req, res) => {
    await turnierController.getHighestTurnierNummer(req, res);
});

app.get('/search-turniere', async (req, res) => {
    await turnierController.getTurniereBySearchTerm(req, res);
});

app.get('/person', async (req, res) => {
    await turnierController.getPerson(req, res);
});

app.get('/myId', async (req, res) => {
    await turnierController.getMyId(req, res);
});

app.get('/freie-turniere', async (req, res) => {
    await turnierController.getTurniereMitTeilnehmerAnzahl(req, res);
});

// POST-Endpunkte
app.post('/api/create-turnier', async (req, res) => {
    await turnierController.createTurnier(req, res);
});

app.post('/api/create-team', async (req, res) => {
    await turnierController.createTeam(req, res);
});

app.post('/api/create-platzierung', async (req, res) => {
    await turnierController.createPlatzierung(req, res);
});

app.post('/api/create-person', async (req, res) => {
    await turnierController.createPerson(req, res);
});

app.post('/api/create-spiel', async (req, res) => {
    await turnierController.createSpiel(req, res);
});

app.post('/api/create-ko-runde', async (req, res) => {
    await turnierController.createKORunde(req, res);
});



// MongoDB-Verbindung
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });