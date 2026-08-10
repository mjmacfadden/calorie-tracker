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

  // Water tracking
  document.getElementById('waterDrops').addEventListener('click', handleWaterDrop);

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



  // Data management
  document.getElementById('exportBtn').addEventListener('click', handleExportData);
  document.getElementById('exportCsvBtn').addEventListener('click', handleExportCsv);
  document.getElementById('importBtn').addEventListener('click', handleImportData);
  document.getElementById('clearBtn').addEventListener('click', handleClearAllData);

  // Enter key for custom food form
  document.getElementById('customFoodProtein').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleAddCustomFood();
  });

  // Enter key for food selection (servingsInput removed - all items default to 1 serving)
  document.getElementById('foodSelect').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleAddFood();
  });

  // Theme change listener
  document.getElementById('themeSelect').addEventListener('change', e => {
    applyTheme(e.target.value);
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

// Water tracking
function handleWaterDrop(e) {
  if (!e.target.closest('.water-drop')) return;
  
  const clickedDrop = e.target.closest('.water-drop');
  const index = parseInt(clickedDrop.dataset.index);
  const currentWater = getWaterForDate(ui.currentDate);
  
  // Toggle: if clicking on a filled drop before the last filled drop, set water count to that index
  // If clicking on the next empty drop, fill it
  // If clicking on a filled drop that's the last one, unfill it
  let newWaterCount;
  if (index < currentWater) {
    // Clicking on a filled drop - toggle it off
    newWaterCount = index;
  } else {
    // Clicking on an empty drop - fill it
    newWaterCount = index + 1;
  }
  
  saveWaterForDate(ui.currentDate, newWaterCount);
  ui.updateDisplay();
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
  const theme = document.getElementById('themeSelect').value;
  const waterEnabled = document.getElementById('waterTrackingCheckbox').checked;

  saveGoals(goals);
  saveTheme(theme);
  setWaterTrackingEnabled(waterEnabled);
  applyTheme(theme);
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
  const mealSelect = document.getElementById('mealSelect');

  if (!foodSelect.value) {
    ui.showNotification('Please select a food', 'warning');
    return;
  }

  const food = JSON.parse(foodSelect.value);
  const servings = 1;  // Default to 1 serving
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
    // Quantity input removed - all items default to 1 serving
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

  // Copy food name to clipboard when clicking on food item
  const foodNameElement = e.target.closest('.copy-food-name');
  if (foodNameElement) {
    const foodName = foodNameElement.dataset.foodName;
    navigator.clipboard.writeText(foodName).then(() => {
      ui.showNotification(`"${foodName}" copied to clipboard!`);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = foodName;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      ui.showNotification(`"${foodName}" copied to clipboard!`);
    });
    return;
  }
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

function handleExportCsv() {
  // Get all logs from localStorage
  const logsData = JSON.parse(localStorage.getItem('calorieTrackerLogs') || '{}');
  
  // Create CSV header
  let csv = 'Date,Meal Type,Food Name,Calories,Protein (g),Servings\n';
  
  // Sort dates and process each day's logs
  const sortedDates = Object.keys(logsData).sort();
  
  sortedDates.forEach(date => {
    const meals = logsData[date];
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
      const items = meals[meal] || [];
      items.forEach(item => {
        // Escape quotes in food name for CSV
        const foodName = (item.foodName || '').replace(/"/g, '""');
        csv += `"${date}","${meal}","${foodName}",${item.calories || 0},${item.protein || 0},${item.servings || 1}\n`;
      });
    });
  });
  
  // Create blob and download
  const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(csvBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `calorie-tracker-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  ui.showNotification('Data exported to CSV!');
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
  const logs = getLogsForDate(ui.currentDate);
  const hasDinner = logs.dinner && logs.dinner.length > 0;
  
  let fullPrompt;
  if (hasDinner) {
    fullPrompt = `${logText}\n\nReview my food log for today. What did I do well, and what could I improve tomorrow? Focus on calorie/protein targets and meal balance.`;
  } else {
    fullPrompt = `${logText}\n\nHow am I doing so far today? Any feedback on my meals so far? Focus on calorie/protein targets and meal balance.`;
  }
  
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
  const logs = getLogsForDate(ui.currentDate);
  const hasDinner = logs.dinner && logs.dinner.length > 0;
  
  let fullPrompt;
  if (hasDinner) {
    fullPrompt = `${logText}\n\nReview my food log for today. What did I do well, and what could I improve tomorrow? Focus on calorie/protein targets and meal balance.`;
  } else {
    fullPrompt = `${logText}\n\nHow am I doing so far today? Any feedback on my meals so far? Focus on calorie/protein targets and meal balance.`;
  }
  
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

// Apply theme to document
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}
