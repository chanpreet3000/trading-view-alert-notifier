console.log('Background script initializing');

const processedAlerts = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "alertDetected") {
    const alertId = JSON.stringify(request.alert);

    if (!processedAlerts.has(alertId)) {
      const urlEncodedAlert = new URLSearchParams(request.alert).toString();

      fetch('https://algorun.in/member/tradingview.php?' + urlEncodedAlert, {
        mode: 'no-cors',
      })
        .then((response) => {
          processedAlerts.add(alertId);
          const message = {message: "New alert received, processed, and sent to algorun API"};
          console.log('Response from algorun API:', response);
          sendResponse(message);
        })
        .catch((err) => {
          console.error(err);
          const message = {message: "New alert received, processed but failed to send to algorun API"};
          sendResponse(message);
        });
      return true;
    } else {
      sendResponse({message: "Alert already processed"});
    }

    console.log("Current processed alerts:", Array.from(processedAlerts));
  }
});

setInterval(() => {
  console.log("Clearing processed alerts...");
  processedAlerts.clear();
  console.log("Processed alerts cleared.");
}, 24 * 60 * 60 * 1000);

console.log('Background script initialized');
