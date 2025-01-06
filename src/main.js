const originalData = await fetch("/src/events.json").then(res => res.json());
const menuItemsData = Object.values(originalData);

const dropdownBtn = document.getElementById('dropdownBtn');
const searchInput = document.getElementById('searchInput');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const menu = document.getElementById('dropdownMenu');
const arrowDown = document.getElementById('arrowDown');

// Create menu items
let selectedIds = [];

// Sort and group items
const groupedItems = {
  upcoming: menuItemsData.filter(item => item.status === 'upcoming'),
  past: menuItemsData.filter(item => item.status === 'past')
};

// Clear existing menu items
menu.innerHTML = '';

// Create and append grouped sections
Object.entries(groupedItems).forEach(([status, items]) => {
  if (items.length > 0) {
      // Create section header
      const sectionHeader = document.createElement('div');
      sectionHeader.className = 'menu-section-header';
      sectionHeader.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      menu.appendChild(sectionHeader);

      // Create menu items using web component
      items.forEach(item => {
          const menuItem = document.createElement('menu-item-component');
          menuItem.id = "item-" + item.id;
          menuItem.textContent = item.title;
          
          // Listen for custom event
          menuItem.addEventListener('itemSelected', (e) => {
              const { id, checked } = e.detail;
              const cleanId = id.replace('item-', '');
              if (checked && !selectedIds.includes(id)) {
                  selectedIds.push(cleanId);
              } else {
                  selectedIds = selectedIds.filter(existingId => existingId !== cleanId);
              }
              updateSelectedItems();
          });
          
          menu.appendChild(menuItem);
      });
  }
});


const noResults = document.createElement('div');
noResults.textContent = 'No matches';
noResults.style.display = 'none';
noResults.style.padding = '10px';
menu.appendChild(noResults);

// Search filter functionality
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const menuItems = menu.querySelectorAll('menu-item-component');
  let hasMatches = false;
  
  menuItems.forEach(item => {
    const itemText = item.textContent.toLowerCase();
    
    if (itemText.includes(searchTerm)) {
      item.style.display = 'flex';
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

submitBtn.addEventListener('click', (e) => {
  console.log('Submit:', selectedIds);
  if (selectedIds.length > 0) {
    selectedIdsContainer.textContent = `Selected IDs: ${selectedIds.join(', ')}`;
    selectedIdsContainer.style.display = 'block';
  } else {
    selectedIdsContainer.textContent = 'No IDs selected.';
    selectedIdsContainer.style.display = 'block';
  }

  menu.classList.add('hidden');
  arrowDown.classList.remove('rotated');
});

clearBtn.addEventListener('click', (e) => {
  selectedIds.forEach(id => {
    const checkbox = menu.querySelector(`#item-${id}`);
    checkbox.removeAttribute('checked');
  });

  // Clear search input and reset menu items
  searchInput.value = '';
  const menuItems = menu.querySelectorAll('menu-item-component');
  menuItems.forEach(item => item.style.display = 'flex');
  noResults.style.display = 'none';


  console.log('Cleared:', selectedIds);
  selectedIds = [];
  updateSelectedItems();
  menu.classList.add('hidden');
  selectedIdsContainer.style.display = 'none';
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if ((!menu.contains(e.target) && !dropdownBtn.contains(e.target))) {
    menu.classList.add('hidden');
    arrowDown.classList.remove('rotated');
  }
});

// Update selected items in dropdownBtn
function updateSelectedItems() {
  // Clear existing selected items
  const existingItems = inputContainer.querySelectorAll('.selected-item');
  existingItems.forEach(item => item.remove());

  console.log('Selected IDs:', selectedIds);

  // Render selected items based on selectedIds
  selectedIds.forEach(id => {
    const item = menuItemsData.find(menuItem => menuItem.id === id);
    console.log('Selected item:', item);
    if (item) {
      const container = document.createElement('div');
      container.className = 'selected-item';
      container.textContent = item.title;

      const removeBtn = document.createElement('span');
      removeBtn.textContent = '×';
      removeBtn.style.marginLeft = '8px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.addEventListener('click', () => {
        const checkbox = menu.querySelector(`#item-${id}`);
        console.log('Checkbox:', checkbox);
        if (checkbox) checkbox.removeAttribute('checked');
        selectedIds = selectedIds.filter(itemId => itemId !== id);
        updateSelectedItems();
        console.log('Selected IDs:', selectedIds);
      });

      container.appendChild(removeBtn);
      inputContainer.insertBefore(container, searchInput);
    }
  });
}

arrowDown.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.classList.toggle('hidden');
  arrowDown.classList.toggle('rotated');
});