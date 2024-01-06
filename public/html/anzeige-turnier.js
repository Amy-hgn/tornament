document.addEventListener("DOMContentLoaded", async function () {
  try {
    const container = document.querySelector("#declarative-example-root");
    const searchInput = container.querySelector("#search-input");
    await fetchRecentTurniere();
    displayMeineTurniereHeading();
    await fetchMeineTurniere();
    displayFreiePlaetzeHeading();
    await fetchFreiePlaetze();
    setupTurnierListClickHandler();
  } catch (error) {
    console.error("Fehler:", error);
  }
});

function redirectToCreateTurnier() {
  window.location.href = "./create-turnier";
}

async function fetchRecentTurniere() {
  try {
    const response = await fetch("/recent-turniere");
    const turniere = await response.json();

    const turnierListe = document.querySelector("sd-list");
    displayTurniere(turniere, turnierListe);
  } catch (error) {
    throw new Error("Fehler beim Abrufen der Turnierliste:" + error);
  }
}
function setupTurnierListClickHandler() {
  const turnierListe = document.querySelector('sd-list');

  turnierListe.addEventListener('click', async (event) => {
    // Stellen Sie sicher, dass ein sd-list-item geklickt wurde
    if (event.target.tagName === 'SD-LIST-ITEM') {
      // Holen Sie die ID des ausgewählten Turniers direkt aus der ID-Eigenschaft des Elements
      const selectedTurnierId = event.target.id;

      // Rufen Sie die Funktion auf, um die Detailseite des ausgewählten Turniers anzuzeigen
      redirectToTurnierDetailPage(selectedTurnierId);
    }
  });
}

// Neue Funktion zum Weiterleiten zur Detailseite des ausgewählten Turniers
function redirectToTurnierDetailPage(turnierId) {

  const detailPageUrl = `/turnier-byID?id=${turnierId}`;

  // Weiterleitung zur Detailseite
  window.location.href = detailPageUrl;
}

function displayMeineTurniereHeading() {
  const turnierListe = document.querySelector("sd-list");
  const meineTurniereHeading = document.createElement("div");
  meineTurniereHeading.classList.add("sd-content-heading");
  meineTurniereHeading.innerText = "Meine Turniere";
  turnierListe.appendChild(meineTurniereHeading);
}

async function getIPAddress() {
  try {
    const response = await fetch("https://ipinfo.io/json");

    // Check if the response status is 429 (Too Many Requests)
    if (response.status === 429) {
      console.warn("Zu viele Anfragen. Verwende lokale IP-Adresse.");
      return "127.0.0.1";
    }

    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Fehler beim Abrufen der IP-Adresse:", error);
    return null;
  }
}

async function fetchMeineTurniere() {
  try {
    const hostname = await getIPAddress();

    const personResponse = await fetch(`/myId?personId=${hostname}`);
    const personData = await personResponse.json();
    if (!personData._id) {
      console.error("Fehler: personData._id ist undefined");
    }
    const response = await fetch(
      `/recent-turniereMaster?turnierMaster=${personData._id}`
    );
    const meineTurniere = await response.json();

    const turnierListe = document.querySelector("sd-list");
    displayTurniere(meineTurniere, turnierListe);
  } catch (error) {
    console.error("Fehler beim Abrufen der Turniere:", error);
  }
}

function displayTurniere(turniere, turnierListe) {
  turniere.forEach((turnier) => {
    const listItem = document.createElement("sd-list-item");
    listItem.caption = turnier.turnierName;
    listItem.id = turnier._id;
    listItem.description = `TurnierID: ${
      turnier.turnierNummer
    } | Veranstaltungsort: ${
      turnier.veranstaltungsort
    } | Anmeldeschluss: ${formatiereDatum(
      turnier.endDatum
    )} | Startdatum: ${formatiereDatum(turnier.startDatum)} `;
    turnierListe.appendChild(listItem);
  });
}
function displayFreiePlaetzeHeading() {
  const turnierListe = document.querySelector("sd-list");
  const freiePlaetzeHeading = document.createElement("div");
  freiePlaetzeHeading.classList.add("sd-content-heading");
  freiePlaetzeHeading.innerText = "Freie Plätze";
  turnierListe.appendChild(freiePlaetzeHeading);
}

function displayDeineSucheHeading(searchTerm) {
  const turnierListe = document.querySelector("sd-list");
  const deineSucheHeading = document.querySelector(".deine-suche-heading");

  // Überprüfen, ob ein Suchbegriff vorhanden ist
  if (searchTerm && searchTerm.trim().length > 0) {
    // Wenn ja, Anzeige aktualisieren oder erstellen
    if (!deineSucheHeading) {
      const heading = document.createElement("div");
      heading.classList.add("sd-content-heading", "deine-suche-heading");
      heading.innerText = "Deine Suche";
      turnierListe.appendChild(heading);
    }
  } else {
    // Wenn nicht, Anzeige entfernen
    if (deineSucheHeading) {
      deineSucheHeading.remove();
    }
  }
}

async function fetchFreiePlaetze() {
  try {
    // Ändern Sie den Fetch-Aufruf für 'freie-turniere'
    const response = await fetch("/freie-turniere");
    const freiePlaetze = await response.json();

    const turnierListe = document.querySelector("sd-list");
    displayTurniere(freiePlaetze, turnierListe);
  } catch (error) {
    throw new Error("Fehler beim Abrufen der freien Plätze:" + error);
  }
}

const searchInput = document.querySelector("#search-input");
let previousSearchTerm = ""; // Hält den vorherigen Suchbegriff
let abortController = null; // Für das Abbrechen von vorherigen Anfragen

function handleSearchInput() {
  const turnierListe = document.querySelector("sd-list");
  const deineSucheHeading = document.querySelector(".deine-suche-heading");

  const createListItem = (turnier) => {
    const listItem = document.createElement("sd-list-item");
    listItem.caption = turnier.turnierName;
    listItem.id= turnier._id
    listItem.description = `TurnierID: ${
      turnier.turnierNummer
    } | Veranstaltungsort: ${
      turnier.veranstaltungsort
    } | Anmeldeschluss: ${formatiereDatum(
      turnier.endDatum
    )} | Startdatum: ${formatiereDatum(turnier.startDatum)} `;
    return listItem;
  };

  const displaySearchResultHeading = (searchTerm) => {
    // Entferne vorhandene "Deine Suche" Überschrift
    if (deineSucheHeading) {
      deineSucheHeading.remove();
    }

    // Falls ein Suchbegriff vorhanden ist, erstelle die Überschrift neu
    if (searchTerm.trim().length > 0) {
      const heading = document.createElement("div");
      heading.classList.add("sd-content-heading", "deine-suche-heading");
      heading.innerText = "Deine Suche";
      turnierListe.insertBefore(heading, turnierListe.firstChild);
    }
  };

  const fetchTurniere = async (searchTerm) => {
    if (abortController) {
      abortController.abort();
    }

    // Erstelle neuen AbortController
    abortController = new AbortController();

    try {
      const response = await fetch(
        `/search-turniere?searchTerm=${searchTerm}`,
        {
          signal: abortController.signal,
        }
      );

      const turniere = await response.json();

      // Leere die bestehende Liste
      turnierListe.innerHTML = "";

      // Zeige "Deine Suche" Überschrift basierend auf dem Suchbegriff
      displaySearchResultHeading(searchTerm);

      // Füge die neuen Turniere hinzu
      turniere.forEach((turnier) => {
        const listItem = createListItem(turnier);
        turnierListe.appendChild(listItem);
      });
    } catch (error) {
      if (error.name === "AbortError") {
        // Ignoriere Abbruchfehler
        console.warn("Aborted:", error.message);
      } else {
        console.error("Fehler beim Abrufen der Turnierliste:", error);
      }
    }
  };

  const search = async () => {
    if (searchInput.value.trim().length === 0) {
      // Wenn die Suche leer ist, zeige die Standardüberschriften an
      displayDefaultHeadings();
      return;
    }

    await fetchTurniere(searchInput.value.trim());
  };

  async function displayDefaultHeadings() {
    location.reload();
  }

  // Suchen, wenn der Benutzer einen Buchstaben loslässt
  searchInput.addEventListener("keyup", async () => {
    await search();
  });
}

function formatiereDatum(datumString) {
  const wochentage = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  const datum = new Date(datumString);
  const tag = datum.getDate().toString().padStart(2, "0");
  const monatsname = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ][datum.getMonth()];
  const jahr = datum.getFullYear();
  const stunde = datum.getHours().toString().padStart(2, "0");
  const minute = datum.getMinutes().toString().padStart(2, "0");

  return `${stunde}:${minute} Uhr ${tag}.${monatsname}.${jahr}`;
}
