console.log('Background script initializing');

const processedAlerts = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "alertDetected") {
    const alertId = JSON.stringify(request.alert);

    let response = {message: "Alert already processed"}
    if (!processedAlerts.has(alertId)) {
      processedAlerts.add(alertId);
      response = {message: "New alert received and processed"};
    }

    console.log("Current processed alerts:", Array.from(processedAlerts));
    sendResponse(response);
    return true;
  }
});

setInterval(() => {
  console.log("Clearing processed alerts...");
  processedAlerts.clear();
  console.log("Processed alerts cleared.");
}, 24 * 60 * 60 * 1000);

console.log('Background script initialized');