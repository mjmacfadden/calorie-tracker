// Main app initialization

function initializeApp() {
  // Initialize storage on first load
  initializeStorage();

  // Render UI
  ui.render();

  // Attach event listeners
  attachEventListeners();

  // Initial display update
  ui.updateDisplay();

  console.log('Calorie Tracker initialized successfully!');
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
