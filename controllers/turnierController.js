const Turnier = require('../models/turnierModel');


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
            const turnierMasterId = req.query.turnierMaster;
    
            const recentTurniere = await Turnier.Turnier
                .find({ turnierMaster: turnierMasterId })
                .populate('turnierMaster'); // Hier wird die turnierMaster-Referenz aufgelöst
    
            res.status(200).json(recentTurniere);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Fehler beim Abrufen der Turniere des Turniermasters' });
        }
    }

    async getTurniereBySearchTerm(req, res) {
        try {
            const searchTerm = req.query.searchTerm;
    
            // Falls der Suchbegriff leer ist, gib eine leere Liste zurück
            if (!searchTerm || searchTerm.trim() === "") {
                return res.status(200).json([]);
            }
    
            // Suche nach Turnieren, bei denen die Turniernummer oder der Turniername dem Suchbegriff entspricht
            const turniere = await Turnier.Turnier.find({
                $or: [
                    { turnierNummer: searchTerm },
                    { turnierName: searchTerm } 
                ]
            });
            console.log(turniere)
            res.status(200).json(turniere);
        } catch (error) {
            console.error("Fehler beim Abrufen der Turniere:", error);
            res.status(500).json({ message: 'Fehler beim Abrufen der Turniere' });
        }}
    
    async getTurniereMitTeilnehmerAnzahl(req, res) {
        try {
            const turniere = await Turnier.Turnier.find();
    
            const currentDate = new Date();
            
            const turniereMitTeilnehmerAnzahl = turniere
                .filter(turnier => 
                    turnier.startDatum > currentDate && // Startdatum liegt in der Zukunft
                    turnier.teilnehmer.length < turnier.turnierTeilnehmerAnzahl
                )
                .sort((a, b) => a.createdAt - b.createdAt) // Sortiere nach dem Erstellungsdatum
                .slice(0, 5); // Nur die ersten fünf Elemente
    
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

    async getPerson(req, res) {
        try {
            const personId = req.query.personId;
            const person= await Turnier.Person.find({personId}).limit(1);
                res.status(200).json({person});
        } catch (error) {
            console.error("Fehler beim Abrufen der höchsten TurnierNummer:", error);
            res.status(500).json({ message: 'Fehler beim Abrufen der höchsten TurnierNummer' });
        }
    }

    async getMyId(req, res) {
        try {
            console.debug(req)
            const personId = req.query.personId;
            console.log(personId);
            const person = await Turnier.Person.findOne({ personId });
    
            // Überprüfen, ob die Person gefunden wurde
            if (person == null) {
                console.warn("Person nicht gefunden.");
                return res.status(200).json({}); // Leeres JSON-Objekt zurückgeben
            }
    
            console.log(person);
            res.status(200).json({ _id: person._id });
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

    async createPerson(req, res) {
        try {
            console.log('Received data:', req.body);
            const person = await Turnier.Person.create(req.body);
            res.status(200).json(person);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new TurnierController();
