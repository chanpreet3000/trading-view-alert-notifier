document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleAlerts');
  const message = document.getElementById('message');
  const content = document.getElementById('content');

  // Load the saved state from chrome.storage
  chrome.storage.sync.get(['alertsEnabled'], function(result) {
    toggleSwitch.checked = result.alertsEnabled || false;

    chrome.runtime.sendMessage({action: "checkUrl"}, (response) => {
      if (response.isTradingView) {
        content.style.display = 'flex';
        message.textContent = '';
        // Apply the saved state
        applyAlertState(toggleSwitch.checked);
      } else {
        content.style.display = 'none';
        message.textContent = 'Please navigate to https://in.tradingview.com/ to use this extension.';
      }
    });
  });

  toggleSwitch.addEventListener('change', function() {
    applyAlertState(this.checked);
  });

  function applyAlertState(isEnabled) {
    chrome.storage.sync.set({alertsEnabled: isEnabled}, function() {
      console.log('Alerts enabled state saved:', isEnabled);
    });

    if (isEnabled) {
      console.log('Alerts monitoring turned ON');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleAlerts", enabled: true});
      });
    } else {
      console.log('Alerts monitoring turned OFF');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleAlerts", enabled: false});
      });
    }
  }
});