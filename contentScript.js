let isMonitoring = false;
console.log('isMonitoring:', isMonitoring);

chrome.storage.sync.get(['alertsEnabled'], function (result) {
  isMonitoring = result.alertsEnabled || false;
  if (isMonitoring) {
    startMonitoring();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  if (request.action === "toggleAlerts") {
    isMonitoring = request.enabled;
    if (isMonitoring) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  }
});

function startMonitoring() {
  console.log('Started monitoring for alerts');
  const targetNode = document.querySelector("#overlap-manager-root");
  if (!targetNode) {
    setTimeout(startMonitoring, 1000);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const alertElement = mutation.target.querySelector(".secondaryRow-BHAMU0Vp");
        if (alertElement) {
          handleAlert(alertElement.textContent);
        }
      }
    });
  });

  const config = {childList: true, subtree: true};
  observer.observe(targetNode, config);
}

function stopMonitoring() {
  console.log('Stopped monitoring for alerts');
}

function handleAlert(alertText) {
  const alertInfo = {
    message: alertText, timestamp: new Date().toISOString()
  };

  chrome.runtime.sendMessage({
    action: "alertDetected", alert: alertInfo
  });
}