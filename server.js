const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const turnierController = require('./controllers/turnierController');


require('dotenv').config();

const app = express();

app.use(express.json());

app.use(express.static('public'));

app.use(express.static('models'));

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/create-turnier', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'create-turnier.html'));
});

app.get('/anzeige-turnier', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'anzeige-turnier.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/recent-turniere', async (req, res) => {
     await turnierController.getRecentTurniere(req, res);
});
app.get('/recent-turniereMaster', async (req, res) => {
    await turnierController.getRecentTurniereMaster(req, res);
});

app.get('/turniernummer', async (req, res) => {
    await turnierController.getHighestTurnierNummer(req, res);
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

app.post('/api/create-turnier', async (req, res) => {
   await turnierController.createTurnier(req,res);
});

app.post('/api/create-platzierung', async (req, res) => {
    await turnierController.createPlatzierung(req,res);
 });

 app.post('/api/create-person', async (req, res) => {
    await turnierController.createPerson(req,res);
 });
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is Running on port 3000');
        });

        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });
