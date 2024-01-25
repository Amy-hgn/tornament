/**
 * Holt und aktualisiert Benutzerdaten in einem Turnier, auf Grundlage ihrer IP-Adresse.
 *
 * @returns {Promise<void>} - Promise, die keinen Wert zurückgibt, nachdem die Funktion abgeschlossen ist.
 */
async function speichernButtonClick() {
  const urlParams = new URLSearchParams(window.location.search);
  const turnierId = urlParams.get("id");


  const hostname = await getIPAddress()
  let aPerson = await fetch(`/myId?personId=${hostname}`)
  const isAPerson = await aPerson.json()
  console.log(isAPerson)

  if (Object.keys(isAPerson).length === 0) {
    // JSON-Body ist leer, also createPerson() aufrufen
    aPerson = await createPerson(hostname)
  } else {
    // JSON-Body enthält Daten, also master auf _id setzen
    console.log(isAPerson)
    aPerson = isAPerson._id
  }

  const myObjekt = { turnierId, personId: aPerson };
  try {
    const response = await fetch("/api/turnier-anmelden", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myObjekt),
    });

    if (!response.ok) {
      throw new Error(
        `Fehlerhafter Netzwerkantwort-Status: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Daten", data);
    reloadPage();
    console.log("Spiel erfolgreich aktualisiert:", myObjekt);
  } catch (error) {
    console.error("Fehler beim Updaten des Spiels:", error);
  }
}

/**
 * Aktualisierung der Seite.
 */
function reloadPage () {
  window.location.reload()
}

/**
 * Holt die IP-Adresse des Benutzers oder gibt die lokale IP zurück, wenn zu viele Anfragen gestellt wurden.
 *
 * @returns {Promise<string|null>} - Promise, das entweder die IP-Adresse des Benutzers oder die lokale IP-Adresse oder null bei Fehlern enthält.
 */
async function getIPAddress() {
  try {
    const response = await fetch("https://ipinfo.io/json");

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
