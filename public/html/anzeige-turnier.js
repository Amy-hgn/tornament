document.addEventListener("DOMContentLoaded", async function () {
  try {
    const container = document.querySelector("#declarative-example-root");
    const searchInput = container.querySelector("#search-input");

    await fetchRecentTurniere();
    displayMeineTurniereHeading();
    await fetchMeineTurniere();
    displayFreiePlaetzeHeading();
    await fetchFreiePlaetze();
  } catch (error) {
    console.error('Fehler:', error);
  }
});

function redirectToCreateTurnier() {
  window.location.href = "./create-turnier";
}

async function fetchRecentTurniere() {
  try {
      const response = await fetch("/recent-turniere");
      const turniere = await response.json();

      const turnierListe = document.querySelector('sd-list');
      displayTurniere(turniere, turnierListe);
  } catch (error) {
      throw new Error('Fehler beim Abrufen der Turnierliste:' + error);
  }
}

function displayMeineTurniereHeading() {
  const turnierListe = document.querySelector('sd-list');
  const meineTurniereHeading = document.createElement('div');
  meineTurniereHeading.classList.add('sd-content-heading');
  meineTurniereHeading.innerText = 'Meine Turniere';
  turnierListe.appendChild(meineTurniereHeading);
}

async function fetchMeineTurniere() {

      
      const hostname = window.location.hostname;

      const personResponse = await fetch(`/myId?personId=${hostname}`);
      const personData = await personResponse.json();
      
      const response = await fetch(`/recent-turniereMaster?turnierMaster=${personData._id}`);
      const meineTurniere = await response.json();

      const turnierListe = document.querySelector('sd-list');
      displayTurniere(meineTurniere, turnierListe);

}


function fetchFreiePlaetze() {

}

function displayTurniere(turniere, turnierListe) {
  turniere.forEach(turnier => {
      const listItem = document.createElement('sd-list-item');
      listItem.caption = turnier.turnierName;
      listItem.description = `Startdatum: ${turnier.startDatum}, Enddatum: ${turnier.endDatum}, Veranstaltungsort: ${turnier.veranstaltungsort}`;
      turnierListe.appendChild(listItem);
  });
}
function displayFreiePlaetzeHeading() {
  const turnierListe = document.querySelector('sd-list');
  const freiePlaetzeHeading = document.createElement('div');
  freiePlaetzeHeading.classList.add('sd-content-heading');
  freiePlaetzeHeading.innerText = 'Freie Plätze';
  turnierListe.appendChild(freiePlaetzeHeading);
}

async function fetchFreiePlaetze() {
  try {
    // Ändern Sie den Fetch-Aufruf für 'freie-turniere'
    const response = await fetch('/freie-turniere');
    const freiePlaetze = await response.json();

    const turnierListe = document.querySelector('sd-list');
    displayTurniere(freiePlaetze, turnierListe);
  } catch (error) {
      throw new Error('Fehler beim Abrufen der freien Plätze:' + error);
  }}


  function handleSearchInput() {
    const container = document.querySelector("#declarative-example-root");
    const searchInput = container.querySelector("#search-input");
    const list = container.querySelector("sd-virtual-list");
  
    const dataProvider = new LazyLoadingDataProvider((hasItems) => updateVisibilities(hasItems));
  
    const fetchTurniere = async (searchTerm) => {
      try {
        const response = await fetch(`/recent-turniere?searchTerm=${searchTerm}`);
        const turniere = await response.json();
  
        const items = [];
        for (const turnier of turniere) {
          const listItem = createListItem(turnier);
          items.push(listItem);
        }
        dataProvider.updateItems(items);
      } catch (error) {
        console.error("Fehler beim Abrufen der Turnierliste:", error);
      }
    };
  
    const search = async () => {
      if (searchInput.value.trim().length === 0) {
        return;
      }
  
      await fetchTurniere(searchInput.value.trim());
      list.scrollToItem(0, "start");
      list.selectedIndices = [];
    };
  
    updateVisibilities(false);
  
    searchInput.addEventListener("input", (event) => {
      dataProvider.search(event.target.value);
    });
  
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        search();
      }
    });
  
    const createListItem = (turnier) => {
      const listItem = document.createElement("sd-list-item");
      listItem.caption = turnier.turnierName;
      listItem.description = `Startdatum: ${turnier.startDatum}, Enddatum: ${turnier.endDatum}, Veranstaltungsort: ${turnier.veranstaltungsort}`;
      return listItem;
    };
  }