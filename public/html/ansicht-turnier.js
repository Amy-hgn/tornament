/**
 * Weiterleitung des Benutzers zur Startseite.
 */
function redirectToHomePage () {
    window.location.href = window.location.origin
  }

/**
 * Event-Listener für das DOMContentLoaded-Ereignis. Holt und zeigt Turnierdetails an
 */
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const turnierId = urlParams.get('id');

        const turnierDetails = await fetchTurnierDetails(turnierId);
        // Funktionen zum Anzeigen von Turnierdetails aufrufen
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
 * Teamnamen vom Server abrufen.
 *
 * @param {string} teamId - Die ID des Teams.
 * @returns {Promise<string>} - Ein Promise, das zu einem Teamnamen auflöst.
 */
async function fetchTeam(teamId) {
    const response = await fetch(`/team-ID?id=${teamId}`);
    const team = await response.json();
    return team;
  }

  /**
 * Spielernamen vom Server abrufen.
 *
 * @param {string} personId - Die ID des Spielers.
 * @returns {Promise<string>} - Ein Promise, das zu einem Spielernamen auflöst.
 */
async function fetchPersonName(personId) {
  const response = await fetch(`/person-ID?id=${personId}`);
  const person = await response.json();
  return person.name;
}

/**
 * Turnierdetails anzeigen
 *
 * @param {Object} turnierDetails - Die Details des Turniers.
 */

async function displayTurnierDetails(turnierDetails) {
    document.getElementById('turnier-name').innerText = turnierDetails.turnierName;
    document.getElementById('veranstaltungsort').description = ` ${turnierDetails.veranstaltungsort}`;
    document.getElementById('start-datum').description = ` ${formatiereDatum(turnierDetails.startDatum)}`;
    document.getElementById('anmelde-schluss').description = ` ${formatiereDatum(turnierDetails.endDatum)}`;
    document.getElementById('kosten').description = `${turnierDetails.kosten}`;
    document.getElementById('start-zeit').description = turnierDetails.startZeit + " Uhr";
    document.getElementById('beschreibung').innerText = turnierDetails.beschreibung;
    const anmeldeliste = document.getElementById('anmeldeliste');
    const teams = turnierDetails.turnierTeams;
    let teamDetails = [];
    for (let i = 0; i < teams.length; i++){
      teamDetails.push(await fetchTeam(teams[i]));
      const mitglieder = teamDetails.mitglieder;
      if(typeof mitglieder === 'undefined'){
        const listenelement = document.createElement('sd-list-item');
        listenelement.caption = "Team leer";
        console.log(teamDetails[i].name);
        listenelement.description = teamDetails[i].name;
        anmeldeliste.appendChild(listenelement);
      }else {
      for(let j = 0; j < mitglieder.length; j++){
        const spielerimteam = await fetchPersonName(mitglieder[j]);
        const listenelement = document.createElement('sd-list-item');
        listenelement.caption = spielerimteam.toString();
        listenelement.description = teamDetails.name;
        anmeldeliste.appendChild(listenelement);
      }}
    }

}

function redirectToBaum() {
  const urlParams = new URLSearchParams(window.location.search);
  const turnierId = urlParams.get('id');
  window.location.href = `/turnierbaum-byID?id=${turnierId}`;
}


/*
// Neue Anmeldungen der Liste hinzufügen
function addName(caption, description) {
  var list = document.querySelector('.Anmeldungen');

  var newName = document.createElement('sd-list-item');
  newName.setAttribute('caption', caption);
  newName.setAttribute('description', description);

  list.appendChild(newName);
}
*/

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