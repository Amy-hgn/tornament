/*
// Funktion, um den Inhalt einer externen HTML-Datei abzurufen
async function loadHTML(filePath) {
    try {
        const response = await fetch(filePath);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Funktion, um das HTML-Dokument in den gewünschten Bereich einzubinden
async function insertHTML(elementID) {
    const htmlContent = await loadHTML('anmelden-turnier.html');
    document.getElementById(elementID).innerHTML = htmlContent;
}

// HTML-Dokument in den gewünschten Bereich einbinden
insertHTML('anmelden-turnier.html');
*/

/*Verbindung zur Datenbank
const mongoose = require('mongoose');

// Ersetzen Sie die folgende URL durch die tatsächliche URL Ihrer Datenbank
const uri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/test';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Verbindung zur Datenbank hergestellt');
});
*/

document.addEventListener('DOMContentLoaded', function () {
  const anmeldeButton = document.querySelector('.Anmeldebutton sd-button')
  anmeldeButton.addEventListener('click', anmeldeButtonClick)

  async function anmeldeButtonClick () {
    try {
      // Hier die Anmelde-Logik implementieren
      console.log('Anmelde-Button wurde geklickt.')
      speichernButtonClick()
    } catch (error) {
      console.error('Fehler bei der Anmeldung:', error)
    }
  }
})

async function speichernButtonClick () {
  // Kontrolle, ob noch Plätze frei sind

  // Logik für Zuweisung zu Teams (for schleife?)

  // holen aus URL id des turniers raus
  const urlParams = new URLSearchParams(window.location.search)
  const turnierId = urlParams.get('id')

  const user = await getUserID();
  // Speicherung turnierid user in object
  const myObjekt = { turnierId, user }
  try {
    const response = await fetch('/api/turnier-anmelden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myObjekt)
    })

    if (!response.ok) {
      throw new Error(`Fehlerhafter Netzwerkantwort-Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Daten', data)

    console.log('Spiel erfolgreich aktualisiert:', myObjekt)
  } catch (error) {
    console.error('Fehler beim Updaten des Spiels:', error)
  }
  // man schickt es ins backend

  // Anpassung der freien Plätze -> Anbindung ans Frontend
}

async function getUserID() {
    const api = await smartdesign.connect();
    try {
      const userDetails = await api
        .fetch("v7.0/user/self")
        .then((response) => response.json());
      return userDetails.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

//   try {
//     const response = await fetch('https://ipinfo.io/json')

//     // Check if the response status is 429 (Too Many Requests)
//     if (response.status === 429) {
//       console.warn('Zu viele Anfragen. Verwende lokale IP-Adresse.')
//       return '127.0.0.1' // Verwende die lokale IP-Adresse als Ersatz
//     }

//     const data = await response.json()
//     return data.ip
//   } catch (error) {
//     console.error('Fehler beim Abrufen der IP-Adresse:', error)
//     return null
//   }
}
