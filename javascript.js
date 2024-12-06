const motListElement = document.getElementById('contact-list');
const idField = document.getElementById('id-field');
const nameField = document.getElementById('name-field');
const seniorityField = document.getElementById('seniority-field');
const motField = document.getElementById('mot-field');
const divisionField = document.getElementById('division-field');
const addBtn = document.getElementById('add-btn');
const editBtn = document.getElementById('edit-btn');
const searchField = document.getElementById('search-field');

// Initialize MOT list from localStorage or default to an empty array
let motList = JSON.parse(localStorage.getItem('motList')) || [
  { id: 1, name: "Vang, Chong", seniority: "7/6/2021", mot: "9/12/2024", division: "A" },
  { id: 2, name: "Tesch, Matt", seniority: "2/21/2021", mot: "10/6/2024", division: "P" },
  { id: 3, name: "Bond, Kevin", seniority: "1/8/1999", mot: "10/5/2024", division: "CO" },
  { id: 4, name: "Knoll, John", seniority: "7/6/2021", mot: "10/6/2024", division: "PARKS" },
  { id: 5, name: "Depledge, Evans", seniority: "5/18/2020", mot: "9/12/2024", division: "CID" },
  { id: 6, name: "Rutter, Donnie", seniority: "12/17/2004", mot: "10/6/2024", division: "CP" },
  { id: 7, name: "Smith, Leroy", seniority: "7/6/2021", mot: "10/5/2024", division: "TR" },
  { id: 8, name: "Lower, Jack", seniority: "7/6/2021", mot: "10/6/2024", division: "J" },
  { id: 9, name: "Riordan, James", seniority: "3/7/2022", mot: "10/6/2024", division: "ADMIN" },
  { id: 10, name: "Vang, Yia", seniority: "8/15/2016", mot: "10/6/2024", division: "ADMIN" }
];

let sortDirection = {
  seniority: 'asc',
  mot: 'asc',
  division: 'asc'
};

// Function to save MOT list to localStorage
function saveToLocalStorage() {
  localStorage.setItem('motList', JSON.stringify(motList));
}

// Function to sort MOT list by date
function sortMOT(mot, key) {
  return mot.sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return sortDirection[key] === 'asc' ? dateA - dateB : dateB - dateA; // Ascending or descending order
  });
}

// Function to render the MOT list
function renderMOT(mot) {
  motListElement.innerHTML = '';  // Clear current list

  mot.forEach((motItem, index) => {
    const row = document.createElement('tr');

    // Highlight the row if the division field contains the letters
    if (motItem.division.includes('CO')) {
        row.classList.add('orange'); // Colors lightorange if division is CO
        }
    if (motItem.division.includes('P')) {
        row.classList.add('skyblue'); // Colors skyblue if division is P
        }
    if (motItem.division.includes('A')) {
        row.classList.add('green'); // Colors lightgreen if division is A
        }
    if (motItem.division.includes('PARKS')) {
        row.classList.add('blue'); // Colors lightblue if division is PARKS
        }
    if (motItem.division.includes('CID')) {
        row.classList.add('boro'); // Use the default highlight for C
        }
    if (motItem.division.includes('CP')) {
        row.classList.add('gray'); // Use the default highlight for C
        }
    if (motItem.division.includes('TR')) {
        row.classList.add('pink'); // Use the default highlight for C
        }
    if (motItem.division.includes('J')) {
        row.classList.add('fuchsia'); // Use the default highlight for C
        }
    if (motItem.division.includes('ADMIN')) {
        row.classList.add('grey'); // Use the default highlight for C
        }

    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="name">${motItem.name}</td>
      <td class="seniority">${motItem.seniority}</td>
      <td class="mot">${motItem.mot}</td>
      <td class="division">${motItem.division}</td>
      <td><button class="edit-item-btn">Edit</button></td>
      <td><button class="remove-item-btn">Remove</button></td>
    `;

    // Add event listeners for Edit and Remove buttons
    row.querySelector('.edit-item-btn').addEventListener('click', () => editMot(motItem.id));
    row.querySelector('.remove-item-btn').addEventListener('click', () => removeMot(motItem.id));

    motListElement.appendChild(row);
  });
}

// Function to add a new MOT
addBtn.addEventListener('click', () => {
  if (!nameField.value || !seniorityField.value || !motField.value || !divisionField.value) {
    alert("Please fill in all fields.");
    return; // Prevent further execution
  }

  const newMot = {
    id: motList.length ? Math.max(...motList.map(m => m.id)) + 1 : 1,
    name: nameField.value,
    seniority: seniorityField.value, // Keep as string if it's a date
    mot: motField.value,
    division: divisionField.value
  };

  motList.push(newMot);
  clearFields();
  renderMOT(motList);
  saveToLocalStorage();
});

// Function to remove a MOT
function removeMot(id) {
  motList = motList.filter(motItem => motItem.id !== id);
  renderMOT(motList);
  saveToLocalStorage();
}

// Function to edit a MOT
function editMot(id) {
  const motItem = motList.find(motItem => motItem.id === id);
  if (motItem) {
    idField.value = motItem.id;
    nameField.value = motItem.name;
    seniorityField.value = motItem.seniority;
    motField.value = motItem.mot;
    divisionField.value = motItem.division;

    editBtn.classList.remove('hidden');
    addBtn.classList.add('hidden');
  }
}

// Update MOT after editing
editBtn.addEventListener('click', () => {
  const id = parseInt(idField.value, 10);
  const motItem = motList.find(motItem => motItem.id === id);

  if (motItem) {
    motItem.name = nameField.value;
    motItem.seniority = seniorityField.value; // Keep as string if it's a date
    motItem.mot = motField.value;
    motItem.division = divisionField.value;

    clearFields();
    editBtn.classList.add('hidden');
    addBtn.classList.remove('hidden');

    renderMOT(motList);
    saveToLocalStorage();
  }
});

// Clear input fields
function clearFields() {
  idField.value = '';
  nameField.value = '';
  seniorityField.value = '';
  motField.value = '';
  divisionField.value = '';
}

// Filter MOTs based on search input
searchField.addEventListener('input', () => {
  const searchTerm = searchField.value.toLowerCase();

  const filteredMot = motList.filter(motItem => {
    return (
      motItem.name.toLowerCase().includes(searchTerm) ||
      new Date(motItem.seniority).toLocaleDateString('en-US').includes(searchTerm) ||
      new Date(motItem.mot).toLocaleDateString('en-US').includes(searchTerm) ||
      new Date(motItem.division).toLocaleDateString('en-US').includes(searchTerm)
    );
  });

  renderMOT(filteredMot.length ? filteredMot : motList); // Render all if no search term
});

// Adding event listeners to the headers for sorting
document.getElementById('seniority-header').addEventListener('click', () => {
  sortDirection.seniority = sortDirection.seniority === 'asc' ? 'desc' : 'asc'; // Toggle sort direction
  const sortedMot = sortMOT(motList, 'seniority');
  renderMOT(sortedMot);
});

document.getElementById('mot-header').addEventListener('click', () => {
  sortDirection.mot = sortDirection.mot === 'asc' ? 'desc' : 'asc'; // Toggle sort direction
  const sortedMot = sortMOT(motList, 'mot');
  renderMOT(sortedMot);
});



// Initial render
renderMOT(motList);
