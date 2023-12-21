function sucheTurniere(suchbegriff) {
    // Stellen Sie sicher, dass ein Suchbegriff vorhanden ist
    if (!suchbegriff) {
      console.error("Bitte gib einen Suchbegriff ein.");
      return;
    }
  
    // Ersetzen Sie "https://turniersystem.onrender.com" durch die tatsächliche URL Ihres Servers
    const apiUrl = `/turniere?suchbegriff=${suchbegriff}`;
  
    // Senden Sie die Anfrage an den Server
    fetch(apiUrl)
      .then(response => response.json())
      .then(turniere => {
        // Hier können Sie die gefundenen Turniere verwenden oder anzeigen
        console.log("Gefundene Turniere:", turniere);
        // Rufen Sie hier eine Funktion auf, um die Ergebnisse anzuzeigen
        zeigeTurniereAn(turniere);
      })
      .catch(error => console.error('Fehler bei der Turniersuche:', error));
  }
  
  function zeigeTurniereAn(turniere) {
    // Hier können Sie den Code hinzufügen, um die gefundenen Turniere in Ihrer Anwendung anzuzeigen
    // Zum Beispiel: fügen Sie sie zu einer Liste auf der Benutzeroberfläche hinzu
    console.log("Zeige Turniere an:", turniere);
  }
  
  // Beispielaufruf der Funktion mit einem Suchbegriff
  const suchbegriff = "Beispiel"; // Ersetzen Sie dies durch den tatsächlichen Suchbegriff
  sucheTurniere(suchbegriff);
  