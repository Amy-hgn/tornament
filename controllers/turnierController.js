const Turnier = require("../models/turnierModel");

class TurnierController {
  // GET-Methoden
  /**
   * Holt die neuesten fünf Turniere.
   *
   * @param {Object} req - Das Request-Objekt.
   * @param {Object} res - Das Response-Objekt.
   * @returns {Object} - Die neuesten fünf Turniere im JSON-Format.
   */
  async getRecentTurniere(req, res) {
    try {
      const recentTurniere = await Turnier.Turnier.find()
        .sort({ _id: -1 })
        .limit(5);
      res.status(200).json(recentTurniere);
    } catch (error) {
      this.handleError(res, "Fehler beim Abrufen der neuesten Turniere", error);
    }
  }
  /**
   * Holt ein Turnier anhand seiner ID.
   *
   * @param {Object} req - Das Request-Objekt mit der ID des Turniers in der Abfrage.
   * @param {Object} res - Das Response-Objekt.
   * @returns {Object} - Das gefundene Turnier im JSON-Format.
   */
  async getTurnierById(req, res) {
    try {
      const turnierId = req.query.id;

      const foundTurnier = await Turnier.Turnier.findById(turnierId).populate(
        "turnierMaster"
      );

      if (!foundTurnier) {
        return res.status(404).json({ message: "Turnier nicht gefunden" });
      }

      res.status(200).json(foundTurnier);
    } catch (error) {
      this.handleError(res, "Fehler beim Abrufen des Turniers", error);
    }
  }
  /**
   * Holt eine Ko-Runde anhand ihrer ID.
   *
   * @param {Object} req - Das Request-Objekt mit der ID der Ko-Runde in der Abfrage.
   * @param {Object} res - Das Response-Objekt.
   * @returns {Object} - Die gefundene Ko-Runde im JSON-Format.
   */
  async getKoRundeById(req, res) {
    try {
      const koRundeId = req.query.id;

      const foundKoRunde = await Turnier.KoRunde.findById(koRundeId); // Annahme: Das Modell für Ko-Runden heißt KoRunde

      if (!foundKoRunde) {
        return res.status(404).json({ message: "Ko-Runde nicht gefunden" });
      }

      res.status(200).json(foundKoRunde);
    } catch (error) {
      this.handleError(res, "Fehler beim Abrufen der Ko-Runde", error);
    }
  }

  /**
   * Holt ein Spiel anhand seiner ID.
   *
   * @param {Object} req - Das Request-Objekt mit der ID des Spiels in der Abfrage.
   * @param {Object} res - Das Response-Objekt.
   * @returns {Object} - Das gefundene Spiel im JSON-Format.
   */
  async getSpielById(req, res) {
    try {
      const spielId = req.query.id;

      const foundSpiel = await Turnier.Spiel.findById(spielId); // Annahme: Das Modell für Spiele heißt Spiel

      if (!foundSpiel) {
        return res.status(404).json({ message: "Spiel nicht gefunden" });
      }

      res.status(200).json(foundSpiel);
    } catch (error) {
      this.handleError(res, "Fehler beim Abrufen des Spiels", error);
    }
  }
  /**
   * Holt ein Team anhand seiner ID.
   *
   * @param {Object} req - Das Request-Objekt mit der ID des Teams in der Abfrage.
   * @param {Object} res - Das Response-Objekt.
   * @returns {Object} - Das gefundene Team im JSON-Format.
   */
  async getTeamById(req, res) {
    try {
      const spielId = req.query.id;

      const foundSpiel = await Turnier.Team.findById(spielId); // Annahme: Das Modell für Spiele heißt Spiel

      if (!foundSpiel) {
        return res.status(404).json({ message: "Spiel nicht gefunden" });
      }

      res.status(200).json(foundSpiel);
    } catch (error) {
      this.handleError(res, "Fehler beim Abrufen des Spiels", error);
    }
  }
/**
 * Holt die neuesten Turniere eines Turniermasters.
 *
 * @param {Object} req - Das Request-Objekt mit der ID des Turniermasters in der Abfrage.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Die neuesten Turniere des Turniermasters im JSON-Format.
 */
  async getRecentTurniereMaster(req, res) {
    try {
      const turnierMasterId = req.query.turnierMaster;
      const recentTurniere = await Turnier.Turnier.find({
        turnierMaster: turnierMasterId,
      }).populate("turnierMaster");
      res.status(200).json(recentTurniere);
    } catch (error) {
      this.handleError(
        res,
        "Fehler beim Abrufen der Turniere des Turniermasters",
        error
      );
    }
  }

/**
 * Sucht nach Turnieren basierend auf einem Suchbegriff.
 *
 * @param {Object} req - Das Request-Objekt mit dem Suchbegriff in der Abfrage.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Gefundene Turniere, die dem Suchbegriff entsprechen, im JSON-Format.
 */
  async getTurniereBySearchTerm(req, res) {
    try {
      const searchTerm = req.query.searchTerm;
      const regex = new RegExp(`^${searchTerm}.*$`, "i");

      if (!searchTerm || searchTerm.trim() === "") {
        return res.status(200).json([]);
      }

      let turniere;

      if (!isNaN(Number(searchTerm))) {
        turniere = await Turnier.Turnier.find({
          $or: [{ turnierNummer: searchTerm }, { turnierName: regex }],
        });
      } else {
        turniere = await Turnier.Turnier.find({
          $or: [{ turnierName: regex }],
        });
      }

      res.status(200).json(turniere);
    } catch (error) {
      this.handleError(res, "Fehler beim Abrufen der Turniere", error);
    }
  }
/**
 * Holt Turniere, die in der Zukunft liegen und noch Teilnehmer aufnehmen können.
 *
 * @param {Object} req - Das Request-Objekt.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Die Turniere mit verfügbaren Teilnehmerplätzen im JSON-Format.
 */
  async getTurniereMitTeilnehmerAnzahl(req, res) {
    try {
      const turniere = await Turnier.Turnier.find();
      const currentDate = new Date();

      const turniereMitTeilnehmerAnzahl = turniere
        .filter(
          (turnier) =>
            turnier.startDatum > currentDate &&
            turnier.teilnehmer.length < turnier.turnierTeilnehmerAnzahl
        )
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(0, 5);

      res.status(200).json(turniereMitTeilnehmerAnzahl);
    } catch (error) {
      this.handleError(
        res,
        "Fehler beim Abrufen der Turniere mit Teilnehmeranzahl",
        error
      );
    }
  }
/**
 * Holt die höchste Turniernummer.
 *
 * @param {Object} req - Das Request-Objekt.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Die höchste Turniernummer im JSON-Format.
 */
  async getHighestTurnierNummer(req, res) {
    try {
      const highestTurnier = await Turnier.Turnier.findOne()
        .sort({ turnierNummer: -1 })
        .limit(1);
      res
        .status(200)
        .json({ highestTurnierNummer: highestTurnier.turnierNummer });
    } catch (error) {
      this.handleError(
        res,
        "Fehler beim Abrufen der höchsten TurnierNummer",
        error
      );
    }
  }
/**
 * Holt Informationen über eine Person anhand ihrer ID.
 *
 * @param {Object} req - Das Request-Objekt mit der ID der Person in der Abfrage.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Informationen über die gefundene Person im JSON-Format.
 */
  async getPerson(req, res) {
    try {
      const personId = req.query.personId;
      const person = await Turnier.Person.find({ personId }).limit(1);
      res.status(200).json({ person });
    } catch (error) {
      this.handleError(res, "Fehler beim Abrufen der Person", error);
    }
  }

/**
 * Holt die eigene ID anhand der Person-ID.
 *
 * @param {Object} req - Das Request-Objekt mit der ID der Person in der Abfrage.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Die eigene ID im JSON-Format.
 */
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
      this.handleError(res, "Fehler beim Abrufen der eigenen ID", error);
    }
  }

  // POST-Methoden

  /**
   * Erstellt ein Turnier.
   *
   * @param {Object} req - Das Request-Objekt mit den Turnierdaten.
   * @param {Object} res - Das Response-Objekt.
   * @returns {Object} - Das erstellte Turnier im JSON-Format.
   */
  async createTurnier(req, res) {
    try {
      console.log("Received data:", req.body);
      const turnier = await Turnier.Turnier.create(req.body);
      res.status(200).json(turnier);
    } catch (error) {
      this.handleError(res, "Fehler beim Erstellen des Turniers", error);
    }
  }
/**
 * Erstellt eine Platzierung.
 *
 * @param {Object} req - Das Request-Objekt mit den Platzierungsdaten.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Die erstellte Platzierung im JSON-Format.
 */
  async createPlatzierung(req, res) {
    try {
      console.log("Received data:", req.body);
      const platzierung = await Turnier.Platzierung.create(req.body);
      res.status(200).json(platzierung);
    } catch (error) {
      this.handleError(res, "Fehler beim Erstellen der Platzierung", error);
    }
  }
/**
 * Erstellt ein neues Team.
 *
 * @param {Object} req - Das Request-Objekt mit den Teamdaten im Körper.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Das erstellte Team im JSON-Format.
 */
  async createTeam(req, res) {
    try {
      console.log("Received data:", req.body);
      const platzierung = await Turnier.Team.create(req.body);
      res.status(200).json(platzierung);
    } catch (error) {
      this.handleError(res, "Fehler beim Erstellen des Teams", error);
    }
  }
/**
 * Erstellt eine neue Person.
 *
 * @param {Object} req - Das Request-Objekt mit den Personendaten im Körper.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Die erstellte Person im JSON-Format.
 */
  async createPerson(req, res) {
    try {
      console.log("Received data:", req.body);
      const person = await Turnier.Person.create(req.body);
      res.status(200).json(person);
    } catch (error) {
      this.handleError(res, "Fehler beim Erstellen der Person", error);
    }
  }
  /**
 * Erstellt ein neues Spiel.
 *
 * @param {Object} req - Das Request-Objekt mit den Spieldaten im Körper.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Das erstellte Spiel im JSON-Format.
 */
  async createSpiel(req, res) {
    try {
      console.log("Received data:", req.body);
      const spiel = await Turnier.Spiel.create(req.body);
      res.status(200).json(spiel);
    } catch (error) {
      this.handleError(res, "Fehler beim Erstellen des Spieles", error);
    }
  }
/**
 * Erstellt eine neue Ko-Runde.
 *
 * @param {Object} req - Das Request-Objekt mit den Daten der Ko-Runde im Körper.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Die erstellte Ko-Runde im JSON-Format.
 */
  async createKORunde(req, res) {
    try {
      console.log("Received data:", req.body);
      const koRunde = await Turnier.KoRunde.create(req.body);
      res.status(200).json(koRunde);
    } catch (error) {
      this.handleError(res, "Fehler beim Erstellen der Ko-Runde", error);
    }
  }
 

    async setGameScore(req, res) {
        try {
          const turnierId = req.body.turnierId;
          const turnier = await Turnier.Turnier.findById(turnierId).populate('koRunden');
          const tm = await Turnier.Person.findById(turnier.turnierMaster);
          console.log('TMid: ', tm.personId);
          if(tm.personId === tm.personId){
            const koRunden = turnier.koRunden;
            const spielDaten = req.body.spielDetails;
            const spielId = spielDaten._id;
            const koId = req.body.rundeId;
            let aktRunde = -1;
            let spielNr = -1;
            let winner;
            const notUpdatedSpiel = await Turnier.Spiel.findById(spielId);
            if(typeof notUpdatedSpiel.team1 === 'undefined' || typeof notUpdatedSpiel.team2 === 'undefined'){
                return res.status(404).json({ message: 'Team nicht gefunden' });
            }
            const { punkteGewinner, spielStatus } = spielDaten;
    
            const updateObj = {};
            if (punkteGewinner === 1 || punkteGewinner === 0) {
                updateObj.punkteGewinner = punkteGewinner;
            }else{return res.status(404).json({ message: 'nur 1 oder 2' });}
            if (spielStatus === 'completed') {
                updateObj.spielStatus = spielStatus;
            }else{return res.status(404).json({ message: 'Spiel nicht fertig?' });}
    
            const updatedSpiel = await Turnier.Spiel.findByIdAndUpdate(
                spielId,
                updateObj,
                { new: true }
            );
            if (!updatedSpiel) {
                return res.status(404).json({ message: 'Spiel nicht gefunden' });
            }
    
            if (punkteGewinner === 1) {
                winner = updatedSpiel.team1;
            } else {
                winner = updatedSpiel.team2;
            }
    
            const update2Obj = {};
            let nextGameNr;


            if (!turnier) {
                return res.status(404).json({ message: 'Turnier nicht gefunden' });
            }
    
            for (let i = 0; i < koRunden.length; i++) {
                if (koRunden[i]._id.toString() === koId) {
                    aktRunde = i;
                    break;
                }
            }
            if (aktRunde === -1) {
                return res.status(404).json({ message: 'KO-Runden-ID ist falsch' });
            } else if (aktRunde > 1) {
                for (let i = 0; i < koRunden[aktRunde].koSpiele.length; i++) {
                    if (koRunden[aktRunde].koSpiele[i]._id.toString() === spielId) {
                        spielNr = i + 1;
                        break;
                    }
                }
    
                if (spielNr === -1) {
                    return res.status(404).json({ message: 'Spiel-ID ist falsch' });
                } else if (spielNr % 2 === 0) {
                    // gerade
                    update2Obj.team2 = winner;
                    nextGameNr = spielNr / 2;
                } else {
                    // ungerade
                    update2Obj.team1 = winner;
                    nextGameNr = Math.ceil(spielNr / 2);
                }
                const spiel2Id = koRunden[aktRunde-1].koSpiele[nextGameNr - 1];
                const updated2Spiel = await Turnier.Spiel.findByIdAndUpdate(
                    spiel2Id,
                    update2Obj,
                    { new: true }
                );
                if (!updated2Spiel) {
                    return res.status(404).json({ message: 'nächstes Spiel nicht gefunden' });
                }
                if (aktRunde === 2){
                  let verlierer;
                  if (punkteGewinner === 1) {
                    verlierer = updatedSpiel.team2;
                } else {
                    verlierer = updatedSpiel.team1;
                }
                const update3Obj = {};
                if (spielNr % 2 === 0) {
                  update3Obj.team2 = verlierer;
                  nextGameNr = 1;
                } else {
                  update3Obj.team1 = verlierer;
                  nextGameNr = 0;
                }
                const spiel3Id = koRunden[aktRunde-2].koSpiele[0];
                const updated2Spiel = await Turnier.Spiel.findByIdAndUpdate(
                    spiel3Id,
                    update3Obj,
                    { new: true }
                );
                }
                res.status(200).json({ updatedSpiel, updated2Spiel });
            } else {
              const finale = await Turnier.Spiel.findById(koRunden[1].koSpiele[0]);
                if(finale.spielStatus === 'completed'){
                res.status(200).json({ message: "Turnier Beendet!" });
                }
            }
          }else{
            return res.status(401).json({ message: 'Sie haben keine Berechtigung Spielergebnisse für dieses Turnier einzutragen' });
          }
        } catch (error) {
            this.handleError(res, 'Fehler beim Aktualisieren des Spiels', error);
        }
    }
 
/**
  // 
  async turnierAnmeldung(req, res) {
    try {
      console.log("Received data:", req.body);
      const turnier = req.body.turnierId;
      const user = req.body.user;
      const aktTurnier = await Turnier.Turnier.findById(turnier);

      const teams = aktTurnier.turnierTeams;
      console.log(teams);
      return res.status(200).json(teams);
      // res.status(200).json(teams);
    } catch (error) {
      this.handleError(res, "Fehler", error);
    }
  }


/**
 * Fügt einen User dem nächsten verfügbaren Team in einem Turnier hinzu.
 *
 * @param {Object} req - Request-Objekt mit der turnierId und userId im Body.
 * @param {Object} res - Das Response-Objekt.
 * @returns {Object} - Das aktualisierte Turnier mit dem zugewiesenen Benutzer im JSON-Format.
 */
    async assignUserToTeam(req, res) {
      try {
        const turnierId = req.body.turnierId;
        const personId = req.body.personId;
    
        // Prüfen, ob die turnierId vorhanden ist.
        if (!turnierId) {
          return res.status(400).json({ message: 'Turnier-ID fehlt in der Anfrage.' });
        }
    
        const aktTurnier = await Turnier.Turnier.findById(turnierId).populate('turnierTeams');
    
        // Prüft, ob das Turnier gefunden wurde.
        if (!aktTurnier) {
          return res.status(404).json({ message: 'Turnier nicht gefunden.' });
        }
    
        // Prüft, ob das Turnier bereits begonnen hat. Wenn ja, kommt die Meldung, dass eine Teilnahme nicht mehr möglich ist.
        if (aktTurnier.turnierStatus === 'BEGONNEN' || aktTurnier.turnierStatus === 'ABGESCHLOSSEN') {
          return res.status(400).json({ message: 'Das Turnier hat bereits begonnen, eine Teilnahme ist nicht mehr möglich.' });
        }
    
        // Zuweisung ins erste Team mit einem offenen Platz. Zuerst wird ein Team komplett gefüllt, danach geht es zum nächsten weiter.
        const aktTeams = aktTurnier.turnierTeams;
    
        for (let i = 0; i < aktTeams.length; i++) {
          if (aktTeams[i].mitglieder.length < aktTeams[i].teamGröße) {
             aktTeams[i].mitglieder.push(personId);
             await aktTeams[i].save();
             return res.status(200).json(aktTurnier);
          }
        }
    
        console.log('personId, turnierId');
         
        // Meldung, falls es keinen freien Platz mehr in einem Team gibt.
        if (!foundTeam) {
          return res.status(400).json({ message: 'Kein freier Platz in den Teams.' });
        }
    
        // Fügt eine Person in die Mitgliederliste eines Teams hinzu und speichert das aktuelle Turnier mit dem aktualisierten Team ab.
        foundTeam.mitglieder.push(personId);
        await aktTurnier.save();    
        await foundTeam.save();
    
        res.status(200).json(aktTurnier);
      } catch (error) {
        this.handleError(res, 'Fehler beim Zuweisen des Nutzers zu einem Team', error);
      }
    }
    
  

/**
 * Hilfsmethode zum Behandeln von Fehlern.
 *
 * @param {Object} res - Das Response-Objekt.
 * @param {string} message - Die Fehlermeldung.
 * @param {Error} error - Das aufgetretene Fehlerobjekt.
 */
  handleError(res, message, error) {
    console.error(message, error);
    res.status(500).json({ message });
  }    

}
module.exports = new TurnierController();
