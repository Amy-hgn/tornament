/**
 * Event-Listener für das DOMContentLoaded-Ereignis. Holt und zeigt Turnierdetails, KO-Runden und Spiele an.
 */
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const turnierId = urlParams.get("id");

    const turnierDetails = await fetchTurnierDetails(turnierId);

    const koRundenIds = turnierDetails.koRunden;
    const koRunden = await fetchKoRunden(koRundenIds);

    for (const koRunde of koRunden) {
      const spieleIds = koRunde.koSpiele;
      const spiele = await fetchSpiele(spieleIds);
      koRunde.spiele = spiele;
    }

    // Funktionen zum Anzeigen von Turnierdetails, Ko-Runden und Spielen aufrufen
    // displayTurnierDetails(turnierDetails);
    // displayKoRunden(koRunden);
    createTurnierbaum(koRunden);
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

      const team1Name = spiel.team1
        ? await fetchTeamName(spiel.team1)
        : "Noch Offen";
      const team2Name = spiel.team2
        ? await fetchTeamName(spiel.team2)
        : "Noch Offen";
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

function openOverview(){
  const urlParams = new URLSearchParams(window.location.search);
  const turnierId = urlParams.get("id");
  window.location.href = `/turnier-byID?id=${turnierId}`;
}
}
// /**
//  * Turnierdetails auf der Webseite anzeigen.
//  *
//  * @param {Object} turnierDetails - Die Details des Turniers.
//  */

// function displayTurnierDetails(turnierDetails) {
//   document.getElementById("turnier-name").innerText =
//     turnierDetails.turnierName;
//   document.getElementById(
//     "veranstaltungsort"
//   ).innerText = `Veranstaltungsort: ${turnierDetails.veranstaltungsort}`;
//   document.getElementById(
//     "start-datum"
//   ).innerText = `Startdatum: ${formatiereDatum(turnierDetails.startDatum)}`;
// // }
// /**
//  * KO-Runden auf der Webseite anzeigen.
//  *
//  * @param {Array<Object>} koRunden - Ein Array von KO-Runden.
//  */
// function displayKoRunden(koRunden) {
//   const koRundenContainer = document.getElementById("ko-runden");
//   koRunden.forEach((koRunde) => {
//     const koRundeElement = document.createElement("div");
//     koRundeElement.innerText = `KO-Runde ${koRunde.tiefe}`;
//     // Anzeigen der Spiele für jede KO-Runde

//         displaySpiele(koRunde.spiele, koRundeElement, koRunde._id);

//         koRundenContainer.appendChild(koRundeElement);
//     });
// }

// function displaySpiele(spiele, parentElement, koRundeId) {

//     spiele.forEach(spiel => {
//         const spielElement = document.createElement('div');
//         spielElement.innerText = `Spiel zwischen Team ${spiel.team1} und Team ${spiel.team2} - Status: ${spiel.spielStatus}`;

//         parentElement.appendChild(spielElement);
//     });
// }
async function redirectToSpiel(spiel, koRundeId) {

    const urlParams = new URLSearchParams(window.location.search);
    const turnierId = urlParams.get('id');
    console.log(spiel.ObjectId);
    window.location.href = `/spiel-byID?spiel=${spiel._id}&turnierId=${turnierId}&koRundeId=${koRundeId}`;
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
function createTurnierbaum(koRunden) {
    const turnierbaumElement = document.getElementById('turnierbaum');
    turnierbaumElement.innerHTML = '';

    // Standardhintergrundfarbe
    const defaultBackgroundColor = '#B9D7F5';

    // Erstelle die Runden
    for (let runde = 0; runde < koRunden.length; runde++) {
        const rundenElement = document.createElement('div');
        rundenElement.classList.add('turnierbaum-runde');

        // Holen Sie sich die Spiele für diese Runde aus der KO-Runde
        const spiele = koRunden[runde].spiele;
        const koRundeId= koRunden[runde]._id

        // Erstelle die Spiele für diese Runde
        spiele.forEach((spiel) => {
            const spielElement = document.createElement('div');
            spielElement.classList.add('turnierbaum-spiel');
            spielElement.addEventListener('mouseover', () => {
                spielElement.style.border = '2px solid black';  // Hervorhebung bei Mausüber
                spielElement.style.cursor = 'pointer';  // Ändern des Mauszeigers
            });
        
            spielElement.addEventListener('mouseout', () => {
                spielElement.style.border = 'none';  // Zurücksetzen der Hervorhebung bei Mausaustritt
                spielElement.style.cursor = 'default';  // Zurücksetzen des Mauszeigers
            });
            spielElement.addEventListener('click', () => {
        
                redirectToSpiel(spiel, koRundeId);
            
        });
            // Holen Sie sich die Teamnamen aus dem aktuellen Spielobjekt
            const team1Name = spiel.team1;
            const team2Name = spiel.team2;

            // Füge die Teams hinzu (als Text)
            const team1 = document.createElement('div');
            team1.classList.add('turnierbaum-team');
            team1.textContent = `${team1Name}`;
            team1.style.backgroundColor = spiel.punkteGewinner === 1 ? 'green' : (spiel.punkteGewinner === 2 ? 'red' : defaultBackgroundColor);

            const team2 = document.createElement('div');
            team2.classList.add('turnierbaum-team');
            team2.textContent = `${team2Name}`;
            team2.style.backgroundColor = spiel.punkteGewinner === 2 ? 'green' : (spiel.punkteGewinner === 1 ? 'red' : defaultBackgroundColor);

            spielElement.appendChild(team1);
            spielElement.appendChild(team2);

            rundenElement.appendChild(spielElement);
        });

        // Füge die Runden-Texte außerhalb der turnierbaum-runde Klasse hinzu
        const rundenText = document.createElement('div');
        rundenText.classList.add('runden-text');
        if (runde === 0) {
            rundenText.textContent = 'Spiel um Platz 1';
        } else if (runde === 1) {
            rundenText.textContent = 'Spiel um Platz 3';
        } else {
            rundenText.textContent = `Runde ${koRunden.length-runde}`;
        }

        turnierbaumElement.appendChild(rundenText);
        turnierbaumElement.appendChild(rundenElement);
    }
}
