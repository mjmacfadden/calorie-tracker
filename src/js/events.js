// Events module for handling user interactions

function attachEventListeners() {
  // Date navigation
  document.getElementById('prevDateBtn').addEventListener('click', handlePreviousDate);
  document.getElementById('nextDateBtn').addEventListener('click', handleNextDate);

  // Weight tracking
  document.getElementById('saveWeightBtn').addEventListener('click', handleSaveWeight);
  document.getElementById('weightInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSaveWeight();
  });

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', handleOpenSettings);
  document.getElementById('closeSettingsBtn').addEventListener('click', handleCloseSettings);
  document.getElementById('saveSettingsBtn').addEventListener('click', handleSaveSettings);

  // Weight chart
  document.getElementById('currentWeight').addEventListener('click', handleOpenWeightChart);
  document.getElementById('closeWeightChartBtn').addEventListener('click', handleCloseWeightChart);

  // Copy log
  document.getElementById('copyLogBtn').addEventListener('click', handleCopyLog);
  document.getElementById('chatgptBtn').addEventListener('click', handleSendToChatGPT);
  document.getElementById('grokBtn').addEventListener('click', handleSendToGrok);

  // Food logging
  document.getElementById('addFoodBtn').addEventListener('click', handleAddFood);
  document.getElementById('foodSelect').addEventListener('change', handleFoodSelect);

  // Custom food
  document.getElementById('addCustomFoodBtn').addEventListener('click', handleAddCustomFood);

  // Meal item actions
  document.addEventListener('click', handleMealItemActions);
  document.addEventListener('input', handleItemServingsChange);



  // Data management
  document.getElementById('exportBtn').addEventListener('click', handleExportData);
  document.getElementById('importBtn').addEventListener('click', handleImportData);
  document.getElementById('clearBtn').addEventListener('click', handleClearAllData);

  // Enter key for custom food form
  document.getElementById('customFoodProtein').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleAddCustomFood();
  });

  // Enter key for meal selection
  document.getElementById('servingsInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleAddFood();
  });
}

// Date navigation
function handlePreviousDate() {
  ui.currentDate = getPreviousDayString(ui.currentDate);
  ui.updateDisplay();
}

function handleNextDate() {
  ui.currentDate = getNextDayString(ui.currentDate);
  ui.updateDisplay();
}

// Weight tracking
function handleSaveWeight() {
  const weightInput = document.getElementById('weightInput');
  const weight = parseFloat(weightInput.value);

  // If input is empty, delete the weight entry
  if (weightInput.value.trim() === '') {
    saveWeight(ui.currentDate, null);
    ui.updateDisplay();
    ui.showNotification('Weight entry deleted');
    return;
  }

  // If input is not empty but invalid
  if (!weight || weight <= 0) {
    ui.showNotification('Please enter a valid weight', 'warning');
    return;
  }

  // Save valid weight
  saveWeight(ui.currentDate, weight);
  ui.updateDisplay();
  ui.showNotification(`Saved weight: ${weight.toFixed(1)} lbs`);
}

// Settings
function handleOpenSettings() {
  ui.showSettings();
}

function handleCloseSettings() {
  ui.hideSettings();
}

function handleSaveSettings() {
  const goals = {
    calorieTarget: parseInt(document.getElementById('goalCalories').value) || 2000,
    proteinTarget: parseInt(document.getElementById('goalProtein').value) || 100
  };

  saveGoals(goals);
  ui.hideSettings();
  ui.updateDisplay();
  ui.showNotification('Settings saved!');
}

// Weight chart
function handleOpenWeightChart() {
  ui.showWeightChart();
}

function handleCloseWeightChart() {
  ui.hideWeightChart();
}

// Copy log
function handleCopyLog() {
  ui.copyLogToClipboard();
}

// Food logging
function handleAddFood() {
  const foodSelect = document.getElementById('foodSelect');
  const servingsInput = document.getElementById('servingsInput');
  const mealSelect = document.getElementById('mealSelect');

  if (!foodSelect.value) {
    ui.showNotification('Please select a food', 'warning');
    return;
  }

  const food = JSON.parse(foodSelect.value);
  const servings = parseFloat(servingsInput.value) || 1;
  const meal = mealSelect.value;

  const foodEntry = createFoodEntry(food, servings);
  addFoodToMeal(ui.currentDate, meal, foodEntry);

  ui.updateDisplay();
  ui.clearFoodInput();
  ui.showNotification(`Added ${food.name} to ${meal}!`);
}

function handleFoodSelect(e) {
  if (e.target.value) {
    const food = JSON.parse(e.target.value);
    document.getElementById('servingsInput').value = '1';
  }
}

// Custom food
function handleAddCustomFood() {
  const name = document.getElementById('customFoodName').value.trim();
  const calories = parseFloat(document.getElementById('customFoodCalories').value);
  const protein = parseFloat(document.getElementById('customFoodProtein').value);
  const mealSelect = document.getElementById('mealSelect');
  const meal = mealSelect.value;

  if (!name || !calories || protein === null) {
    ui.showNotification('Please fill in all fields', 'warning');
    return;
  }

  // Create a temporary custom food object
  const customFood = {
    id: 'custom-' + Date.now(),
    name,
    calories,
    protein,
    category: 'custom',
    isCustom: true
  };

  // Add directly to the meal for today
  const foodEntry = createFoodEntry(customFood, 1);
  addFoodToMeal(ui.currentDate, meal, foodEntry);

  ui.clearCustomFoodForm();
  ui.updateDisplay();
  ui.showNotification(`Added ${name} to ${meal}!`);
}

// Meal item actions
function handleMealItemActions(e) {
  const deleteBtn = e.target.closest('.delete-item');
  if (deleteBtn) {
    const meal = deleteBtn.dataset.meal;
    const itemId = deleteBtn.dataset.itemId;
    removeFoodFromMeal(ui.currentDate, meal, itemId);
    ui.updateDisplay();
    ui.showNotification('Item removed');
    return;
  }


}

function handleItemServingsChange(e) {
  const input = e.target.closest('.item-servings-input');
  if (!input) return;

  const meal = input.dataset.meal;
  const itemId = input.dataset.itemId;
  const newServings = parseFloat(input.value) || 1;

  updateFoodInMeal(ui.currentDate, meal, itemId, newServings);
  ui.updateDisplay();
}



// Data management
function handleExportData() {
  const data = exportData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `calorie-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
  ui.showNotification('Data exported!');
}

function handleImportData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const data = JSON.parse(event.target.result);
        importData(data);
        ui.updateDisplay();
        ui.showNotification('Data imported successfully!');
      } catch (error) {
        ui.showNotification('Failed to import data', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function handleClearAllData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    clearAllData();
    ui.currentDate = getTodayDateString();
    ui.updateDisplay();
    ui.showNotification('All data cleared');
  }
}

// Send log to ChatGPT
function handleSendToChatGPT() {
  const logText = ui.generateLogText();
  const fullPrompt = `${logText}\n\nReview my food log for today. What did I do well, and what could I improve tomorrow? Focus on calorie/protein targets and meal balance.`;
  
  // Try to open ChatGPT with pre-filled prompt via URL encoding
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const chatgptUrl = `https://chatgpt.com/?q=${encodedPrompt}`;
  
  // Copy to clipboard as backup
  navigator.clipboard.writeText(fullPrompt).then(() => {
    window.open(chatgptUrl, '_blank');
    ui.showNotification('Opened ChatGPT with your log!');
  }).catch(() => {
    window.open('https://chatgpt.com/', '_blank');
    ui.showNotification('Could not copy to clipboard', 'warning');
  });
}

// Send log to Grok
function handleSendToGrok() {
  const logText = ui.generateLogText();
  const fullPrompt = `${logText}\n\nReview my food log for today. What did I do well, and what could I improve tomorrow? Focus on calorie/protein targets and meal balance.`;
  
  // Try to open Grok with pre-filled prompt via URL encoding
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const grokUrl = `https://grok.com/?q=${encodedPrompt}`;
  
  // Copy to clipboard as backup
  navigator.clipboard.writeText(fullPrompt).then(() => {
    window.open(grokUrl, '_blank');
    ui.showNotification('Opened Grok with your log!');
  }).catch(() => {
    window.open('https://grok.com/', '_blank');
    ui.showNotification('Could not copy to clipboard', 'warning');
  });
}
