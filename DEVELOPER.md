# Developer Guide

This guide explains the code structure and how to customize the Calorie Tracker app.

## Architecture Overview

The app follows a modular architecture with separation of concerns:

```
┌─────────────┐
│  index.html │ Entry point, loads all scripts
└──────┬──────┘
       ↓
┌──────────────────────────────────────────┐
│         Vanilla JavaScript Modules       │
├──────────────────────────────────────────┤
│ 1. foods.js       - Data layer           │
│ 2. storage.js     - localStorage         │
│ 3. calculations.js - Business logic      │
│ 4. ui.js          - Rendering            │
│ 5. events.js      - Event handlers       │
│ 6. app.js         - Initialization       │
└──────────────────────────────────────────┘
       ↓
┌──────────────────┐
│  styles.css      │ Styling & Layout
└──────────────────┘
```

## Module Breakdown

### 1. `foods.js` - Food Database

**Purpose:** Manages the hard-coded food database

**Key Functions:**
- `getAllFoods(customFoods)` - Get all foods (default + custom)
- `getFoodsByCategory(category)` - Filter foods by category
- `getCategories()` - Get all categories

**Structure:**
```javascript
{
  id: "unique-id",
  name: "Food Name",
  category: "proteins",
  servingSize: "100g",
  calories: 165,
  protein: 31,
  isCustom: false
}
```

**How to add foods:**
Edit the `DEFAULT_FOODS` array:
```javascript
const DEFAULT_FOODS = [
  {
    id: "my-food",
    name: "My Food",
    category: "proteins",
    servingSize: "100g",
    calories: 200,
    protein: 20,
    isCustom: false
  },
  // ... more foods
];
```

### 2. `storage.js` - Data Persistence

**Purpose:** Manages all localStorage operations

**Key Functions:**
- `initializeStorage()` - Initialize localStorage on app load
- `getLogsForDate(dateString)` - Get logs for a specific date
- `addFoodToMeal(date, meal, foodEntry)` - Add food to meal
- `removeFoodFromMeal(date, meal, foodId)` - Remove food
- `updateFoodInMeal(date, meal, foodId, servings)` - Update quantity
- `getGoals()` / `saveGoals(goals)` - Get/save daily goals
- `getCustomFoods()` / `addCustomFood(food)` - Custom food management
- `exportData()` / `importData(data)` - Backup/restore

**Storage Structure:**
```javascript
{
  logs: {
    "2024-08-03": {
      breakfast: [ /* food entries */ ],
      lunch: [ /* food entries */ ],
      dinner: [ /* food entries */ ],
      snacks: [ /* food entries */ ]
    }
  },
  goals: { calorieTarget: 2000, proteinTarget: 100 },
  customFoods: [ /* custom food entries */ ]
}
```

### 3. `calculations.js` - Business Logic

**Purpose:** Performs all nutritional calculations

**Key Functions:**
- `calculateMealTotals(mealArray)` - Sum calories/protein for a meal
- `calculateDailyTotals(logs)` - Sum across all meals
- `calculateRemaining(totals, goals)` - Calculate remaining macros
- `calculateProgress(totals, goals)` - Get % progress
- `getDailySummary(date)` - Get complete day summary
- `getWeeklySummary()` - Get last 7 days

**Example:**
```javascript
const summary = getDailySummary("2024-08-03");
console.log(summary.dailyTotals); // { calories: 1850, protein: 125 }
console.log(summary.remaining); // { caloriesRemaining: 150, ... }
console.log(summary.progress); // { calorieProgress: 92, ... }
```

### 4. `ui.js` - UI Rendering

**Purpose:** Renders and updates the entire UI

**Key Class:** `UI`

**Key Methods:**
- `constructor()` - Initialize UI state
- `render()` - Render entire app structure
- `updateDisplay()` - Update all displays with current data
- `updateFoodDropdown()` - Populate food selector
- `updateMealsDisplay()` - Render meal cards
- `updateSettingsModal()` - Populate settings dialog
- `showNotification(message)` - Show temporary message
- `showSettings()` / `hideSettings()` - Show/hide modal

**How it works:**
1. `render()` creates the HTML structure once
2. `updateDisplay()` refreshes all data displays
3. Called after any data change

### 5. `events.js` - Event Handlers

**Purpose:** Handles all user interactions

**Key Functions:**
- `attachEventListeners()` - Register all event listeners
- `handleAddFood()` - Add food to meal
- `handleAddCustomFood()` - Create custom food
- `handleMealItemActions()` - Delete/edit items
- `handleSaveSettings()` - Save goals
- `handleExportData()` - Download backup
- `handleImportData()` - Upload backup

**Event Flow:**
```
User clicks button
    ↓
Event listener fires
    ↓
Handler function executes
    ↓
Storage updated (storage.js)
    ↓
UI refreshed (ui.js)
```

### 6. `app.js` - Initialization

**Purpose:** Bootstrap the application

**Key Function:**
- `initializeApp()` - Run when DOM loads

```javascript
function initializeApp() {
  initializeStorage();  // Setup storage
  ui.render();          // Render HTML
  attachEventListeners(); // Add event handlers
  ui.updateDisplay();   // Show initial data
}
```

## Common Customizations

### Change Default Goals

**File:** `src/js/storage.js`

```javascript
const DEFAULT_GOALS = {
  calorieTarget: 2500,  // Change from 2000
  proteinTarget: 150    // Change from 100
};
```

### Add a New Meal Type

**File:** `src/js/storage.js`

```javascript
const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks', 'pre-workout'];
```

**File:** `src/js/ui.js`

Update `getMealEmoji()`:
```javascript
getMealEmoji(meal) {
  const emojis = {
    // ... existing
    'pre-workout': '💪'
  };
  return emojis[meal] || '';
}
```

### Change Colors

**File:** `src/css/styles.css`

```css
:root {
  --primary-color: #4f46e5;      /* Change main color */
  --secondary-color: #06b6d4;    /* Change accent */
  --bg-color: #0f172a;           /* Change background */
  /* ... etc */
}
```

### Increase Default Servings

**File:** `src/js/ui.js`

```javascript
<input type="number" id="servingsInput" min="0.5" step="0.5" value="1">
                                                                    ↑
                                                          Change this value
```

### Add Progress Bar Color Thresholds

**File:** `src/js/ui.js`

Add to `updateDisplay()`:
```javascript
// Color code progress based on percentage
const calorieProgress = summary.progress.calorieProgress;
const progressBar = document.getElementById('calorieProgress');

if (calorieProgress >= 100) {
  progressBar.style.backgroundColor = 'var(--success-color)';
} else if (calorieProgress >= 80) {
  progressBar.style.backgroundColor = 'var(--warning-color)';
}
```

## Adding a New Feature

### Example: Weekly Comparison

1. **Add calculation in `calculations.js`:**
```javascript
function getWeeklyComparison() {
  const weekly = getWeeklySummary();
  return {
    avgCalories: weekly.reduce((sum, day) => sum + day.dailyTotals.calories, 0) / 7,
    avgProtein: weekly.reduce((sum, day) => sum + day.dailyTotals.protein, 0) / 7
  };
}
```

2. **Add UI in `ui.js`:**
```javascript
const comparison = getWeeklyComparison();
// Add to display...
```

3. **Add styling in `styles.css`:**
```css
.weekly-comparison {
  /* Add styles */
}
```

## Debugging

### Check Storage Contents

Open browser DevTools (F12), go to Console:
```javascript
// View all stored data
console.log(localStorage);

// View specific data
console.log(JSON.parse(localStorage.getItem('calorieTrackerLogs')));

// Clear storage
localStorage.clear();
```

### Debug Calculations

```javascript
const date = "2024-08-03";
const summary = getDailySummary(date);
console.table(summary.dailyTotals);
console.table(summary.mealTotals);
```

### Check Events

Add logging to event handlers:
```javascript
function handleAddFood() {
  console.log('Adding food...');
  // ... rest of function
}
```

## Performance Tips

- **Limit logs history:** Delete old entries to reduce storage
- **Minimize custom foods:** Too many can slow down dropdown
- **Clear cache:** Regularly export/clear old data

## Browser Compatibility

All modern browsers supported:
- Chrome/Edge 60+
- Firefox 55+
- Safari 11+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

No automated tests, but manual testing checklist:

- [ ] Add food to breakfast
- [ ] Add food to each meal
- [ ] Delete a food
- [ ] Edit food quantity
- [ ] Add custom food
- [ ] Delete custom food
- [ ] Change goals
- [ ] Check previous day
- [ ] Export data
- [ ] Clear data
- [ ] Test on mobile

---

**Need help?** Check the README.md or open an issue on GitHub.
