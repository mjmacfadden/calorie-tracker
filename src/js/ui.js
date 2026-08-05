// UI module for DOM manipulation and rendering

class UI {
  constructor() {
    this.currentDate = getTodayDateString();
    this.currentMeal = 'breakfast';
  }

  // Render the main page
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="progress-trackers">
        <div class="progress-bar">
          <div class="progress-fill calories-fill" id="caloriesFill" style="width: 0%"></div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill protein-fill" id="proteinFill" style="width: 0%"></div>
        </div>
      </div>

      <div class="container">
        <header class="header">
          <div class="header-left">
            <h1>📊 CalTrack</h1>
          </div>
          <div class="header-summary">
            <div class="header-stat">
              <div class="header-stat-label">Cal</div>
              <div class="header-stat-value calories-primary" id="totalCalories">0</div>
            </div>
            <div class="header-stat">
              <div class="header-stat-label">Protein</div>
              <div class="header-stat-value" id="totalProtein">0g</div>
            </div>
            <div class="header-stat">
              <div class="header-stat-label">Weight</div>
              <div class="header-stat-value weight-clickable" id="currentWeight">--</div>
            </div>
          </div>
          <div class="header-controls">
            <button id="settingsBtn" class="btn btn-secondary"><i class="bi bi-gear"></i></button>
          </div>
        </header>

        <div class="date-navigation">
          <button id="prevDateBtn" class="btn btn-small">← Prev</button>
          <h2 id="currentDate" class="current-date"></h2>
          <button id="nextDateBtn" class="btn btn-small">Next →</button>
        </div>

        <div class="weight-input-section">
          <label for="weightInput">Weight (lbs):</label>
          <input type="number" id="weightInput" class="weight-input" min="0" step="0.1" placeholder="Enter weight">
          <button id="saveWeightBtn" class="btn btn-small"><i class="bi bi-check"></i></button>
        </div>

        <div class="add-food-panel">
          <div class="food-input-row">
            <select id="mealSelect" class="meal-select">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
            <select id="foodSelect" class="food-select">
              <option value="">Select food...</option>
            </select>
            <input type="number" id="servingsInput" class="qty-input" min="1" step="1" value="1" placeholder="Qty">
            <button id="addFoodBtn" class="btn btn-primary">Add</button>
          </div>
          <div class="custom-food-row">
            <input type="text" id="customFoodName" placeholder="Custom food name" class="input">
            <input type="number" id="customFoodCalories" placeholder="Cal" class="input input-sm" min="0">
            <input type="number" id="customFoodProtein" placeholder="Protein" class="input input-sm" min="0" step="0.1">
            <button id="addCustomFoodBtn" class="btn btn-secondary">Add</button>
          </div>
        </div>

        <div class="meals-container" id="mealsContainer"></div>

        <div class="copy-log-section">
          <button id="copyLogBtn" class="btn btn-primary"><i class="bi bi-clipboard"></i> Copy Log as Text</button>
        </div>
      </div>

      <div id="settingsModal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Settings</h2>
            <button id="closeSettingsBtn" class="btn-close">×</button>
          </div>
          <div class="modal-body">
            <div class="settings-group">
              <label>Daily Calorie Goal:</label>
              <input type="number" id="goalCalories" class="input" min="0" step="100">
            </div>
            <div class="settings-group">
              <label>Daily Protein Goal (g):</label>
              <input type="number" id="goalProtein" class="input" min="0" step="1">
            </div>
            <div class="settings-group">
              <h3>Data Management</h3>
              <button id="exportBtn" class="btn btn-secondary"><i class="bi bi-download"></i> Export Data</button>
              <button id="importBtn" class="btn btn-secondary"><i class="bi bi-upload"></i> Import Data</button>
              <button id="clearBtn" class="btn btn-danger"><i class="bi bi-trash"></i> Clear All Data</button>
            </div>
          </div>
          <div class="modal-footer">
            <button id="saveSettingsBtn" class="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </div>

      <div id="weightChartModal" class="modal hidden">
        <div class="modal-content modal-content-lg">
          <div class="modal-header">
            <h2>Weight Progress</h2>
            <button id="closeWeightChartBtn" class="btn-close">×</button>
          </div>
          <div class="modal-body">
            <div class="chart-container">
              <canvas id="weightChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Update display with data for current date
  updateDisplay() {
    const summary = getDailySummary(this.currentDate);
    const customFoods = getCustomFoods();
    const goals = getGoals();

    // Update date
    const dateObj = new Date(this.currentDate + 'T00:00:00');
    document.getElementById('currentDate').textContent = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    // Update header summary
    document.getElementById('totalCalories').textContent = formatCalories(summary.dailyTotals.calories);
    document.getElementById('totalProtein').textContent = `${formatProtein(summary.dailyTotals.protein)}g`;

    // Update progress trackers
    const caloriesPercent = Math.min((summary.dailyTotals.calories / goals.calorieTarget) * 100, 100);
    const proteinPercent = Math.min((summary.dailyTotals.protein / goals.proteinTarget) * 100, 100);
    
    document.getElementById('caloriesFill').style.width = `${caloriesPercent}%`;
    document.getElementById('proteinFill').style.width = `${proteinPercent}%`;

    // Update weight display and input
    const weight = getWeightForDate(this.currentDate);
    const weightDisplay = document.getElementById('currentWeight');
    if (weight) {
      weightDisplay.textContent = weight.toFixed(1) + 'lb';
    } else {
      weightDisplay.textContent = '--';
    }

    const weightInput = document.getElementById('weightInput');
    if (weight) {
      weightInput.value = weight;
    } else {
      weightInput.value = '';
    }

    // Update food dropdown
    this.updateFoodDropdown(customFoods);

    // Update meals display
    this.updateMealsDisplay(summary.mealTotals);

    // Update settings modal
    this.updateSettingsModal();
  }

  // Update food dropdown with available foods
  updateFoodDropdown(customFoods) {
    const foodSelect = document.getElementById('foodSelect');
    const categories = getCategories(customFoods);
    const allFoods = getAllFoods(customFoods);

    foodSelect.innerHTML = '<option value="">Select a food...</option>';

    categories.forEach(category => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = this.getCategoryLabel(category);

      const categoryFoods = allFoods.filter(f => f.category === category);
      categoryFoods.forEach(food => {
        const option = document.createElement('option');
        option.value = JSON.stringify(food);
        option.textContent = `${food.name} - ${food.calories}cal/${formatProtein(food.protein)}g`;
        optgroup.appendChild(option);
      });

      foodSelect.appendChild(optgroup);
    });
  }

  // Update meals display
  updateMealsDisplay(mealTotals) {
    const logs = getLogsForDate(this.currentDate);
    const container = document.getElementById('mealsContainer');

    container.innerHTML = MEALS.map(meal => {
      const items = logs[meal] || [];
      const totals = mealTotals[meal];

      return `
        <div class="meal-card">
          <div class="meal-header">
            <h3>${this.getMealIcon(meal)} ${this.capitalizeFirst(meal)}</h3>
            <div class="meal-totals">
              ${formatCalories(totals.calories)}cal | ${formatProtein(totals.protein)}g
            </div>
          </div>
          <div class="meal-items" id="meal-${meal}">
            ${items.length === 0 ? '<p class="empty-meal">No items added</p>' : ''}
            ${items.map(item => `
              <div class="meal-item">
                <div class="item-info">
                  <div class="item-name">${item.foodName}</div>
                  <div class="item-details">
                    Qty: ${item.servings} | ${formatCalories(item.calories)}cal | ${formatProtein(item.protein)}g
                  </div>
                </div>
                <div class="item-actions">
                  <input type="number" class="item-servings-input" data-meal="${meal}" data-item-id="${item.id}" value="${item.servings}" min="1" step="1">
                  <button class="btn-icon delete-item" data-meal="${meal}" data-item-id="${item.id}"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // Update settings modal
  updateSettingsModal() {
    const goals = getGoals();
    document.getElementById('goalCalories').value = goals.calorieTarget;
    document.getElementById('goalProtein').value = goals.proteinTarget;


  }

  // Helper to get category label
  getCategoryLabel(category) {
    const labels = {
      proteins: 'Proteins',
      grains: 'Grains & Carbs',
      vegetables: 'Vegetables',
      fruits: 'Fruits',
      dairy: 'Dairy',
      snacks: 'Snacks & Nuts',
      condiments: 'Condiments',
      custom: 'Custom Foods'
    };
    return labels[category] || category;
  }

  // Helper to get meal icon
  getMealIcon(meal) {
    const icons = {
      breakfast: '<i class="bi bi-sunrise"></i>',
      lunch: '<i class="bi bi-sun"></i>',
      dinner: '<i class="bi bi-moon"></i>',
      snacks: '<i class="bi bi-cup-straw"></i>'
    };
    return icons[meal] || '';
  }

  // Helper to capitalize first letter
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Show settings modal
  showSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
  }

  // Hide settings modal
  hideSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
  }

  // Clear custom food form
  clearCustomFoodForm() {
    document.getElementById('customFoodName').value = '';
    document.getElementById('customFoodCalories').value = '';
    document.getElementById('customFoodProtein').value = '';
  }

  // Clear food input
  clearFoodInput() {
    document.getElementById('foodSelect').value = '';
    document.getElementById('servingsInput').value = '1';
  }

  // Show notification (temporary message)
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Show weight chart modal
  showWeightChart() {
    document.getElementById('weightChartModal').classList.remove('hidden');
    this.renderWeightChart();
  }

  // Hide weight chart modal
  hideWeightChart() {
    document.getElementById('weightChartModal').classList.add('hidden');
  }

  // Render weight chart with trend line
  renderWeightChart() {
    const weights = getWeights();
    const sortedDates = Object.keys(weights).sort();
    
    if (sortedDates.length === 0) {
      this.showNotification('No weight data available', 'warning');
      return;
    }

    const chartData = sortedDates.map(date => ({
      date: new Date(date),
      weight: weights[date]
    }));

    // Calculate trend line using linear regression
    const trendLine = this.calculateTrendLine(chartData);

    const ctx = document.getElementById('weightChart');
    if (ctx.chart) {
      ctx.chart.destroy();
    }

    ctx.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedDates.map(date => {
          const d = new Date(date + 'T00:00:00');
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Weight (lbs)',
            data: chartData.map(d => d.weight),
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            fill: true,
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            tension: 0.3
          },
          {
            label: 'Trend',
            data: trendLine,
            borderColor: '#4f46e5',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#f1f5f9',
              font: { size: 14 }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              color: '#cbd5e1'
            },
            grid: {
              color: 'rgba(71, 85, 105, 0.2)'
            }
          },
          x: {
            ticks: {
              color: '#cbd5e1'
            },
            grid: {
              color: 'rgba(71, 85, 105, 0.2)'
            }
          }
        }
      }
    });
  }

  // Calculate trend line using linear regression
  calculateTrendLine(chartData) {
    const n = chartData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    chartData.forEach((point, index) => {
      sumX += index;
      sumY += point.weight;
      sumXY += index * point.weight;
      sumXX += index * index;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return chartData.map((_, index) => slope * index + intercept);
  }

  // Generate log text for copying
  generateLogText() {
    const summary = getDailySummary(this.currentDate);
    const goals = getGoals();
    const weight = getWeightForDate(this.currentDate);
    const logs = getLogsForDate(this.currentDate);

    const dateObj = new Date(this.currentDate + 'T00:00:00');
    const dateStr = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let text = `=== CALORIE TRACKER LOG ===\n`;
    text += `Date: ${dateStr}\n\n`;

    // Daily Summary
    text += `--- DAILY SUMMARY ---\n`;
    text += `Calories: ${summary.dailyTotals.calories} / ${goals.calorieTarget}\n`;
    text += `Protein: ${summary.dailyTotals.protein}g / ${goals.proteinTarget}g\n`;
    if (weight) {
      text += `Weight: ${weight.toFixed(1)} lbs\n`;
    }
    text += `\n`;

    // Meals
    text += `--- MEALS ---\n`;
    MEALS.forEach(meal => {
      const items = logs[meal] || [];
      const totals = summary.mealTotals[meal];
      
      text += `\n${this.capitalizeFirst(meal).toUpperCase()}:\n`;
      text += `Total: ${totals.calories} cal | ${totals.protein}g protein\n`;
      
      if (items.length === 0) {
        text += `  (no items)\n`;
      } else {
        items.forEach(item => {
          text += `  • ${item.foodName}: ${item.calories} cal, ${item.protein}g protein (Qty: ${item.servings})\n`;
        });
      }
    });

    return text;
  }

  // Copy log to clipboard
  copyLogToClipboard() {
    const logText = this.generateLogText();
    
    navigator.clipboard.writeText(logText).then(() => {
      this.showNotification('Log copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = logText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showNotification('Log copied to clipboard!');
    });
  }
}

const ui = new UI();
