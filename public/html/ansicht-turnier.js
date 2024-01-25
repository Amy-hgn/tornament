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
        const tm = await fetchPersonName(turnierDetails.turnierMaster);
        if (tm === tm){
          loeschTaste(turnierId);
        }
        
       //if (new Date(turnierDetails.endDatum) < currentDate) {
          getRanking(turnierDetails);
        //}
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
 * Team vom Server abrufen.
 *
 * @param {string} teamId - Die ID des Teams.
 * @returns {Promise<string>} - Ein Promise, das zu einem Team auflöst.
 */
async function fetchTeam(teamId) {
    const response = await fetch(`/team-ID?id=${teamId}`);
    const team = await response.json();
    return team;
  }
  /**
 * Platzierung vom Server abrufen.
 *
 * @param {string} plId - Die ID der Platzierung.
 * @returns {Promise<string>} - Ein Promise, das zu einer Platzierung auflöst.
 */
  async function fetchPlatz(plId) {
    const response = await fetch(`/platzierung-ID?id=${plId}`);
    const platzier = await response.json();
    return platzier.platz;
  }

  /**
 * Spielernamen vom Server abrufen.
 *
 * @param {string} personId - Die ID des Spielers.
 * @returns {Promise<string>} - Ein Promise, das zu einem Spielernamen auflöst.
 */
async function fetchPersonName(personId) {
  const response = await fetch(`/person?personId=${personId}`);
  const person = await response.json();
  let Name = person.name
  return Name;
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
    for (let i = 0; i < teams.length; i++) {
      const teamDetails = await fetchTeam(teams[i]);
      const mitglieder = teamDetails.mitglieder;
    
      // Überprüfe, ob das Team Mitglieder hat
      if (mitglieder && mitglieder.length > 0) {
        for (let j = 0; j < mitglieder.length; j++) {
          let spielerimteam = await fetchPersonName(mitglieder[j]);
          const listenelement = document.createElement('sd-list-item');
          listenelement.caption = spielerimteam;
          listenelement.description = "Im Team: " + teamDetails.name;
          anmeldeliste.appendChild(listenelement);
        }
      }
    }

}
/**
 * LöschTaste erzeugen und turnier-löschung
 * @param {string} turnierId 
 */
async function loeschTaste(turnierId){
    const infoliste = document.getElementById('infoliste');
      const delDiv = document.createElement('div');
        const delbutton = document.createElement('sd-button');
          delbutton.addEventListener('click', function() {
              delDiv.innerHTML = "";
              const delSubmitText = document.createElement('span');
              delSubmitText.innerText = 'Eingeben: LÖSCHEN  ';
              const delInput = document.createElement('input');
              delInput.type = 'text';
              delInput.placeholder = 'LÖSCHEN';
              const delSubmit = document.createElement('button');
              delSubmit.textContent = 'Bestätigen';
              delSubmit.addEventListener('click', async function() {
                if(delInput.value === 'LÖSCHEN' || delInput.value === 'DELETE'){
                  const delturnier = { turnierId };
                try {
                const response = await fetch("/api/delete-turnier", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(delturnier),
                });
                if(response.status === 200){console.log("Turnier gelöscht:", response);
                redirectToHomePage();
                alert("Turniers gelöscht");
                }else{alert("Fehler", response.message);}
                  }catch (error) {
                    console.error("Fehler beim Löschen des Turniers:", error);
                    alert("Fehler beim Löschen des Turniers");
                  }
                }
              });
              delDiv.appendChild(delSubmitText);
              delDiv.appendChild(delInput);
              delDiv.appendChild(delSubmit);
              infoliste.appendChild(delDiv);
          });
          const delText = document.createElement('span');
          delText.innerText = 'Turnier Löschen';
          delText.style.color = 'red';
          delbutton.appendChild(delText);
          delDiv.appendChild(delbutton);
          infoliste.appendChild(delDiv);
}
/** Falls Turnier vorbei, top 3 anzeigen lassen
 * 
 * @param {Object} turnierDetails 
 */
async function getRanking(turnierDetails){
  let top = [];
  top[0] = 'Platzierungen:';
  for (const teamId of turnierDetails.turnierTeams) {
    const teamDetails = await fetchTeam(teamId);
    if(teamDetails.teamPlatzierungen){
      const platz = await fetchPlatz(teamDetails.teamPlatzierungen);
      top[platz] = teamDetails.name;
    }
  }
  if(top[1] && top[2] && top[3]){
  const infoliste = document.getElementById('infoliste');
  for(let i = 0; i<4; i++){
          const listenelement = document.createElement('sd-list-item');
          listenelement.caption = top[i];
    	    if(i>0){
          listenelement.description = "Platz " + i;}
          infoliste.appendChild(listenelement);
  }
  }
}

function redirectToBaum() {
  const urlParams = new URLSearchParams(window.location.search);
  const turnierId = urlParams.get('id');
  window.location.href = `/turnierbaum-byID?id=${turnierId}`;
}

/**
 * Abrufen der IP-Adresse des Benutzers.
 *
 * @returns {Promise<string|null>} - Die IP-Adresse oder null bei einem Fehler.
 */
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