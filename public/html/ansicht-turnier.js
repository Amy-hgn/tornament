/**
 * Event-Listener für das DOMContentLoaded-Ereignis. Holt und zeigt Turnierdetails an
 */
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const turnierId = urlParams.get('id');

        const turnierDetails = await fetchTurnierDetails(turnierId);

        // Funktionen zum Anzeigen von Turnierdetails, Ko-Runden und Spielen aufrufen
        displayTurnierDetails(turnierDetails);
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
 * Turnierdetails anzeigen
 *
 * @param {Object} turnierDetails - Die Details des Turniers.
 */

function displayTurnierDetails(turnierDetails) {
    document.getElementById('turnier-name').innerText = turnierDetails.turnierName;
    document.getElementById('veranstaltungsort').innerText = `Veranstaltungsort: ${turnierDetails.veranstaltungsort}`;
    document.getElementById('start-datum').innerText = `Startdatum: ${formatiereDatum(turnierDetails.startDatum)}`;
    document.getElementById('anmelde-schluss').innerText = `Anmeldeschluss: ${formatiereDatum(turnierDetails.anmeldeSchluss)}`;
    document.getElementById('kosten').innerText = `Kosten: ${turnierDetails.kosten}`;
    document.getElementById('start-zeit').innerText = `Startzeit: ${formatiereDatum(turnierDetails.startZeit)}`;
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