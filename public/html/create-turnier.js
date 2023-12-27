function redirectToHomePage () {
  window.location.href = window.location.origin
}

function reloadPage () {
  window.location.reload()
}

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

async function createTurnier () {
  const teilnehmerAnzahl = 8

  // Platzierungen erstellen
  const platzierungen = await createPlatzierungen(teilnehmerAnzahl)

  // Nächste Turniernummer abrufen
  const highestTurnierNummerResponse = await fetch('/turniernummer')
  const highestTurnierNummerData = await highestTurnierNummerResponse.json()
  const nextTurnierNummer = highestTurnierNummerData.highestTurnierNummer + 1

  //TODO solange keine Smartwe ID
  const hostname = await getIPAddress()

  let master = await fetch(`/person?personId=${hostname}`)
  const isMaster = await master.json()
  console.log(isMaster)

  if (isMaster.person._id === null || isMaster.person.length === 0) {
    // JSON-Body ist leer, also createPerson() aufrufen
    master = await createPerson(hostname)
  } else {
    // JSON-Body enthält Daten, also master auf _id setzen
    console.log(isMaster)
    master = isMaster.person[0]._id
  }

  const tournamentData = {
    turnierNummer: nextTurnierNummer,
    turnierMaster: master,
    turnierName: document.getElementById('turnierName').value,
    startDatum: document.getElementById('startDatum').value,
    anmeldeschluss: document.getElementById('anmeldeschluss').value,
    veranstaltungsort: document.getElementById('veranstaltungsort').value,
    startZeit: document.getElementById('startZeit').value,
    kosten: document.getElementById('kosten').value,
    //TODO Solange die Smartwe-ID noch nicht, verfügbar ist, wird die IP-Adresse des Hosts als Wert für turnierMaster verwendet.
    turnierTeilnehmerAnzahl: teilnehmerAnzahl,
    turnierPlatzierungen: platzierungen
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
    return false
  } catch (error) {
    console.error('Fehler beim Senden der Daten:', error)
    alert('Fehler beim Erstellen des Turniers. Bitte versuche es erneut.')
  }
}

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

function submitForm () {
  if (validateForm()) {
    const startDatum = new Date(document.getElementById('startDatum').value)
    const anmeldeschluss = new Date(document.getElementById('anmeldeschluss').value)

    // Überprüfe, ob das Startdatum vor dem Anmeldeschluss liegt
    if (anmeldeschluss >= startDatum) {
      alert('Der Anmeldeschluss muss vor dem Startdatum liegen.')
      return 
    }

    createTurnier()
  }
}
async function getIPAddress () {
  try {
    const response = await fetch('https://ipinfo.io/json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Fehler beim Abrufen der IP-Adresse:', error)
    return null
  }
}
