const Turnier = require('../models/turnierModel');

class TurnierController {
    // GET-Methoden
    async getRecentTurniere(req, res) {
        try {
            const recentTurniere = await Turnier.Turnier.find().sort({ _id: -1 }).limit(5);
            res.status(200).json(recentTurniere);
        } catch (error) {
            this.handleError(res, 'Fehler beim Abrufen der neuesten Turniere', error);
        }
    }

    async getTurnierById(req, res) {
        try {
          const turnierId = req.query.id; 
      
          const foundTurnier = await Turnier.Turnier.findById(turnierId).populate('turnierMaster');
      
          if (!foundTurnier) {
            return res.status(404).json({ message: 'Turnier nicht gefunden' });
          }
      
          res.status(200).json(foundTurnier);
        } catch (error) {
          this.handleError(res, 'Fehler beim Abrufen des Turniers', error);
        }
      }

    async getRecentTurniereMaster(req, res) {
        try {
            const turnierMasterId = req.query.turnierMaster;
            const recentTurniere = await Turnier.Turnier
                .find({ turnierMaster: turnierMasterId })
                .populate('turnierMaster');
            res.status(200).json(recentTurniere);
        } catch (error) {
            this.handleError(res, 'Fehler beim Abrufen der Turniere des Turniermasters', error);
        }
    }

    async getTurniereBySearchTerm(req, res) {
        try {
            const searchTerm = req.query.searchTerm;
            const regex = new RegExp(`^${searchTerm}.*$`, 'i');

            if (!searchTerm || searchTerm.trim() === "") {
                return res.status(200).json([]);
            }

            let turniere;

            if (!isNaN(Number(searchTerm))) {
                turniere = await Turnier.Turnier.find({
                    $or: [
                        { turnierNummer: searchTerm },
                        { turnierName: regex }
                    ]
                });
            } else {
                turniere = await Turnier.Turnier.find({
                    $or: [
                        { turnierName: regex }
                    ]
                });
            }

            res.status(200).json(turniere);
        } catch (error) {
            this.handleError(res, 'Fehler beim Abrufen der Turniere', error);
        }
    }

    async getTurniereMitTeilnehmerAnzahl(req, res) {
        try {
            const turniere = await Turnier.Turnier.find();
            const currentDate = new Date();

            const turniereMitTeilnehmerAnzahl = turniere
                .filter(turnier =>
                    turnier.startDatum > currentDate &&
                    turnier.teilnehmer.length < turnier.turnierTeilnehmerAnzahl
                )
                .sort((a, b) => a.createdAt - b.createdAt)
                .slice(0, 5);

            res.status(200).json(turniereMitTeilnehmerAnzahl);
        } catch (error) {
            this.handleError(res, 'Fehler beim Abrufen der Turniere mit Teilnehmeranzahl', error);
        }
    }

    async getHighestTurnierNummer(req, res) {
        try {
            const highestTurnier = await Turnier.Turnier.findOne().sort({ turnierNummer: -1 }).limit(1);
            res.status(200).json({ highestTurnierNummer: highestTurnier.turnierNummer });
        } catch (error) {
            this.handleError(res, 'Fehler beim Abrufen der höchsten TurnierNummer', error);
        }
    }

    async getPerson(req, res) {
        try {
            const personId = req.query.personId;
            const person = await Turnier.Person.find({ personId }).limit(1);
            res.status(200).json({ person });
        } catch (error) {
            this.handleError(res, 'Fehler beim Abrufen der Person', error);
        }
    }

    async getMyId(req, res) {
        try {
            const personId = req.query.personId;
            const person = await Turnier.Person.findOne({ personId });

            if (person == null) {
                console.warn("Person nicht gefunden.");
                return res.status(200).json({});
            }

            res.status(200).json({ _id: person._id });
        } catch (error) {
            this.handleError(res, 'Fehler beim Abrufen der eigenen ID', error);
        }
    }

    // POST-Methoden
    async createTurnier(req, res) {
        try {
            console.log('Received data:', req.body);
            const turnier = await Turnier.Turnier.create(req.body);
            res.status(200).json(turnier);
        } catch (error) {
            this.handleError(res, 'Fehler beim Erstellen des Turniers', error);
        }
    }

    async createPlatzierung(req, res) {
        try {
            console.log('Received data:', req.body);
            const platzierung = await Turnier.Platzierung.create(req.body);
            res.status(200).json(platzierung);
        } catch (error) {
            this.handleError(res, 'Fehler beim Erstellen der Platzierung', error);
        }
    }

    async createTeam(req, res) {
        try {
            console.log('Received data:', req.body);
            const platzierung = await Turnier.Team.create(req.body);
            res.status(200).json(platzierung);
        } catch (error) {
            this.handleError(res, 'Fehler beim Erstellen des Teams', error);
        }
    }

    async createPerson(req, res) {
        try {
            console.log('Received data:', req.body);
            const person = await Turnier.Person.create(req.body);
            res.status(200).json(person);
        } catch (error) {
            this.handleError(res, 'Fehler beim Erstellen der Person', error);
        }
    }
    async createSpiel(req, res) {
        try {
            console.log('Received data:', req.body);
            const spiel = await Turnier.Spiel.create(req.body);
            res.status(200).json(spiel);
        } catch (error) {
            this.handleError(res, 'Fehler beim Erstellen des Spieles', error);
        }
    }
    
    async createKORunde(req, res) {
        try {
            console.log('Received data:', req.body);
            const koRunde = await Turnier.KoRunde.create(req.body);
            res.status(200).json(koRunde);
        } catch (error) {
            this.handleError(res, 'Fehler beim Erstellen der Ko-Runde', error);
        }
    }

    // Hilfsmethode zum Behandeln von Fehlern
    handleError(res, message, error) {
        console.error(message, error);
        res.status(500).json({ message });
    }
}

module.exports = new TurnierController();
