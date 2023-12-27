const Turnier = require('../models/turnierModel')

class TurnierController {
  async getRecentTurniere (req, res) {
    try {
      const recentTurniere = await Turnier.Turnier.find()
        .sort({ _id: -1 })
        .limit(5)
      res.status(200).json(recentTurniere)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Fehler beim Erstellen des Turniers' })
    }
  }

  async getRecentTurniereMaster (req, res) {
    try {
      const turnierMasterId = req.query.turnierMaster

      const recentTurniere = await Turnier.Turnier.find({
        turnierMaster: turnierMasterId
      }).populate('turnierMaster') // Hier wird die turnierMaster-Referenz aufgelöst

      res.status(200).json(recentTurniere)
    } catch (error) {
      console.error(error.message)
      res
        .status(500)
        .json({
          message: 'Fehler beim Abrufen der Turniere des Turniermasters'
        })
    }
  }

  async getTurniereMitTeilnehmerAnzahl (req, res) {
    try {
      const turniere = await Turnier.Turnier.find()

      const currentDate = new Date()

      const turniereMitTeilnehmerAnzahl = turniere
        .filter(
          turnier =>
            turnier.startDatum > currentDate && // Startdatum liegt in der Zukunft
            turnier.teilnehmer.length < turnier.turnierTeilnehmerAnzahl
        )
        .sort((a, b) => a.createdAt - b.createdAt) // Sortiere nach dem Erstellungsdatum
        .slice(0, 5) // Nur die ersten fünf Elemente

      res.status(200).json(turniereMitTeilnehmerAnzahl)
    } catch (error) {
      console.log(error.message)
      res
        .status(500)
        .json({
          message: 'Fehler beim Abrufen der Turniere mit Teilnehmeranzahl'
        })
    }
  }

  async getHighestTurnierNummer (req, res) {
    try {
      const highestTurnier = await Turnier.Turnier.findOne()
        .sort({ turnierNummer: -1 })
        .limit(1)

      res
        .status(200)
        .json({ highestTurnierNummer: highestTurnier.turnierNummer })
    } catch (error) {
      console.error('Fehler beim Abrufen der höchsten TurnierNummer:', error)
      res
        .status(500)
        .json({ message: 'Fehler beim Abrufen der höchsten TurnierNummer' })
    }
  }

  async getPerson (req, res) {
    try {
      const personId = req.query.personId
      const person = await Turnier.Person.find({ personId }).limit(1)
      res.status(200).json({ person })
    } catch (error) {
      console.error('Fehler beim Abrufen der höchsten TurnierNummer:', error)
      res
        .status(500)
        .json({ message: 'Fehler beim Abrufen der höchsten TurnierNummer' })
    }
  }

  async getMyId (req, res) {
    try {
      const personId = req.query.personId
      const person = await Turnier.Person.findOne({ personId }).findOne()
      res.status(200).json({ _id: person._id })
    } catch (error) {
      console.error('Fehler beim Abrufen der höchsten TurnierNummer:', error)
      res
        .status(500)
        .json({ message: 'Fehler beim Abrufen der höchsten TurnierNummer' })
    }
  }

  async findTurniere (req, res, turnier) {
    try {
      const suchbegriff = req.query.suchbegriff

      const Turnier = turnier

      // Suche nach Turnieren mit dem angegebenen Turniernamen (case-insensitive)
      const ergebnisse = await Turnier.find({
        turnierName: new RegExp(suchbegriff, 'i')
      })

      res.json(ergebnisse)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Interner Serverfehler' })
    }
  }


  async createTurnier (req, res) {
    try {
      console.log('Received data:', req.body)
      const turnier = await Turnier.Turnier.create(req.body)
      res.status(200).json(turnier)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: error.message })
    }
  }

  async createPlatzierung (req, res) {
    try {
      console.log('Received data:', req.body)
      const platzierung = await Turnier.Platzierung.create(req.body)
      res.status(200).json(platzierung)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: error.message })
    }
  }

  async createPerson (req, res) {
    try {
      console.log('Received data:', req.body)
      const person = await Turnier.Person.create(req.body)
      res.status(200).json(person)
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = new TurnierController()
