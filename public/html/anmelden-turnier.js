// Verbindung zur HTML Datei
// Funktion, um den Inhalt einer externen HTML-Datei abzurufen
async function loadHTML(filePath) {
    try {
        const response = await fetch(filePath);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Funktion, um das HTML-Dokument in den gewünschten Bereich einzubinden
async function insertHTML(elementID) {
    const htmlContent = await loadHTML('anmelden-turnier.html');
    document.getElementById(elementID).innerHTML = htmlContent;
}

// HTML-Dokument in den gewünschten Bereich einbinden
insertHTML('declarative-example-root');



// Verbindung zur Datenbank
const mongoose = require('mongoose');

// Ersetzen Sie die folgende URL durch die tatsächliche URL Ihrer Datenbank
const uri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/test';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Verbindung zur Datenbank hergestellt');
});



function speichernButtonClick() {
    // Logik für den "Speichern"-Button 
    console.log("Speichern-Button wurde geklickt.");

    // Kontrolle, ob noch Plätze frei sind

// Logik für Zuweisung zu Teams (for schleife?)

// Anpassung der freien Plätze -> Anbindung ans Frontend
}

