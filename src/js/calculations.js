// Calculations module for nutritional computations

// Calculate totals for a specific meal
function calculateMealTotals(mealArray) {
  return mealArray.reduce(
    (acc, item) => {
      return {
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein
      };
    },
    { calories: 0, protein: 0 }
  );
}

// Calculate daily totals across all meals
function calculateDailyTotals(logsForDate) {
  let totals = { calories: 0, protein: 0 };
  
  Object.values(logsForDate).forEach(mealArray => {
    const mealTotals = calculateMealTotals(mealArray);
    totals.calories += mealTotals.calories;
    totals.protein += mealTotals.protein;
  });
  
  return totals;
}

// Calculate remaining calories/protein based on goals
function calculateRemaining(totals, goals) {
  return {
    caloriesRemaining: Math.max(0, goals.calorieTarget - totals.calories),
    proteinRemaining: Math.max(0, goals.proteinTarget - totals.protein),
    isCalorieGoalMet: totals.calories >= goals.calorieTarget,
    isProteinGoalMet: totals.protein >= goals.proteinTarget
  };
}

// Calculate progress as percentage
function calculateProgress(totals, goals) {
  return {
    calorieProgress: Math.min(100, Math.round((totals.calories / goals.calorieTarget) * 100)),
    proteinProgress: Math.min(100, Math.round((totals.protein / goals.proteinTarget) * 100))
  };
}

// Get summary for a date
function getDailySummary(dateString, customFoods = []) {
  const logs = getLogsForDate(dateString);
  const goals = getGoals();
  const dailyTotals = calculateDailyTotals(logs);
  const remaining = calculateRemaining(dailyTotals, goals);
  const progress = calculateProgress(dailyTotals, goals);
  
  return {
    date: dateString,
    dailyTotals,
    goals,
    remaining,
    progress,
    mealTotals: {
      breakfast: calculateMealTotals(logs.breakfast),
      lunch: calculateMealTotals(logs.lunch),
      dinner: calculateMealTotals(logs.dinner),
      snacks: calculateMealTotals(logs.snacks)
    }
  };
}

// Get weekly summary (last 7 days)
function getWeeklySummary() {
  const today = new Date();
  const summaries = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = getDateString(date);
    summaries.push(getDailySummary(dateString));
  }
  
  return summaries;
}

// Check if goal is met for a meal type
function isMealGoalMet(mealArray, goalType, targetPercentage = 0.5) {
  const mealTotals = calculateMealTotals(mealArray);
  const goals = getGoals();
  
  if (goalType === 'calories') {
    return mealTotals.calories >= goals.calorieTarget * targetPercentage;
  } else if (goalType === 'protein') {
    return mealTotals.protein >= goals.proteinTarget * targetPercentage;
  }
  
  return false;
}

// Format numbers for display
function formatCalories(num) {
  return Math.round(num);
}

function formatProtein(num) {
  return Math.round(num * 10) / 10;
}

// Create food entry object when adding to meal
function createFoodEntry(food, servings) {
  return {
    id: null, // Will be assigned by storage
    foodId: food.id,
    foodName: food.name,
    category: food.category,
    servings: servings,
    caloriesPerServing: food.calories,
    proteinPerServing: food.protein,
    calories: Math.round(food.calories * servings),
    protein: Math.round(food.protein * servings * 10) / 10,
    isCustom: food.isCustom || false,
    timestamp: null // Will be assigned by storage
  };
}
