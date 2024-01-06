document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Annahme: Die Turnier-ID wird aus der URL-Query-Parameter "id" extrahiert
        const urlParams = new URLSearchParams(window.location.search);
        const turnierId = urlParams.get('id');

        // Annahme: Der Server stellt eine API zur Verfügung, um Turnierdetails abzurufen
        const turnierDetails = await fetchTurnierDetails(turnierId);

        // Annahme: Der Server stellt eine API zur Verfügung, um Ko-Runden abzurufen
        const koRundenIds = turnierDetails.koRunden;
        const koRunden = await fetchKoRunden(koRundenIds);

        // Annahme: Für jede Ko-Runde werden die zugehörigen Spiele abgerufen
        for (const koRunde of koRunden) {
            const spieleIds = koRunde.koSpiele;
            const spiele = await fetchSpiele(spieleIds);
            koRunde.spiele = spiele;
        }

        // Funktionen zum Anzeigen von Turnierdetails, Ko-Runden und Spielen aufrufen
        displayTurnierDetails(turnierDetails);
        displayKoRunden(koRunden);
        displaySpiele(spiele);
    } catch (error) {
        console.error("Fehler:", error);
    }
});

async function fetchTurnierDetails(turnierId) {
    // Implementieren Sie die Funktion zum Abrufen von Turnierdetails vom Server
    const response = await fetch(`/turnier-ID?id=${turnierId}`);
    const turnierDetails = await response.json();
    return turnierDetails;
}

async function fetchKoRunden(koRundenIds) {
    // Implementieren Sie die Funktion zum Abrufen von Ko-Runden vom Server
    const koRundenPromises = koRundenIds.map(async (koRundenId) => {
        const response = await fetch(`/koRunde-ID?id=${koRundenId}`);
        return response.json();
    });
    return Promise.all(koRundenPromises);
}

async function fetchSpiele(spieleIds) {
    try {
        const spielePromises = spieleIds.map(async (spielId) => {
            const response = await fetch(`/spiel-ID?id=${spielId}`);
            const spiel = await response.json();

            // Annahme: Der Server stellt eine API zum Abrufen der Team-Namen bereit
            const team1Name = spiel.team1 ? await fetchTeamName(spiel.team1) : 'Noch Offen';
            const team2Name = spiel.team2 ? await fetchTeamName(spiel.team2) : 'Noch Offen';
            // Ersetzen Sie die Team-IDs durch die Team-Namen im Spielobjekt
            return { ...spiel, team1: team1Name, team2: team2Name };
        });

        return Promise.all(spielePromises);
    } catch (error) {
        console.error("Fehler beim Abrufen der Spiele:", error);
        throw error;
    }
}

async function fetchTeamName(teamId) {
    // Implementieren Sie die Funktion zum Abrufen des Team-Namens vom Server
    const response = await fetch(`/team-ID?id=${teamId}`);
    const team = await response.json();
    return team.name;
}

function displayTurnierDetails(turnierDetails) {
    // Implementieren Sie die Funktion zum Anzeigen von Turnierdetails
    document.getElementById('turnier-name').innerText = turnierDetails.turnierName;
    document.getElementById('veranstaltungsort').innerText = `Veranstaltungsort: ${turnierDetails.veranstaltungsort}`;
    document.getElementById('start-datum').innerText = `Startdatum: ${formatiereDatum(turnierDetails.startDatum)}`;
    // Fügen Sie weitere Anzeigeinformationen hinzu
}

function displayKoRunden(koRunden) {
    // Implementieren Sie die Funktion zum Anzeigen von Ko-Runden
    const koRundenContainer = document.getElementById('ko-runden');
    koRunden.forEach(koRunde => {
        const koRundeElement = document.createElement('div');
        koRundeElement.innerText = `KO-Runde ${koRunde.tiefe}`;

        displaySpiele(koRunde.spiele, koRundeElement);

        koRundenContainer.appendChild(koRundeElement);
    });
}

function displaySpiele(spiele, parentElement) {

    spiele.forEach(spiel => {
        const spielElement = document.createElement('div');
        spielElement.innerText = `Spiel zwischen Team ${spiel.team1} und Team ${spiel.team2} - Status: ${spiel.status}`;

        parentElement.appendChild(spielElement);
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
