document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleAlerts');
  const message = document.getElementById('message');
  const content = document.getElementById('content');

  // Load the saved state from localStorage
  const savedState = localStorage.getItem('alertsEnabled');
  if (savedState !== null) {
    toggleSwitch.checked = JSON.parse(savedState);
  }

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

  toggleSwitch.addEventListener('change', function() {
    applyAlertState(this.checked);
  });

  function applyAlertState(isEnabled) {
    localStorage.setItem('alertsEnabled', JSON.stringify(isEnabled));
    if (isEnabled) {
      console.log('Alerts monitoring turned ON');
      // Add your logic to start monitoring alerts
    } else {
      console.log('Alerts monitoring turned OFF');
      // Add your logic to stop monitoring alerts
    }
  }
});