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
  calories: 40,
  protein: 0,
  isCustom: false
},
{
  id: "protein-bar",
  name: "Protein Bar",
  category: "Snack",
  calories: 190,
  protein: 10,
  isCustom: false
},
{
  id: "cheese-stick",
  name: "Cheese Stick",
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
  name: "PopCorners",
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
},
{
  id: "whisps",
  name: "Whisps (14 Crisps)",
  category: "Snack",
  calories: 160,
  protein: 13,
  isCustom: false
},
{
  id: "cottage-cheese",
  name: "Cottage Cheese",
  category: "Snack",
  calories: 90,
  protein: 13,
  isCustom: false
},
{
  id: "hard-boiled-egg",
  name: "Hard Boiled Egg",
  category: "Snack",
  calories: 75,
  protein: 6,
  isCustom: false
},
{
  id: "apple",
  name: "Apple",
  category: "Snack",
  calories: 65,
  protein: 0,
  isCustom: false
},
{
  id: "chicken-drumstick",
  name: "Chicken Drumstick",
  category: "Lunch",
  calories: 170,
  protein: 20,
  isCustom: false
},
{
  id: "cottage-cheese-flatbread",
  name: "Cottage Cheese Flatbread (1/4)",
  category: "Lunch",
  calories: 90,
  protein: 6,
  isCustom: false
}
];

// Export function to get all foods (default + custom)
function getAllFoods(customFoods = []) {
  return [...DEFAULT_FOODS, ...customFoods];
}

// Export function to get foods by category
function getFoodsByCategory(category, customFoods = []) {
  return getAllFoods(customFoods)
    .filter(food => food.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get unique categories
function getCategories(customFoods = []) {
  const categories = new Set(getAllFoods(customFoods).map(food => food.category));
  const categoryArray = Array.from(categories);
  
  // Define desired order: Breakfast, Lunch, Dinner, Snack
  const desiredOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  
  // Sort categories according to desired order
  return categoryArray.sort((a, b) => {
    const indexA = desiredOrder.indexOf(a);
    const indexB = desiredOrder.indexOf(b);
    
    // If both are in desired order, use that order
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    
    // If only one is in desired order, it comes first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // Otherwise, sort alphabetically
    return a.localeCompare(b);
  });
}
