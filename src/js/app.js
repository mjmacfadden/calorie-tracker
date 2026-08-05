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

// Register service worker for PWA functionality
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  registerServiceWorker();
});
