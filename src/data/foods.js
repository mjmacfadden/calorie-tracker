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
