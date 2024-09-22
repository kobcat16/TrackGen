const filePath = '/TrackGen/';
const serviceWorkerPath = `${filePath}service-worker.js`;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(serviceWorkerPath, { scope: filePath })
            .then(registration => {
                console.log('Service worker registered:', registration);
            })
            .catch(error => {
                console.error('Service worker registration failed:', error);
            });
    });
}