
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>');

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;


const { validateForm, createTurnier } = require('../html/create-turnier');

// Mock-Funktion für fetch
global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

// Mock-Funktion für window.location
delete global.window.location;
global.window.location = new URL('http://localhost:3000');

describe('create-turnier', () => {
  beforeEach(() => {
    // Setze einen einfachen DOM für jeden Test
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <title>Turnier erstellen</title>
      </head>
      <body>
        <div id="declarative-example-root"></div>
        <div class="examples">
        </div>
        <script src="./create-turnier.js"></script>
      </body>
      </html>
    `);

    global.document = dom.window.document;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('validateForm returns true when all fields are filled', () => {

    document.body.innerHTML = `
      <div class="example-container">
        <sd-lit-input id="turnierName" type="text" name="turnierName" required placeholder="Fußballturnier Controlling">TestTurnier</sd-lit-input>
      </div>
      <div class="parent-container">
        <sd-button type="submit" primary onclick="submitForm()">Turnier erstellen</sd-button>
      </div>
    `;

    expect(validateForm()).toBe(true);
  });

  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });

  test('createTurnier sends data when called', async () => {
    // Beispiel: Setze erforderliche Daten, die in der Funktion verwendet werden
    document.getElementById('turnierName').value = 'TestTurnier';
    document.getElementById('startDatum').value = '2023-01-01';


    await createTurnier();

    // Überprüfe, ob fetch mit den erwarteten Daten aufgerufen wurde
    expect(fetch).toHaveBeenCalledWith('/api/create-turnier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        turnierNummer: expect.any(Number),

      }),
    });
  });
});
