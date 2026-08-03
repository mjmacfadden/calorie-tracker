// Default food database
const DEFAULT_FOODS = [
  {
  id: "breakfast-sandwich",
  name: "Breakfast Sandwich",
  category: "breakfast",
  calories: 350,
  protein: 20,
  isCustom: false
},
{
  id: "meta-mucil",
  name: "Meta Mucil",
  category: "breakfast",
  calories: 80,
  protein: 0,
  isCustom: false
},
{
  id: "kirkland-chewy-protein-bar",
  name: "Kirkland Chewy Protein Bar",
  category: "Snack",
  calories: 190,
  protein: 10,
  isCustom: false
},
{
  id: "light-string-cheese",
  name: "Light String Cheese",
  category: "snack",
  calories: 60,
  protein: 8,
  isCustom: false
},
{
  id: "chomps",
  name: "Chomps",
  category: "snack",
  calories: 100,
  protein: 10,
  isCustom: false
},
{
  id: "protein-shake",
  name: "Protein Shake",
  category: "breakfast",
  calories: 130,
  protein: 25,
  isCustom: false
},
{
  id: "popcorners",
  name: "POPCORNERS",
  category: "snack",
  calories: 140,
  protein: 2,
  isCustom: false
},
{
  id: "granola-bites",
  name: "Granola Bites",
  category: "snack",
  calories: 110,
  protein: 2,
  isCustom: false
},
{
  id: "cheese-wheel",
  name: "Cheese Wheel",
  category: "snack",
  calories: 60,
  protein: 4,
  isCustom: false
},
{
  id: "cheese-bar",
  name: "Cheese Bar",
  category: "snack",
  calories: 80,
  protein: 5,
  isCustom: false
}
];

// Export function to get all foods (default + custom)
function getAllFoods(customFoods = []) {
  return [...DEFAULT_FOODS, ...customFoods];
}

// Export function to get foods by category
function getFoodsByCategory(category, customFoods = []) {
  return getAllFoods(customFoods).filter(food => food.category === category);
}

// Get unique categories
function getCategories(customFoods = []) {
  const categories = new Set(getAllFoods(customFoods).map(food => food.category));
  return Array.from(categories).sort();
}
