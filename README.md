# Calorie Tracker App

A lightweight, offline-first calorie and protein tracker that runs entirely in the browser. No backend required - perfect for GitHub Pages hosting!

## Features

✅ **Pre-defined Food Database** - 50+ common foods with calorie and protein info  
✅ **Custom Foods** - Add foods not in the database  
✅ **Meal Organization** - Log breakfast, lunch, dinner, and snacks separately  
✅ **Daily Goals** - Set and track daily calorie and protein targets  
✅ **Data Persistence** - All data saved to browser localStorage  
✅ **Responsive Design** - Works perfectly on desktop and mobile  
✅ **Offline First** - Works without internet connection  
✅ **Data Export/Import** - Backup and restore your data as JSON  

## Project Structure

```
calorie-tracker/
├── src/
│   ├── index.html           # Main HTML file
│   ├── data/
│   │   └── foods.js         # Hard-coded food database
│   ├── js/
│   │   ├── app.js           # App initialization
│   │   ├── storage.js       # localStorage management
│   │   ├── calculations.js  # Nutritional calculations
│   │   ├── ui.js            # UI rendering and updates
│   │   └── events.js        # Event handlers
│   └── css/
│       └── styles.css       # Styling and responsive design
├── PROMPT.md                # Project specification
└── README.md                # This file
```

## Usage

### Local Development

1. Simply open `src/index.html` in your web browser
2. Start logging foods and tracking your nutrition!

No build process required - it's pure vanilla JavaScript.

### Deploying to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Select `main` branch, `/root` folder as source
   - Save

3. **Access your app:**
   - Your app will be live at: `https://username.github.io/Calorie-Tracker/`
   - (Replace `username` with your GitHub username)

## How to Use

### Logging Meals

1. **Select Meal Type** - Choose breakfast, lunch, dinner, or snacks
2. **Select Food** - Pick from the dropdown (foods are organized by category)
3. **Set Servings** - Adjust the quantity (decimals like 0.5 are supported)
4. **Add to Meal** - Click "Add to Meal"

### Adding Custom Foods

1. Enter the food name (e.g., "My Protein Smoothie")
2. Enter serving size (e.g., "1 smoothie" or "500ml")
3. Enter calories per serving
4. Enter protein per serving (grams)
5. Click "Add Custom Food"

Custom foods are saved to localStorage and available for future use.

### Managing Goals

1. Click "⚙️ Settings"
2. Adjust calorie and protein targets
3. Click "Save Settings"

Your progress bars will update automatically based on your goals.

### Data Management

**Export Data:**
- Click Settings → "📥 Export Data"
- Your data downloads as a JSON file (great for backup!)

**Import Data:**
- Click Settings → "📤 Import Data"
- Select a previously exported JSON file
- Your data will be restored

**Clear Data:**
- Click Settings → "🗑️ Clear All Data" (⚠️ cannot be undone)

### Navigation

- **Previous/Next** - Browse other days
- **Today** - Jump back to today's date
- All data automatically saves to localStorage

## Food Database

The app includes ~50 common foods across categories:
- 🍗 Proteins (chicken, beef, fish, eggs, etc.)
- 🌾 Grains & Carbs (rice, pasta, oats, sweet potatoes, etc.)
- 🥬 Vegetables (broccoli, spinach, carrots, etc.)
- 🍎 Fruits (banana, apple, berries, etc.)
- 🥛 Dairy (milk, cheese, yogurt, etc.)
- 🍿 Snacks & Nuts (almonds, granola bars, chocolate, etc.)
- 🧂 Condiments (oils, honey, sauces, etc.)

Edit `src/data/foods.js` to add/modify foods.

## Technical Details

### Storage Structure

Data is stored in localStorage with this structure:

```javascript
{
  logs: {
    "2024-08-03": {
      breakfast: [ { foodName, servings, calories, protein, ... } ],
      lunch: [],
      dinner: [],
      snacks: []
    }
  },
  goals: {
    calorieTarget: 2000,
    proteinTarget: 100
  },
  customFoods: [
    { id, name, servingSize, calories, protein, ... }
  ]
}
```

### Browser Compatibility

- Chrome/Edge 60+
- Firefox 55+
- Safari 11+
- All modern mobile browsers

### Limitations

- Data stored locally (not synced across devices)
- ~5-10MB storage limit in most browsers (plenty for years of data)
- Requires JavaScript enabled

## Customization

### Change Colors

Edit `:root` variables in `src/css/styles.css`:
```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #06b6d4;
  /* ... etc */
}
```

### Modify Default Goals

Edit `DEFAULT_GOALS` in `src/js/storage.js`:
```javascript
const DEFAULT_GOALS = {
  calorieTarget: 2500,  // Change this
  proteinTarget: 150    // And this
};
```

### Add More Foods

Edit the `DEFAULT_FOODS` array in `src/data/foods.js`:
```javascript
const DEFAULT_FOODS = [
  {
    id: "my-food",
    name: "My Food",
    category: "proteins",
    servingSize: "100g",
    calories: 200,
    protein: 20
  },
  // ... more foods
];
```

## Future Enhancements

- 📊 Weekly/monthly analytics dashboard
- 🎯 Meal templates (save and reuse meal combinations)
- 📱 Progressive Web App (installable on mobile)
- 🔔 Notifications for goals
- 🍽️ Photo capture for meals
- 📡 Cloud sync (optional)
- 🌐 Multi-language support

## Troubleshooting

**Data not saving?**
- Check browser localStorage isn't disabled
- Try clearing cookies/cache
- Try a different browser

**Performance issues?**
- Clear old data in Settings
- Export and import to compact storage

**Want to reset?**
- Use Settings → Clear All Data
- Or clear browser cache for the site

## License

Free to use, modify, and distribute.

## Support

For issues or suggestions, open a GitHub issue or check the PROMPT.md for more details.

---

**Happy tracking! 🎯**
