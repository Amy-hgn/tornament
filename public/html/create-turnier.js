
function formatCurrency(input) {
    input.value = parseFloat(input.value).toFixed(2);
}

function redirectToHomePage() {
    window.location.href = window.location.origin;
}

function reloadPage() {
    window.location.reload();
}

function validateForm() {
    const inputs = document.querySelectorAll('.example-container sd-lit-input');

    for (const input of inputs) {
        if (!input.value) {
            alert('Bitte füllen Sie alle Felder aus.');
            return false;
        }
    }

    return true;
}

async function createTurnier() {
    const teilnehmerAnzahl = 8;

    // Platzierungen erstellen
    const platzierungen = await createPlatzierungen(teilnehmerAnzahl);

    // Nächste Turniernummer abrufen
    const highestTurnierNummerResponse = await fetch("/turniernummer");
    const highestTurnierNummerData = await highestTurnierNummerResponse.json();
    const nextTurnierNummer = highestTurnierNummerData.highestTurnierNummer + 1;

    //TODO solange keine Smartwe ID
    const hostname = await getIPAddress();

    let master = await fetch(`/person?personId=${hostname}`);
    const isMaster = await master.json();
    console.log(isMaster)

    if (isMaster.person._id === null || isMaster.person.length === 0) {
        // JSON-Body ist leer, also createPerson() aufrufen
        master = await createPerson(hostname);
    } else {
        // JSON-Body enthält Daten, also master auf _id setzen
        console.log(isMaster);
        master = isMaster.person[0]._id;
    }


        const tournamentData = {
        turnierNummer: nextTurnierNummer,
        turnierMaster: master,
        turnierName: document.getElementById("turnierName").value,
        startDatum: document.getElementById("startDatum").value,
        endDatum: document.getElementById("endDatum").value,
        veranstaltungsort: document.getElementById("veranstaltungsort").value,
        startZeit: document.getElementById("startZeit").value,
        kosten: document.getElementById("kosten").value,
        //TODO Solange die Smartwe-ID noch nicht, verfügbar ist, wird die IP-Adresse des Hosts als Wert für turnierMaster verwendet.
        turnierTeilnehmerAnzahl: teilnehmerAnzahl,
        turnierPlatzierungen: platzierungen
        
    };

    try {
        const response = await fetch("/api/create-turnier", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tournamentData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Turnier erstellt:", data);
        alert("Turnier erfolgreich erstellt!");
        return false;
    } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
        alert("Fehler beim Erstellen des Turniers. Bitte versuche es erneut.");
    }
}

async function createPlatzierungen(teilnehmerAnzahl) {
    const platzierungen = [];

    for (let i = 1; i <= teilnehmerAnzahl; i++) {
        
        
        const platzierungDaten ={
            platz:  i
        }
        try {
            const response = await fetch("/api/create-platzierung", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(platzierungDaten),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Platzierung erstellt:", data);
            platzierungen.push(data._id)
            
        } catch (error) {
            console.error("Fehler beim Senden der Daten:", error);
            alert("Fehler beim Erstellen des Turniers. Bitte versuche es erneut.");
        }

    }

    return platzierungen;
}

async function createPerson(id) {
  
    
    const personData = {
        personId: id,
        name: window.location.hostname
    }

        try {
            const response = await fetch("/api/create-person", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(personData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Person erstellt:", data);
            const person = data._id;
            return person;
        } catch (error) {
            console.error("Fehler beim Senden der Daten:", error);
            alert("Fehler beim Erstellen des Turniers. Bitte versuche es erneut.");
        }
    }


    function generiereTeamInputFelder() {
        // Hole das ausgewählte Team-Anzahl-Element
        var teamAnzahlElement = document.querySelector('sd-combo-box[label="Teams"]');
    
        // Überprüfe, ob das Element existiert
        if (teamAnzahlElement) {
            // Hole den ausgewählten Wert
            var ausgewaehlteAnzahl = parseInt(teamAnzahlElement.value, 10);
    
            // Hole das Container-Element, in dem die Input-Felder erstellt werden sollen
            var containerElement = document.getElementById('basic-examples-container');
    
            // Lösche vorhandene Elemente im Container
            containerElement.innerHTML = '';
    
            // Erstelle neue Input-Felder basierend auf der ausgewählten Anzahl
            for (var i = 1; i <= ausgewaehlteAnzahl; i++) {
                var inputElement = document.createElement('sd-lit-input');
                inputElement.id = 'team' + i;
                inputElement.type = 'text';
                inputElement.name = 'team' + i;
                inputElement.currentText = 'Team' + i;
    
                // Füge das Input-Feld dem Container hinzu
                containerElement.appendChild(inputElement);
            }
        }
    }
    
    // Rufe die Funktion auf, wenn sich die Auswahl ändert
function submitForm() {
    if (validateForm()) {
        createTurnier();
    }
}

// Funktion, um den Wert des Combo-Box-Elements zu extrahieren
function leseComboWert() {
    // Hole das sd-combo-box-Element
    var comboBoxElement = document.querySelector('sd-combo-box[label="Teams"]');

    // Überprüfe, ob das Element existiert
    if (comboBoxElement) {
        // Hole den Wert aus dem ComboBoxValue-Attribut
        var comboBoxValue = comboBoxElement.comboBoxValue;

        // Überprüfe, ob ein Wert ausgewählt wurde
        if (comboBoxValue) {
            // Hier kannst du auf die Informationen zugreifen
            console.log('Index:', comboBoxValue.index);
            console.log('Ausgewählter Wert:', comboBoxValue.value);
            console.log('Ganzer Datensatz:', comboBoxValue.item.caption);
        } else {
            console.log('Kein Wert ausgewählt.');
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Hole das sd-combo-box-Element
    var comboBoxElement = document.querySelector('sd-combo-box[label="Teams"]');

    // Überprüfe, ob das Element existiert, bevor ein Event-Listener hinzugefügt wird
    if (comboBoxElement) {
        // Füge den Event-Listener hinzu, wenn das Element vorhanden ist
        comboBoxElement.addEventListener('selection-change', leseComboWert,generiereTeamInputFelder);
    }
});

function sindAlleFelderGefuellt() {
    // Array mit den IDs der Eingabefelder
    var feldIDs = ["turnierName", "startDatum", "endDatum", "veranstaltungsort", "startZeit", "kosten"];

    // Überprüfe jedes Feld
    for (var i = 0; i < feldIDs.length; i++) {
        var feldID = feldIDs[i];
        var feld = document.getElementById(feldID);

        // Überprüfe, ob das Feld gefüllt ist
        if (!feld.value.trim()) {
            // Wenn nicht, zeige eine Meldung und kehre zurück
            alert("Bitte füllen Sie alle Felder aus!");
            return false;
        }
    }

    // Wenn alle Felder gefüllt sind, gib true zurück
    return true;
}

function versteckeSeite1() {
    
    if (sindAlleFelderGefuellt()){var seite2Element = document.querySelector('.examples');
    if (seite2Element) {
        seite2Element.style.display = 'none';
    }
    zeigeSeite2();
}}

function zeigeSeite1() {
    var seite2Element = document.querySelector('.examples');
    if (seite2Element) {
        seite2Element.style.display = 'block';
    }
}

function versteckeSeite2() {
    var seite2Element = document.querySelector('.Seite2');
    if (seite2Element) {
        seite2Element.style.display = 'none';
    }
}

function zeigeSeite2() {
    var seite2Element = document.querySelector('.Seite2');
    if (seite2Element) {
        seite2Element.style.display = 'block';
    }
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
