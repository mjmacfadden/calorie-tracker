// Storage module for managing localStorage

const STORAGE_KEYS = {
  LOGS: 'calorieTrackerLogs',
  GOALS: 'calorieTrackerGoals',
  CUSTOM_FOODS: 'calorieTrackerCustomFoods',
  WEIGHTS: 'calorieTrackerWeights'
};

const DEFAULT_GOALS = {
  calorieTarget: 2000,
  proteinTarget: 165
};

const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks'];

// Initialize storage with default values if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS)) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WEIGHTS)) {
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify({}));
  }
}

// Get today's date as YYYY-MM-DD string
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Get date string for a specific date
function getDateString(date) {
  return date.toISOString().split('T')[0];
}

// Get previous day date string
function getPreviousDayString(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  date.setDate(date.getDate() - 1);
  return getDateString(date);
}

// Get next day date string
function getNextDayString(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  date.setDate(date.getDate() + 1);
  return getDateString(date);
}

// Get all logs or create empty structure for a date
function getLogsForDate(dateString) {
  const logsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '{}');
  
  if (!logsData[dateString]) {
    logsData[dateString] = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };
  }
  
  return logsData[dateString];
}

// Save logs for a date
function saveLogsForDate(dateString, meals) {
  const logsData = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '{}');
  logsData[dateString] = meals;
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logsData));
}

// Add food to a specific meal on a specific date
function addFoodToMeal(dateString, mealType, foodEntry) {
  const logs = getLogsForDate(dateString);
  
  if (!logs[mealType]) {
    logs[mealType] = [];
  }
  
  foodEntry.id = `${Date.now()}-${Math.random()}`;
  foodEntry.timestamp = Date.now();
  
  logs[mealType].push(foodEntry);
  saveLogsForDate(dateString, logs);
  
  return foodEntry;
}

// Remove food from a specific meal on a specific date
function removeFoodFromMeal(dateString, mealType, foodId) {
  const logs = getLogsForDate(dateString);
  logs[mealType] = logs[mealType].filter(item => item.id !== foodId);
  saveLogsForDate(dateString, logs);
}

// Update food quantity in a specific meal
function updateFoodInMeal(dateString, mealType, foodId, newServings) {
  const logs = getLogsForDate(dateString);
  const food = logs[mealType].find(item => item.id === foodId);
  
  if (food) {
    const multiplier = newServings / food.servings;
    food.servings = newServings;
    food.calories = Math.round(food.caloriesPerServing * newServings);
    food.protein = Math.round(food.proteinPerServing * newServings * 10) / 10;
    saveLogsForDate(dateString, logs);
  }
}

// Move food between meals
function moveFoodBetweenMeals(dateString, fromMeal, toMeal, foodId) {
  const logs = getLogsForDate(dateString);
  const food = logs[fromMeal].find(item => item.id === foodId);
  
  if (food) {
    removeFoodFromMeal(dateString, fromMeal, foodId);
    logs[toMeal].push(food);
    saveLogsForDate(dateString, logs);
  }
}

// Get goals
function getGoals() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || JSON.stringify(DEFAULT_GOALS));
}

// Save goals
function saveGoals(goals) {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

// Get custom foods
function getCustomFoods() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS) || '[]');
}

// Add custom food
function addCustomFood(food) {
  const customFoods = getCustomFoods();
  food.id = `custom-${Date.now()}`;
  food.isCustom = true;
  food.category = 'custom';
  food.createdAt = Date.now();
  
  customFoods.push(food);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(customFoods));
  
  return food;
}

// Delete custom food
function deleteCustomFood(foodId) {
  let customFoods = getCustomFoods();
  customFoods = customFoods.filter(food => food.id !== foodId);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(customFoods));
}

// Update custom food
function updateCustomFood(foodId, updates) {
  let customFoods = getCustomFoods();
  const food = customFoods.find(f => f.id === foodId);
  
  if (food) {
    Object.assign(food, updates);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(customFoods));
  }
}

// Get all weights
function getWeights() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.WEIGHTS) || '{}');
}

// Save weight for a date
function saveWeight(dateString, weight) {
  const weights = getWeights();
  if (weight && weight > 0) {
    weights[dateString] = parseFloat(weight);
  } else {
    delete weights[dateString];
  }
  localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
}

// Get weight for a specific date
function getWeightForDate(dateString) {
  const weights = getWeights();
  return weights[dateString] || null;
}

// Get most recent weight
function getMostRecentWeight() {
  const weights = getWeights();
  const dates = Object.keys(weights).sort().reverse();
  return dates.length > 0 ? { date: dates[0], weight: weights[dates[0]] } : null;
}

// Export/import data as JSON
function exportData() {
  return {
    logs: JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '{}'),
    goals: getGoals(),
    customFoods: getCustomFoods(),
    weights: getWeights(),
    exportedAt: new Date().toISOString()
  };
}

// Import data from JSON
function importData(data) {
  if (data.logs) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data.logs));
  }
  if (data.goals) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
  }
  if (data.customFoods) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(data.customFoods));
  }
  if (data.weights) {
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(data.weights));
  }
}

// Clear all data
function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  localStorage.removeItem(STORAGE_KEYS.GOALS);
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_FOODS);
  localStorage.removeItem(STORAGE_KEYS.WEIGHTS);
  initializeStorage();
}
