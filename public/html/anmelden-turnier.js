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

  const personId = await getIPAddress();
  const myObjekt = { turnierId, person: personId}
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
