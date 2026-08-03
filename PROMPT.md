# Calorie Tracker App - Build Prompt

## Project Overview
Build a lightweight, single-page calorie tracker web application that runs entirely in the browser. The app will be hosted on GitHub Pages with no backend server required. Users can quickly log meals by selecting from a pre-defined list of common foods, then track daily calorie and protein intake.

## Core Features

### 1. Food Database
- Create a hard-coded list of ~50-100 common foods with:
  - Food name
  - Serving size (e.g., "1 cup", "1 medium", "100g")
  - Calories per serving
  - Protein (grams) per serving
- Organize foods into categories:
  - Proteins (chicken, beef, fish, eggs, tofu, etc.)
  - Grains (rice, bread, pasta, oats, etc.)
  - Vegetables
  - Fruits
  - Dairy (milk, yogurt, cheese, etc.)
  - Snacks (nuts, bars, chips, etc.)
  - Condiments & Oils
- Allow easy editing/addition of foods (initially through code, but optional UI later)

### 2. Meal-Based Logging
- Organize daily logging into 4 meal categories:
  - **Breakfast** (typically morning)
  - **Lunch** (typically midday)
  - **Dinner** (typically evening)
  - **Snacks** (throughout day)
- For each meal:
  - Select food from dropdown/list or add custom food
  - Specify quantity/servings
  - Add to meal
  - Display running total for that meal (calories, protein)
- Show all logged foods organized by meal with ability to:
  - View individual item details (calories, protein)
  - Delete/remove items
  - Edit quantity of logged items
  - Move items between meal categories

### 2b. Custom Food Addition
- Allow users to add foods not in the hard-coded database:
  - Input: Food name, serving size, calories, protein
  - Save to localStorage for future use
  - Custom foods appear in the food list with a badge/indicator
  - Ability to edit or delete custom foods from settings
- Pre-populate custom foods from localStorage on app load

### 3. Daily Summary & Goals
- Display totals at top:
  - Total calories consumed (across all meals)
  - Total protein consumed (across all meals)
  - Remaining calories (if daily goal set)
  - Remaining protein (if daily goal set)
- Show breakdown by meal:
  - Calories and protein for each meal type
  - Individual meal progress
- Allow user to set/adjust daily goals for:
  - Calorie target (default: 2000)
  - Protein target (default: 100g)
- Visual indicators (progress bars/cards) showing progress toward goals

### 4. Data Persistence
- Use browser localStorage to save:
  - Daily food logs (organized by date and meal type)
  - User's custom goals
  - Custom foods database (user-created entries)
  - User customizations
- Persist data across browser sessions and page reloads
- Include option to export/import daily data as JSON for backup

### 5. Calendar & History
- Ability to view previous days' logs
- Navigate between dates (previous day, next day, jump to date)
- Show historical summary (weekly view of totals)
- Optional: Streak tracking for meeting goals

### 6. UI/UX Requirements
- Clean, responsive design that works on desktop and mobile
- Dark mode support (or use a modern color scheme)
- Quick, intuitive flow to log meals
- Search/filter foods by name in the food list
- Show food details (calories, protein) in tooltips/cards
- Minimize clicks needed to log a common meal

## Technical Requirements

### Technology Stack
- **Frontend Framework**: Vanilla JavaScript (no framework dependencies)
- **Styling**: Tailwind CSS or vanilla CSS
- **Build Tool**: Vite (for fast development, optional)
- **Storage**: Browser localStorage API
- **Deployment**: GitHub Pages

### Project Structure
```
calorie-tracker/
├── src/
│   ├── data/
│   │   └── foods.js          # Hard-coded food database
│   ├── js/
│   │   ├── app.js            # Main app initialization
│   │   ├── storage.js        # localStorage management
│   │   ├── calculations.js   # Calorie/protein calculations
│   │   ├── ui.js             # DOM manipulation & rendering
│   │   └── events.js         # Event listeners
│   ├── css/
│   │   └── styles.css        # Styling
│   ├── index.html            # Main HTML file
│   └── assets/               # Images, icons
├── package.json              # Dependencies (optional, for build tools)
├── vite.config.js           # Optional build config
└── README.md
```

### localStorage Schema
```javascript
// Daily log entry format - organized by meal type
{
  "logs": {
    "2024-08-03": {
      "breakfast": [
        {
          id: "unique-id",
          foodId: "chicken-breast",
          foodName: "Chicken Breast",
          servings: 1,
          calories: 165,
          protein: 31,
          timestamp: 1722667200000,
          isCustom: false
        }
      ],
      "lunch": [],
      "dinner": [],
      "snacks": []
    }
  },
  "goals": {
    "calorieTarget": 2000,
    "proteinTarget": 100
  },
  "customFoods": [
    {
      id: "custom-1",
      name: "My Protein Smoothie",
      category: "custom",
      servingSize: "1 smoothie",
      calories: 350,
      protein: 25,
      createdAt: 1722667200000
    }
  ]
}
```

## Food Database Example
```javascript
const defaultFoods = [
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "proteins",
    servingSize: "100g",
    calories: 165,
    protein: 31,
    isCustom: false
  },
  {
    id: "brown-rice",
    name: "Brown Rice (cooked)",
    category: "grains",
    servingSize: "1 cup",
    calories: 215,
    protein: 5,
    isCustom: false
  },
  // ... more foods
];

// Custom food creation function
function createCustomFood(name, servingSize, calories, protein) {
  return {
    id: `custom-${Date.now()}`,
    name,
    category: "custom",
    servingSize,
    calories,
    protein,
    isCustom: true
  };
}
```

## GitHub Pages Deployment
- Configure repo settings for GitHub Pages
- Set up deployment workflow (GitHub Actions optional)
- Build app and deploy to `gh-pages` branch
- Site will be accessible at: `https://[username].github.io/Calorie-Tracker/`

## Nice-to-Have Features
- Meal templates (preset combinations you log together)
- Photo/emoji icons for foods for better visual identification
- Weekly/monthly analytics dashboard
- Ability to save favorite meal combinations
- Search by nutritional content (e.g., "high protein snacks")
- Barcode/UPC scanning integration (future)

## Success Criteria
✅ Users can select foods and log them with one-click simplicity  
✅ Daily totals are visible and accurate  
✅ Data persists between sessions  
✅ App works offline  
✅ Mobile-friendly interface  
✅ Loads and runs without external dependencies or APIs  
✅ Deployable to GitHub Pages without server backend  
