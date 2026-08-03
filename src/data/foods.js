// Default food database
const DEFAULT_FOODS = [
  {
  id: "Breakfast-sandwich",
  name: "Breakfast Sandwich",
  category: "Breakfast",
  calories: 350,
  protein: 20,
  isCustom: false
},
{
  id: "meta-mucil",
  name: "Meta Mucil",
  category: "Breakfast",
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
  category: "Snack",
  calories: 60,
  protein: 8,
  isCustom: false
},
{
  id: "chomps",
  name: "Chomps",
  category: "Snack",
  calories: 100,
  protein: 10,
  isCustom: false
},
{
  id: "protein-shake",
  name: "Protein Shake",
  category: "Breakfast",
  calories: 130,
  protein: 25,
  isCustom: false
},
{
  id: "popcorners",
  name: "POPCORNERS",
  category: "Snack",
  calories: 140,
  protein: 2,
  isCustom: false
},
{
  id: "granola-bites",
  name: "Granola Bites",
  category: "Snack",
  calories: 110,
  protein: 2,
  isCustom: false
},
{
  id: "cheese-wheel",
  name: "Cheese Wheel",
  category: "Snack",
  calories: 60,
  protein: 4,
  isCustom: false
},
{
  id: "cheese-bar",
  name: "Cheese Bar",
  category: "Snack",
  calories: 80,
  protein: 5,
  isCustom: false
},
{
  id: "peanut-butter-pretzels",
  name: "Peanut Butter Pretzels",
  category: "Snack",
  calories: 150,
  protein: 5,
  isCustom: false
},
{
  id: "french-fries",
  name: "French Fries",
  category: "Dinner",
  calories: 240,
  protein: 2,
  isCustom: false
},
{
  id: "grilled-chicken",
  name: "Grilled Chicken",
  category: "Dinner",
  calories: 165,
  protein: 32,
  isCustom: false
},
{
  id: "hamburger",
  name: "Hamburger",
  category: "Dinner",
  calories: 240,
  protein: 21,
  isCustom: false
},
{
  id: "penne-pasta",
  name: "Penne Pasta",
  category: "Dinner",
  calories: 200,
  protein: 7,
  isCustom: false
},
{
  id: "bowtie-pasta-farfalle",
  name: "Bowtie Pasta/Farfalle",
  category: "Dinner",
  calories: 210,
  protein: 7,
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
