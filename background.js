console.log('Background script initializing');

// Set to store processed alerts
const processedAlerts = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);

  if (request.action === "alertDetected") {
    console.log("Alert detected 333:", request.alert);

    const alertId = JSON.stringify(request.alert);

    if (!processedAlerts.has(alertId)) {
      console.log("New alert detected. Processing...");
      processedAlerts.add(alertId);


      console.log("Alert processed and stored.");
      sendResponse({message: "New alert received and processed"});
    } else {
      console.log("Alert already processed. Ignoring.");
      sendResponse({message: "Alert already processed"});
    }

    console.log("Current processed alerts:", Array.from(processedAlerts));

    return true
  }
});

setInterval(() => {
  console.log("Clearing processed alerts...");
  processedAlerts.clear();
  console.log("Processed alerts cleared.");
}, 24 * 60 * 60 * 1000);

console.log('Background script initialized');