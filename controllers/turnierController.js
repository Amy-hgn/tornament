const Turnier = require('../models/turnierModel');

function getBefuellteIndizes(array) {
    return array.reduce((acc, _, index) => {
        if (array[index]) {
            acc.push(index);
        }
        return acc;
    }, []);
}

class TurnierController {
    async getRecentTurniere(req, res) {
        try {
            const recentTurniere = await Turnier.Turnier.find().sort({ _id: -1 }).limit(5);
            res.status(200).json(recentTurniere);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({  message: 'Fehler beim Erstellen des Turniers' });
        }
    }

    async getRecentTurniereMaster(req, res) {
        try {
            // Hier gehen wir davon aus, dass der TurnierMaster im Header als "turnierMaster" vorhanden ist.
            const turnierMaster = req.query.hostname;

            const recentTurniere = await Turnier.Turnier.find({ turnierMaster }).sort({ _id: -1 }).limit(5);
            res.status(200).json(recentTurniere);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({  message: 'Fehler beim Erstellen des Turniers' });
        }
    }
    
    async getTurniereMitTeilnehmerAnzahl(req, res) {
        try {
            const turniere = await Turnier.Turnier.find();
            const turniereMitTeilnehmerAnzahl = turniere.filter(turnier => {
                const befuellteIndizes = getBefuellteIndizes(turnier.turnierTeilnehmer);
                return befuellteIndizes.length < turnier.turnierTeilnehmerAnzahl;
            });
            res.status(200).json(turniereMitTeilnehmerAnzahl);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: 'Fehler beim Abrufen der Turniere mit Teilnehmeranzahl' });
        }
    }

    async getHighestTurnierNummer(req, res) {
        try {
            const highestTurnier = await Turnier.Turnier.findOne().sort({ turnierNummer: -1 }).limit(1);
            
                res.status(200).json({ highestTurnierNummer: highestTurnier.turnierNummer });
            
        } catch (error) {
            console.error("Fehler beim Abrufen der höchsten TurnierNummer:", error);
            res.status(500).json({ message: 'Fehler beim Abrufen der höchsten TurnierNummer' });
        }
    }

    async createTurnier(req, res) {
        try {
            console.log('Received data:', req.body);
            const turnier = await Turnier.Turnier.create(req.body);
            res.status(200).json(turnier);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async createPlatzierung(req, res) {
        try {
            console.log('Received data:', req.body);
            const platzierung = await Turnier.Platzierung.create(req.body);
            res.status(200).json(platzierung);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new TurnierController();
