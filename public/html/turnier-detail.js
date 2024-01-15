/**
 * Event-Listener für das DOMContentLoaded-Ereignis. Holt und zeigt Turnierdetails, KO-Runden und Spiele an.
 */
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const turnierId = urlParams.get('id');

        const turnierDetails = await fetchTurnierDetails(turnierId);

        const koRundenIds = turnierDetails.koRunden;
        const koRunden = await fetchKoRunden(koRundenIds);

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
/**
 * Holt Turnierdetails vom Server.
 *
 * @param {string} turnierId - Die ID des Turniers.
 * @returns {Promise<Object>} - Ein Promise, das zu den Turnierdetails auflöst.
 */
async function fetchTurnierDetails(turnierId) {
    const response = await fetch(`/turnier-ID?id=${turnierId}`);
    const turnierDetails = await response.json();
    return turnierDetails;
}
/**
 * Holt KO-Runden vom Server basierend auf ihren IDs.
 *
 * @param {Array<string>} koRundenIds - Ein Array von KO-Runden-IDs.
 * @returns {Promise<Array<Object>>} - Ein Promise, das zu einem Array von KO-Runden auflöst.
 */
async function fetchKoRunden(koRundenIds) {
    const koRundenPromises = koRundenIds.map(async (koRundenId) => {
        const response = await fetch(`/koRunde-ID?id=${koRundenId}`);
        return response.json();
    });
    return Promise.all(koRundenPromises);
}
/**
 * Spiele vom Server abrufen und Teamnamen ersetzen.
 *
 * @param {Array<string>} spieleIds - Ein Array von Spiel-IDs.
 * @returns {Promise<Array<Object>>} - Ein Promise, das zu einem Array von Spielen auflöst.
 */
async function fetchSpiele(spieleIds) {
    try {
        const spielePromises = spieleIds.map(async (spielId) => {
            const response = await fetch(`/spiel-ID?id=${spielId}`);
            const spiel = await response.json();

            const team1Name = spiel.team1 ? await fetchTeamName(spiel.team1) : 'Noch Offen';
            const team2Name = spiel.team2 ? await fetchTeamName(spiel.team2) : 'Noch Offen';
            return { ...spiel, team1: team1Name, team2: team2Name };
        });

        return Promise.all(spielePromises);
    } catch (error) {
        console.error("Fehler beim Abrufen der Spiele:", error);
        throw error;
    }
}
/**
 * Teamnamen vom Server abrufen.
 *
 * @param {string} teamId - Die ID des Teams.
 * @returns {Promise<string>} - Ein Promise, das zu einem Teamnamen auflöst.
 */
async function fetchTeamName(teamId) {
    const response = await fetch(`/team-ID?id=${teamId}`);
    const team = await response.json();
    return team.name;
}
/**
 * Turnierdetails auf der Webseite anzeigen.
 *
 * @param {Object} turnierDetails - Die Details des Turniers.
 */

function displayTurnierDetails(turnierDetails) {
    document.getElementById('turnier-name').innerText = turnierDetails.turnierName;
    document.getElementById('veranstaltungsort').innerText = `Veranstaltungsort: ${turnierDetails.veranstaltungsort}`;
    document.getElementById('start-datum').innerText = `Startdatum: ${formatiereDatum(turnierDetails.startDatum)}`;
}
/**
 * KO-Runden auf der Webseite anzeigen.
 *
 * @param {Array<Object>} koRunden - Ein Array von KO-Runden.
 */
function displayKoRunden(koRunden) {
    const koRundenContainer = document.getElementById('ko-runden');
    koRunden.forEach(koRunde => {
        const koRundeElement = document.createElement('div');
        koRundeElement.innerText = `KO-Runde ${koRunde.tiefe}`;
        // Anzeigen der Spiele für jede KO-Runde
        displaySpiele(koRunde.spiele, koRundeElement);

        koRundenContainer.appendChild(koRundeElement);
    });
}
/**
 * Spiele auf der Webseite anzeigen.
 *
 * @param {Array<Object>} spiele - Ein Array von Spielen.
 * @param {HTMLElement} parentElement - Das übergeordnete HTML-Element, in dem die Spiele angezeigt werden sollen.
 */
function displaySpiele(spiele, parentElement) {

    spiele.forEach(spiel => {
        const spielElement = document.createElement('div');
        spielElement.innerText = `Spiel zwischen Team ${spiel.team1} und Team ${spiel.team2} - Status: ${spiel.spielStatus}`;

        parentElement.appendChild(spielElement);
    });
}
/**
 * Formatieren eines Datums in ein benutzerfreundliches Format.
 *
 * @param {string} datumString - Das zu formatierende Datum im String-Format.
 * @returns {string} - Das formatierte Datum.
 */
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
