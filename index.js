const COHORT = "2407-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partiesList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#partyForm");
addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
    renderParties();
}
render();

async function getParties() {
  // TODO
  try {
    const response = await fetch(`${API_URL}`);
    const json = await response.json();
    console.log(json.data);
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}
async function addParty(event) {
  // This function is essentially just a wrapper around `createRecipe`,
  event.preventDefault();
    const eventDate = new Date(addPartyForm.date.value).toISOString();
  await createParty(
    addPartyForm.name.value,
    eventDate,
    addPartyForm.location.value,
    addPartyForm.description.value,
  );
}

async function createParty(name, date, location, description) {
  // TODO
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, location, description }),
    });
    const json = await response.json();
    console.log(json);

    render();
  } catch (error) {
    console.error(error);
  }
}

async function updateParty(name, date, location, description) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, location, description }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteParty(id) {
  // TODO
  console.log("id", id);
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("party could not be deleted");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
function renderParties() {
  if (!state.parties.length) {
    partiesList.innerHTML =
      /*html*/
      `<li>No parties found.</li>`;
    return;
  }
  // This uses a combination of `createElement` and `innerHTML`;
  // You can use either one, but `createElement` is
  // more flexible and `innerHTML` is more concise.
  const partyCards = state.parties.map((party) => {
    const partyCard = document.createElement("li");
    partyCard.classList.add("party");
    const eventTime = new Date(party.date).toLocaleString();
    partyCard.innerHTML = /*html*/ `
            <h2>${party.name}</h2>
            <h2>${eventTime}</h2>
            
            <h2>${party.location}</h2>
            <p>${party.description}</p>
          `;

    // We use createElement because we need to attach an event listener.
    // If we used `innerHTML`, we'd have to use `querySelector` as well.
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);

    // Access the correct recipe id
    deleteButton.addEventListener("click", () => deleteParty(party.id));

    return partyCard;
  });
  partiesList.replaceChildren(...partyCards);
}

// Which components can be created directly in the HTML? Which components need to be created in JavaScript?
// Can you render mock data to the page?
// Can you render real data to the page?
// Are you able to fetch an array of all the parties from the API?
// Is state correctly updated to match the data from the API?
// Are you passing the correct arguments to fetch?
// Does the API return an error? If so, what is the error message?
// Is there an event listener on the form? Does it correctly add a new party to the list of parties?
// Is there an event listener attached to each delete button? Does it correctly remove a party from the list of parties?
