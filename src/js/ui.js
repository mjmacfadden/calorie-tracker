// UI module for DOM manipulation and rendering

class UI {
  constructor() {
    this.currentDate = getTodayDateString();
    this.currentMeal = 'breakfast';
  }

  // Render the main page
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <header class="header">
          <div class="header-left">
            <h1>📊 Calorie Tracker</h1>
          </div>
          <div class="header-summary">
            <div class="header-stat">
              <div class="header-stat-label">Cal</div>
              <div class="header-stat-value" id="totalCalories">0</div>
            </div>
            <div class="header-stat">
              <div class="header-stat-label">Protein</div>
              <div class="header-stat-value" id="totalProtein">0g</div>
            </div>
          </div>
          <div class="header-controls">
            <button id="settingsBtn" class="btn btn-secondary"><i class="bi bi-gear"></i></button>
          </div>
        </header>

        <div class="date-navigation">
          <button id="prevDateBtn" class="btn btn-small">← Prev</button>
          <h2 id="currentDate" class="current-date"></h2>
          <button id="nextDateBtn" class="btn btn-small">Next →</button>
          <button id="todayBtn" class="btn btn-small">Today</button>
        </div>

        <div class="add-food-panel">
          <div class="food-input-row">
            <select id="mealSelect" class="meal-select">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
            <select id="foodSelect" class="food-select">
              <option value="">Select food...</option>
            </select>
            <input type="number" id="servingsInput" class="qty-input" min="1" step="1" value="1" placeholder="Qty">
            <button id="addFoodBtn" class="btn btn-primary">Add</button>
          </div>
          <div class="custom-food-row">
            <input type="text" id="customFoodName" placeholder="Custom food name" class="input">
            <input type="number" id="customFoodCalories" placeholder="Cal" class="input input-sm" min="0">
            <input type="number" id="customFoodProtein" placeholder="Protein" class="input input-sm" min="0" step="0.1">
            <button id="addCustomFoodBtn" class="btn btn-secondary btn-sm">+ Food</button>
          </div>
        </div>

        <div class="meals-container" id="mealsContainer"></div>
      </div>

      <div id="settingsModal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Settings</h2>
            <button id="closeSettingsBtn" class="btn-close">×</button>
          </div>
          <div class="modal-body">
            <div class="settings-group">
              <label>Daily Calorie Goal:</label>
              <input type="number" id="goalCalories" class="input" min="0" step="100">
            </div>
            <div class="settings-group">
              <label>Daily Protein Goal (g):</label>
              <input type="number" id="goalProtein" class="input" min="0" step="1">
            </div>
            <div class="settings-group">
              <h3>Manage Custom Foods</h3>
              <div id="customFoodsList" class="custom-foods-list"></div>
            </div>
            <div class="settings-group">
              <h3>Data Management</h3>
              <button id="exportBtn" class="btn btn-secondary"><i class="bi bi-download"></i> Export Data</button>
              <button id="importBtn" class="btn btn-secondary"><i class="bi bi-upload"></i> Import Data</button>
              <button id="clearBtn" class="btn btn-danger"><i class="bi bi-trash"></i> Clear All Data</button>
            </div>
          </div>
          <div class="modal-footer">
            <button id="saveSettingsBtn" class="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </div>
    `;
  }

  // Update display with data for current date
  updateDisplay() {
    const summary = getDailySummary(this.currentDate);
    const customFoods = getCustomFoods();

    // Update date
    const dateObj = new Date(this.currentDate + 'T00:00:00');
    document.getElementById('currentDate').textContent = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    // Update header summary
    document.getElementById('totalCalories').textContent = formatCalories(summary.dailyTotals.calories);
    document.getElementById('totalProtein').textContent = `${formatProtein(summary.dailyTotals.protein)}g`;

    // Update food dropdown
    this.updateFoodDropdown(customFoods);

    // Update meals display
    this.updateMealsDisplay(summary.mealTotals);

    // Update settings modal
    this.updateSettingsModal();
  }

  // Update food dropdown with available foods
  updateFoodDropdown(customFoods) {
    const foodSelect = document.getElementById('foodSelect');
    const categories = getCategories(customFoods);
    const allFoods = getAllFoods(customFoods);

    foodSelect.innerHTML = '<option value="">Select a food...</option>';

    categories.forEach(category => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = this.getCategoryLabel(category);

      const categoryFoods = allFoods.filter(f => f.category === category);
      categoryFoods.forEach(food => {
        const option = document.createElement('option');
        option.value = JSON.stringify(food);
        option.textContent = `${food.name} - ${food.calories}cal/${formatProtein(food.protein)}g`;
        optgroup.appendChild(option);
      });

      foodSelect.appendChild(optgroup);
    });
  }

  // Update meals display
  updateMealsDisplay(mealTotals) {
    const logs = getLogsForDate(this.currentDate);
    const container = document.getElementById('mealsContainer');

    container.innerHTML = MEALS.map(meal => {
      const items = logs[meal] || [];
      const totals = mealTotals[meal];

      return `
        <div class="meal-card">
          <div class="meal-header">
            <h3>${this.getMealIcon(meal)} ${this.capitalizeFirst(meal)}</h3>
            <div class="meal-totals">
              ${formatCalories(totals.calories)}cal | ${formatProtein(totals.protein)}g
            </div>
          </div>
          <div class="meal-items" id="meal-${meal}">
            ${items.length === 0 ? '<p class="empty-meal">No items added</p>' : ''}
            ${items.map(item => `
              <div class="meal-item">
                <div class="item-info">
                  <div class="item-name">${item.foodName}</div>
                  <div class="item-details">
                    Qty: ${item.servings} | ${formatCalories(item.calories)}cal | ${formatProtein(item.protein)}g
                  </div>
                </div>
                <div class="item-actions">
                  <input type="number" class="item-servings-input" data-meal="${meal}" data-item-id="${item.id}" value="${item.servings}" min="1" step="1">
                  <button class="btn-icon delete-item" data-meal="${meal}" data-item-id="${item.id}"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // Update settings modal
  updateSettingsModal() {
    const goals = getGoals();
    document.getElementById('goalCalories').value = goals.calorieTarget;
    document.getElementById('goalProtein').value = goals.proteinTarget;

    const customFoods = getCustomFoods();
    const customFoodsList = document.getElementById('customFoodsList');

    if (customFoods.length === 0) {
      customFoodsList.innerHTML = '<p>No custom foods yet</p>';
    } else {
      customFoodsList.innerHTML = customFoods.map(food => `
        <div class="custom-food-item">
          <div>
            <strong>${food.name}</strong> - ${food.calories}cal / ${formatProtein(food.protein)}g
          </div>
          <button class="btn-icon delete-custom-food" data-food-id="${food.id}"><i class="bi bi-trash"></i></button>
        </div>
      `).join('');
    }
  }

  // Helper to get category label
  getCategoryLabel(category) {
    const labels = {
      proteins: 'Proteins',
      grains: 'Grains & Carbs',
      vegetables: 'Vegetables',
      fruits: 'Fruits',
      dairy: 'Dairy',
      snacks: 'Snacks & Nuts',
      condiments: 'Condiments',
      custom: 'Custom Foods'
    };
    return labels[category] || category;
  }

  // Helper to get meal icon
  getMealIcon(meal) {
    const icons = {
      breakfast: '<i class="bi bi-sunrise"></i>',
      lunch: '<i class="bi bi-sun"></i>',
      dinner: '<i class="bi bi-moon"></i>',
      snacks: '<i class="bi bi-cup-straw"></i>'
    };
    return icons[meal] || '';
  }

  // Helper to capitalize first letter
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Show settings modal
  showSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
  }

  // Hide settings modal
  hideSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
  }

  // Clear custom food form
  clearCustomFoodForm() {
    document.getElementById('customFoodName').value = '';
    document.getElementById('customFoodCalories').value = '';
    document.getElementById('customFoodProtein').value = '';
  }

  // Clear food input
  clearFoodInput() {
    document.getElementById('foodSelect').value = '';
    document.getElementById('servingsInput').value = '1';
  }

  // Show notification (temporary message)
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

const ui = new UI();
