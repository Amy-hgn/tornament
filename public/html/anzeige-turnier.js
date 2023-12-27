document.addEventListener("DOMContentLoaded", async function () {
  try {
    const container = document.querySelector("#declarative-example-root");
    await fetchRecentTurniere();
    displayMeineTurniereHeading();
    await fetchMeineTurniere();
    displayFreiePlaetzeHeading();
    await fetchFreiePlaetze();
  } catch (error) {
    console.error('Fehler:', error);
  }
});

function redirectToCreateTurnier() {
  window.location.href = "./create-turnier";
}

async function fetchRecentTurniere() {
  try {
      const response = await fetch("/recent-turniere");
      const turniere = await response.json();

      const turnierListe = document.querySelector('sd-list');
      displayTurniere(turniere, turnierListe);
  } catch (error) {
      throw new Error('Fehler beim Abrufen der Turnierliste:' + error);
  }
}

function displayMeineTurniereHeading() {
  const turnierListe = document.querySelector('sd-list');
  const meineTurniereHeading = document.createElement('div');
  meineTurniereHeading.classList.add('sd-content-heading');
  meineTurniereHeading.innerText = 'Meine Turniere';
  turnierListe.appendChild(meineTurniereHeading);
}

async function getIPAddress() {
  try {
      const response = await fetch("https://ipinfo.io/json");
      const data = await response.json();
      return data.ip;
  } catch (error) {
      console.error("Fehler beim Abrufen der IP-Adresse:", error);
      return null;
  }
}

// Beispielaufruf
getIPAddress().then(ipAddress => {
  console.log("IP-Adresse:", ipAddress);
  // Hier können Sie die IP-Adresse verwenden, wie Sie möchten
});
async function fetchMeineTurniere() {

      
      const hostname = await getIPAddress();

      const personResponse = await fetch(`/myId?personId=${hostname}`);
      const personData = await personResponse.json();
      
      const response = await fetch(`/recent-turniereMaster?turnierMaster=${personData._id}`);
      const meineTurniere = await response.json();

      const turnierListe = document.querySelector('sd-list');
      displayTurniere(meineTurniere, turnierListe);

}


function fetchFreiePlaetze() {

}

function displayTurniere(turniere, turnierListe) {
  turniere.forEach(turnier => {
      const listItem = document.createElement('sd-list-item');
      listItem.caption = turnier.turnierName;
      listItem.description = `Veranstaltungsort: ${turnier.veranstaltungsort} | Anmeldeschluss: ${formatiereDatum(turnier.endDatum)} | Startdatum: ${formatiereDatum(turnier.startDatum)} `;
      turnierListe.appendChild(listItem);
  });
}
function displayFreiePlaetzeHeading() {
  const turnierListe = document.querySelector('sd-list');
  const freiePlaetzeHeading = document.createElement('div');
  freiePlaetzeHeading.classList.add('sd-content-heading');
  freiePlaetzeHeading.innerText = 'Freie Plätze';
  turnierListe.appendChild(freiePlaetzeHeading);
}

async function fetchFreiePlaetze() {
  try {
    // Ändern Sie den Fetch-Aufruf für 'freie-turniere'
    const response = await fetch('/freie-turniere');
    const freiePlaetze = await response.json();

    const turnierListe = document.querySelector('sd-list');
    displayTurniere(freiePlaetze, turnierListe);
  } catch (error) {
      throw new Error('Fehler beim Abrufen der freien Plätze:' + error);
  }}

  
  async function handleSearchInput() {
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');

    const suchbegriff = searchInput.value;

    // Prüfe, ob der Suchbegriff mindestens zwei Zeichen lang ist
    if (suchbegriff.length >= 2) {
      // Rufe die Server-Seite auf, um nach Turnieren zu suchen
      const response = await fetch(`/suche?suchbegriff=${suchbegriff}`);
      const turnierErgebnisse = await response.json();

      // Zeige die Suchergebnisse an (hier musst du die Anzeige-Logik implementieren)
      renderSearchResults(turnierErgebnisse, searchResultsContainer);
    } else {
      // Wenn der Suchbegriff zu kurz ist, leere die Suchergebnisse
      searchResultsContainer.innerHTML = '';
    }
  }
  
    function renderSearchResults(results, container) {
      // Leere den Container zuerst, um vorherige Ergebnisse zu entfernen
      container.innerHTML = '';
    
      // Überprüfe, ob Ergebnisse vorhanden sind
      if (results.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.innerText = 'Keine Ergebnisse gefunden.';
        container.appendChild(noResultsMessage);
      } else {
        // Erstelle für jedes Suchergebnis ein Listenelement und füge es dem Container hinzu
        results.forEach(turnier => {
          const listItem = createListItem(turnier);
          container.appendChild(listItem);
        });
      }
    }
  
    const createListItem = (turnier) => {
      const listItem = document.createElement("sd-list-item");
      listItem.caption = turnier.turnierName;
      listItem.description = `Startdatum: ${formatiereDatum(turnier.startDatum)}, Enddatum: ${formatiereDatum(turnier.endDatum)}, Veranstaltungsort: ${turnier.veranstaltungsort}`;
      return listItem;
    };
    
    function renderSearchResults(results, container) {
      // Leere den Container zuerst, um vorherige Ergebnisse zu entfernen
      container.innerHTML = '';
    
      // Überprüfe, ob Ergebnisse vorhanden sind
      if (results.length === 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.innerText = 'Keine Ergebnisse gefunden.';
        container.appendChild(noResultsMessage);
      } else {
        // Erstelle für jedes Suchergebnis ein Listenelement und füge es dem Container hinzu
        results.forEach(turnier => {
          const listItem = createListItem(turnier);
          container.appendChild(listItem);
        });
      }
    }
    
  function formatiereDatum(datumString) {
    const wochentage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const datum = new Date(datumString);
    const tag = datum.getDate().toString().padStart(2, '0');
    const monatsname = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][datum.getMonth()];
    const jahr = datum.getFullYear();
    const stunde = datum.getHours().toString().padStart(2, '0');
    const minute = datum.getMinutes().toString().padStart(2, '0');
  
    return `${stunde}:${minute} Uhr ${tag}.${monatsname}.${jahr}`;
  }