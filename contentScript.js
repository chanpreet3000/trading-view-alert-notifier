console.log('Content script loading...');

function startMonitoring() {
  console.log('Starting monitoring for alerts');
  const toastList = document.querySelector('div[class^="toastListInner"]');
  if (!toastList) {
    console.log('Target node not found, retrying in 1 second');
    setTimeout(startMonitoring, 1000);
    return;
  }

  console.log('Toast list found, observing for changes');
  observeToastList(toastList);
}

function observeToastList(toastListNode) {
  console.log('Setting up observer for toast list');

  function extractAlertInfo() {
    console.log('Extracting alert information');
    const alertItems = toastListNode.querySelectorAll('[class^="toastGroup-"]');

    alertItems.forEach((item) => {
      const contentContainer = item.querySelector('[class^="contentContainer-"]');
      if (contentContainer) {
        const title = contentContainer.querySelector('[class^="title-"]')?.innerText.trim() || '';
        const description = contentContainer.querySelector('[class^="description-"]')?.innerText.trim() || '';
        const time = contentContainer.querySelector('[class^="time-"]')?.innerText.trim() || '';

        const alertInfo = {
          title, description, time
        };

        if (title && description && time) {
          console.log('Alert detected:', alertInfo);
          handleAlert(alertInfo);
        }
      }
    });
  }

  // Set up observer for future changes
  const toastObserver = new MutationObserver((mutations) => {
    console.log(`Observed ${mutations.length} mutations in toast list`);
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        console.log('Child list changed, extracting alert info');
        extractAlertInfo();
      }
    });
  });

  const config = {childList: true, subtree: false};
  toastObserver.observe(toastListNode, config);
  console.log('Now observing toast list for direct child changes');
}

function handleAlert(alertInfo) {
  console.log('Handling alert:', alertInfo);

  chrome.runtime.sendMessage({
    action: "alertDetected", alert: alertInfo
  }).then(response => {
    console.log('Response from background script:', response);
  }).catch(error => {
    console.error('Error in sending message:', error);
  });
}

startMonitoring();
console.log('Content script loaded and initialized');