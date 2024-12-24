import { menuItems } from './eventList.js';

const dropdownBtn = document.getElementById('dropdownBtn');
const searchInput = document.getElementById('searchInput');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const menu = document.getElementById('dropdownMenu');
const arrowDown = document.getElementById('arrowDown');

// Create menu items
let selectedIds = [];

menuItems.forEach(item => {
  const div = document.createElement('div');
  div.className = 'menu-item';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `checkbox-${item.id}`;
  
  checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      selectedIds.push(item.id);
      // addSelectedItem(item.title, item.id);
    } else {
      selectedIds = selectedIds.filter(id => id !== item.id);
      // removeSelectedItem(item.id);
    }

    updateSelectedItems();
    console.log('Selected IDs:', selectedIds);
  });
  
  const label = document.createElement('label');
  label.htmlFor = `checkbox-${item.id}`;
  label.textContent = item.title;
  
  div.appendChild(checkbox);
  div.appendChild(label);
  menu.appendChild(div);
});

const noResults = document.createElement('div');
noResults.textContent = 'No matches';
noResults.style.display = 'none';
noResults.style.padding = '10px';
menu.appendChild(noResults);

// Search filter functionality
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const menuItems = menu.querySelectorAll('.menu-item');
  let hasMatches = false;
  
  menuItems.forEach(item => {
    const label = item.querySelector('label');
    const itemText = label.textContent.toLowerCase();
    
    if (itemText.includes(searchTerm)) {
      item.style.display = 'block';
      hasMatches = true;
    } else {
      item.style.display = 'none';
    }
  });

  noResults.style.display = hasMatches ? 'none' : 'block';
});

// Open dropdown
dropdownBtn.addEventListener('click', () => {
  menu.classList.remove('hidden');
  arrowDown.classList.add('rotated');
});

submitBtn.addEventListener('click', () => {
  console.log('Submit:', selectedIds);
  if (selectedIds.length > 0) {
    selectedIdsContainer.textContent = `Selected IDs: ${selectedIds.join(', ')}`;
    selectedIdsContainer.style.display = 'block';
  } else {
    selectedIdsContainer.textContent = 'No IDs selected.';
    selectedIdsContainer.style.display = 'block';
  }
  menu.classList.add('hidden');
});

clearBtn.addEventListener('click', () => {
  selectedIds.forEach(id => {
    const checkbox = menu.querySelector(`#checkbox-${id}`);
    checkbox.checked = false;
  });

  // Clear search input and reset menu items
  searchInput.value = '';
  const menuItems = menu.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.style.display = 'block');
  noResults.style.display = 'none';


  console.log('Cleared:', selectedIds);
  selectedIds = [];
  updateSelectedItems();
  menu.classList.add('hidden');
  selectedIdsContainer.style.display = 'none';
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if ((!menu.contains(e.target) && !dropdownBtn.contains(e.target)) || arrowDown.contains(e.target)) {
    menu.classList.add('hidden');
    arrowDown.classList.remove('rotated');
  }
});

arrowDown.addEventListener('click', () => {
  arrowDown.style.animation = 'rotate 0.5s';
});

// Update selected items in dropdownBtn
function updateSelectedItems() {
  // Clear existing selected items
  const existingItems = inputContainer.querySelectorAll('.selected-item');
  existingItems.forEach(item => item.remove());

  // Render selected items based on selectedIds
  selectedIds.forEach(id => {
    const item = menuItems.find(menuItem => menuItem.id === id);
    if (item) {
      const container = document.createElement('div');
      container.className = 'selected-item';
      container.textContent = item.title;

      // Optional: Add a remove button
      const removeBtn = document.createElement('span');
      removeBtn.textContent = '×';
      removeBtn.style.marginLeft = '8px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.addEventListener('click', () => {
        const checkbox = menu.querySelector(`#checkbox-${id}`);
        if (checkbox) checkbox.checked = false;
        selectedIds = selectedIds.filter(itemId => itemId !== id);
        updateSelectedItems();
        console.log('Selected IDs:', selectedIds);
      });

      container.appendChild(removeBtn);
      inputContainer.insertBefore(container, searchInput);
    }
  });
}
