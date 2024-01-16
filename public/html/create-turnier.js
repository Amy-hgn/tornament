/**
 * Weiterleitung des Benutzers zur Startseite.
 */
function redirectToHomePage () {
  window.location.href = window.location.origin
}
/**
 * Aktualisierung der Seite.
 */
function reloadPage () {
  window.location.reload()
}
/**
 * Überprüfung, ob alle Felder in einem Formular ausgefüllt sind.
 *
 * @returns {boolean} - True, wenn alle Felder ausgefüllt sind, sonst false.
 */
function validateForm () {
  const inputs = document.querySelectorAll('.example-container sd-lit-input')

  for (const input of inputs) {
    if (!input.value) {
      alert('Bitte füllen Sie alle Felder aus.')
      return false
    }
  }

  return true
}
/**
 * Erstellung eines Turniers unter Verwendung von eingegebenen Daten und API-Aufrufen.
 */
async function createTurnier () {
  const platzierungen = await createPlatzierungen(leseTeamAnzahlWert())
  const teamIDs = await createTeams()
  const koRunden = await generateKORunden(teamIDs)
  // Nächste Turniernummer abrufen
  const highestTurnierNummerResponse = await fetch('/turniernummer')
  const highestTurnierNummerData = await highestTurnierNummerResponse.json()
  const nextTurnierNummer = highestTurnierNummerData.highestTurnierNummer + 1

  //TODO solange keine Smartwe ID
  const hostname = await getIPAddress()

  let master = await fetch(`/myId?personId=${hostname}`)
  const isMaster = await master.json()
  console.log(isMaster)

  if (Object.keys(isMaster).length === 0) {
    // JSON-Body ist leer, also createPerson() aufrufen
    master = await createPerson(hostname)
  } else {
    // JSON-Body enthält Daten, also master auf _id setzen
    console.log(isMaster)
    master = isMaster._id
  }

  const tournamentData = {
    turnierNummer: nextTurnierNummer,
    turnierMaster: master,
    turnierName: document.getElementById('turnierName').value,
    startDatum: document.getElementById('startDatum').value,
    endDatum: document.getElementById('endDatum').value,
    beschreibung: document.getElementById('beschreibung').value,
    veranstaltungsort: document.getElementById('veranstaltungsort').value,
    startZeit: document.getElementById('startZeit').value,
    kosten: document.getElementById('kosten').value,
    //TODO Solange die Smartwe-ID noch nicht, verfügbar ist, wird die IP-Adresse des Hosts als Wert für turnierMaster verwendet.
    turnierTeilnehmerAnzahl: leseTeamAnzahlWert() * 2,
    turnierPlatzierungen: platzierungen,
    turnierTeams: teamIDs,
    koRunden: koRunden
  }

  try {
    const response = await fetch('/api/create-turnier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tournamentData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Turnier erstellt:', data)
    alert('Turnier erfolgreich erstellt!')
    redirectToHomePage()
    return false
  } catch (error) {
    console.error('Fehler beim Senden der Daten:', error)
    alert('Fehler beim Erstellen des Turniers. Bitte versuche es erneut.')
  }
}
/**
 * Generierung der K.O.-Runden für ein Turnier basierend auf den Team-IDs.
 *
 * @param {Array<string>} teamIDs - Die IDs der Teams im Turnier.
 * @returns {Array<string>} - Die IDs der erstellten K.O.-Runden.
 */
async function generateKORunden (teamIDs) {
  const koRunden = []
  var teamKnoten = []
  var teamKnoten2 = []
  let remainingTeams = teamIDs.slice()

  // Anzahl der KO-Runden berechnen
  const koRundenAnzahl = Math.ceil(Math.log2(teamIDs.length)) + 1

  for (let i = koRundenAnzahl; i >= 1; i--) {
    const spiele = []

    if (i === 1) {
      for (let j = 1; j <= teamIDs.length / 2; j++) {
        const spielData = {
          team1: remainingTeams.shift(),
          team2: remainingTeams.shift(),
          nächstesSpiel: teamKnoten[Math.ceil(j / 2) - 1]
        }

        const spiel = await createSpiel(spielData)
        spiele.push(spiel._id)
      }
    } else if (koRundenAnzahl - i === 0 || koRundenAnzahl - i === 1) {
      const spielData = {}

      const spiel = await createSpiel(spielData)
      spiele.push(spiel._id)
      teamKnoten.push(spiel._id)
    } else {
      for (let j = 1; j <= Math.pow(2, koRundenAnzahl - i - 1); j++) {
        if (koRundenAnzahl - i === 2) {
          const spielData = {
            nächstesSpiel: [teamKnoten[0], teamKnoten[1]]
          }
          const spiel = await createSpiel(spielData)
          spiele.push(spiel._id)
          teamKnoten2.push(spiel._id)
        } else {
          const spielData = {
            nächstesSpiel: teamKnoten[Math.ceil(j / 2) - 1]
          }
          const spiel = await createSpiel(spielData)
          spiele.push(spiel._id)
          teamKnoten2.push(spiel._id)
        }
      }
      teamKnoten = teamKnoten2
      teamKnoten2 = []
    }

    // Erstelle die KO-Runde mit den erstellten Spielen
    const koRundeData = {
      koSpiele: spiele,
      tiefe: i
    }

    const koRunde = await createKORunde(koRundeData)
    koRunden.push(koRunde._id)
  }

  return koRunden
}
/**
 * Erstellung eines Spielobjekts mit den angegebenen Spielinformationen.
 *
 * @param {Object} spielData - Die Informationen für das Spiel.
 * @returns {Object} - Das erstellte Spielobjekt.
 */
async function createSpiel (spielData) {
  try {
    const response = await fetch('/api/create-spiel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spielData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    if (!data._id) {
      throw new Error('Spiel wurde nicht erfolgreich erstellt.')
    }

    console.log('Spiel erstellt:', data)
    return data
  } catch (error) {
    console.error('Fehler beim Erstellen des Spiels:', error)
    alert('Fehler beim Erstellen des Spiels. Bitte versuche es erneut.')
  }
}
/**
 * Erstellung einer K.O.-Runde mit den angegebenen Informationen.
 *
 * @param {Object} koRundeData - Die Informationen für die K.O.-Runde.
 * @returns {Object} - Das erstellte K.O.-Rundenobjekt.
 */
async function createKORunde (koRundeData) {
  try {
    const response = await fetch('/api/create-ko-runde', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(koRundeData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('KO-Runde erstellt:', data)
    return data
  } catch (error) {
    console.error('Fehler beim Erstellen der KO-Runde:', error)
    alert('Fehler beim Erstellen des Turniers. Bitte versuche es erneut.')
  }
}
/**
 * Erstellung von Platzierungen für die angegebene Anzahl von Teilnehmern.
 *
 * @param {number} teilnehmerAnzahl - Die Anzahl der Teilnehmer im Turnier.
 * @returns {Array<string>} - Die IDs der erstellten Platzierungen.
 */
async function createPlatzierungen (teilnehmerAnzahl) {
  const platzierungen = []

  for (let i = 1; i <= teilnehmerAnzahl; i++) {
    const platzierungDaten = {
      platz: i
    }
    try {
      const response = await fetch('/api/create-platzierung', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(platzierungDaten)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Platzierung erstellt:', data)
      platzierungen.push(data._id)
    } catch (error) {
      console.error('Fehler beim Senden der Daten:', error)
      alert('Fehler beim Erstellen des Turniers. Bitte versuche es erneut.')
    }
  }

  return platzierungen
}
/**
 * Erstellung einer Person (Turnier-Master) basierend auf der IP-Adresse.
 *
 * @param {string} id - Die ID der Person (IP-Adresse).
 * @returns {string} - Die ID der erstellten Person.
 */
async function createPerson (id) {
  const personData = {
    personId: id,
    name: window.location.hostname
  }

  try {
    const response = await fetch('/api/create-person', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(personData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Person erstellt:', data)
    const person = data._id
    return person
  } catch (error) {
    console.error('Fehler beim Senden der Daten:', error)
    alert('Fehler beim Erstellen des Turniers. Bitte versuche es erneut.')
  }
}
/**
 * Generierung der Input-Felder für die Teamnamen basierend auf der ausgewählten Teamanzahl.
 */
function generiereTeamInputFelder () {
  // Hole das ausgewählte Team-Anzahl-Element
  var teamAnzahlElement = leseTeamAnzahlWert()

  // Überprüfe, ob das Element existiert
  if (teamAnzahlElement) {
    // Hole den ausgewählten Wert
    var ausgewaehlteAnzahl = parseInt(teamAnzahlElement)

    // Hole das Container-Element, in dem die Input-Felder erstellt werden sollen
    var containerElement = document.getElementById('basic-examples-container')

    // Erstelle neue Input-Felder basierend auf der ausgewählten Anzahl
    for (var i = 1; i <= ausgewaehlteAnzahl; i++) {
      var inputElement = document.createElement('sd-lit-input')
      inputElement.id = 'team' + i
      inputElement.type = 'text'
      inputElement.name = 'team' + i
      inputElement.currentText = 'Team ' + i

      // Füge das Input-Feld dem Container hinzu
      containerElement.appendChild(inputElement)
    }
  }
}
/**
 * Erstellung von Teams basierend auf den eingegebenen Teamnamen.
 *
 * @returns {Array<string>} - Die IDs der erstellten Teams.
 */
async function createTeams () {
  const teamInputContainer = document.getElementById('basic-examples-container')
  const teamNameInputs = teamInputContainer.querySelectorAll('sd-lit-input')
  const teamNames = Array.from(teamNameInputs).map(input => input.currentText)

  const teams = []

  for (const teamName of teamNames) {
    const teamData = {
      name: teamName
    }

    try {
      const response = await fetch('/api/create-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Team erstellt:', data)
      teams.push(data._id)
    } catch (error) {
      console.error('Fehler beim Erstellen des Teams:', error)
      alert('Fehler beim Erstellen des Turniers. Bitte versuche es erneut.')
    }
  }

  return teams
}

/**
 * Einreichung des Formulars nach Validierung.
 */
function submitForm () {
  if (validateForm()) {
    createTurnier()
  }
}

/**
 * Lesen des Werts der ausgewählten Teamanzahl aus der Combo-Box.
 *
 * @returns {string} - Der ausgewählte Wert der Teamanzahl.
 */
function leseTeamAnzahlWert () {
  // Hole das sd-combo-box-Element
  var comboBoxElement = document.querySelector('sd-combo-box[label="Teams"]')
    .comboBoxValue.item.caption

  return comboBoxElement
}
/**
 * Event-Listener für die Änderung der Teamanzahl-Auswahl.
 */
document.addEventListener('DOMContentLoaded', function () {
  // Hole das sd-combo-box-Element
  var comboBoxElement = document.querySelector('sd-combo-box[label="Teams"]')

  // Überprüfe, ob das Element existiert, bevor ein Event-Listener hinzugefügt wird
  if (comboBoxElement) {
    // Füge den Event-Listener hinzu, wenn das Element vorhanden ist
    comboBoxElement.addEventListener(
      'selection-change',
      leseComboWert,
      generiereTeamInputFelder
    )
  }
})

/**
 * Überprüfung, ob alle Formularfelder gefüllt sind.
 *
 * @returns {boolean} - True, wenn alle Felder gefüllt sind, sonst false.
 */
function sindAlleFelderGefuellt () {
  // Array mit den IDs der Eingabefelder
  var feldIDs = [
    'turnierName',
    'startDatum',
    'endDatum',
    'veranstaltungsort',
    'startZeit',
    'beschreibung',
    'kosten'
  ]

  // Überprüfe jedes Feld
  for (var i = 0; i < feldIDs.length; i++) {
    var feldID = feldIDs[i]
    var feld = document.getElementById(feldID)

    // Überprüfe, ob das Feld gefüllt ist
    if (!feld.value.trim()) {
      // Wenn nicht, zeige eine Meldung und kehre zurück
      alert('Bitte füllen Sie alle Felder aus!')
      return false
    }
  }

  // Wenn alle Felder gefüllt sind, gib true zurück
  return true
}
/**
 * Verstecken der ersten Seite und Anzeigen der zweiten Seite.
 */
function versteckeSeite1 () {
  if (sindAlleFelderGefuellt()) {
    var seite2Element = document.querySelector('.examples')
    if (seite2Element) {
      seite2Element.style.display = 'none'
    }
    zeigeSeite2()
  }
}

/**
 * Anzeigen der ersten Seite.
 */
function zeigeSeite1 () {
  var seite2Element = document.querySelector('.examples')
  if (seite2Element) {
    seite2Element.style.display = 'block'
  }
}
/**
 * Verstecken der zweiten Seite.
 */
function versteckeSeite2 () {
  var seite2Element = document.querySelector('.Seite2')
  if (seite2Element) {
    seite2Element.style.display = 'none'
  }
}
/**
 * Anzeigen der zweiten Seite.
 */
function zeigeSeite2 () {
  var seite2Element = document.querySelector('.Seite2')
  if (seite2Element) {
    seite2Element.style.display = 'block'
  }
}
/**
 * Verstecken der dritten Seite.
 */
function versteckeSeite3 () {
  var seite2Element = document.querySelector('.Seite3')
  if (seite2Element) {
    seite2Element.style.display = 'none'
  }
}
/**
 * Anzeigen der dritten Seite.
 */
function zeigeSeite3 () {
  var seite2Element = document.querySelector('.Seite3')
  if (seite2Element) {
    seite2Element.style.display = 'block'
  }
}
/**
 * Abrufen der IP-Adresse des Benutzers.
 *
 * @returns {Promise<string|null>} - Die IP-Adresse oder null bei einem Fehler.
 */
async function getIPAddress () {
  try {
    const response = await fetch('https://ipinfo.io/json')

    // Check if the response status is 429 (Too Many Requests)
    if (response.status === 429) {
      console.warn('Zu viele Anfragen. Verwende lokale IP-Adresse.')
      return '127.0.0.1'
    }

    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Fehler beim Abrufen der IP-Adresse:', error)
    return null
  }
}

/**
 * Formatieren des Werts einer Eingabe in Währungsformat (zwei Dezimalstellen).
 *
 * @param {HTMLInputElement} input - Das Eingabefeld, dessen Wert formatiert werden soll.
 */
function formatCurrency (input) {
  // Entferne alle Zeichen außer Ziffern, Komma und Punkt
  const cleanedInput = input.value.replace(/[^\d.,]/g, '')

  // Teile den Input in Ganzzahl- und Dezimalteil auf
  const parts = cleanedInput.split(/[.,]/)
  let integerPart = parts[0] || '0'
  let decimalPart = parts[1] || ''

  // Entferne führende Nullen aus dem Ganzzahlteil
  integerPart = integerPart.replace(/^0+/, '')

  // Setze den formatierten Wert ins Eingabefeld ohne Euro-Symbol
  const formattedValue =
    (integerPart || '0') + (decimalPart ? ',' + decimalPart : '')

  // Setze den formatierten Wert ins Eingabefeld mit Euro-Symbol, wenn der Benutzer das Feld verlässt
  input.addEventListener('blur', function () {
    const numberValue = Number(formattedValue.replace(',', '.')) // Konvertiere Komma zu Punkt für toLocaleString
    const formattedCurrency = numberValue.toFixed(2).replace('.', ',') + ' €'

    input.value = formattedCurrency
  })
  return formattedValue
}


document.addEventListener('DOMContentLoaded', function () {
  const startDatumInput = document.getElementById('startDatum');
  const endDatumInput = document.getElementById('endDatum');

  startDatumInput.addEventListener('input', function () {
      checkDate(endDatumInput, startDatumInput);
  });

  endDatumInput.addEventListener('input', function () {
      checkDate(endDatumInput, startDatumInput);
  });
});

function checkDate(endDatumInput, startDatumInput) {
  const startDatumValue = startDatumInput.value.trim();
  const endDatumValue = endDatumInput.value.trim();

  if (startDatumValue !== '' && endDatumValue !== '') {
      const startDatum = new Date(startDatumValue);
      const anmeldeschluss = new Date(endDatumValue);

      if (anmeldeschluss >= startDatum) {
          alert('Der Anmeldeschluss muss vor dem Startdatum liegen.');
          endDatumInput.value = '';  // Setze die Eingabe auf einen leeren String zurück
          endDatumInput.focus();
      }
  }
}
