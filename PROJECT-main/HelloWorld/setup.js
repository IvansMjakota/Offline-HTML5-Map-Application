// Function to register the service worker
const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        // Attempt to register the service worker with the specified scope
        const registration = await navigator.serviceWorker.register('ServiceWorker.js', { scope: './' });
        // Event listener triggered when a new service worker is found
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              console.log('New service worker installed');
            }
          });
        });
        // Check the state of the registration and log messages accordingly
        if (registration.installing) {
          console.log('Service worker installing');
        } else if (registration.waiting) {
          console.log('Service worker installed');    
        } else if (registration.active) {
          console.log('Service worker active');
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  };
  
  // Register the service worker on page load
  window.addEventListener('load', () => {
    registerServiceWorker();
  });