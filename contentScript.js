console.log('Content script loading...');

async function startMonitoring() {
  console.log('Starting monitoring for alerts');
  const toastList = document.querySelector('div[class^="toastListInner-"]');
  if (!toastList) {
    console.log('Target node not found, retrying in 1 second');
    setTimeout(startMonitoring, 1000);
    return;
  }

  console.log('Toast list found, starting alert extraction');
  await extractAlertInfo(toastList);
}

async function extractAlertInfo(toastListNode) {
  console.log('Extracting alert information');
  const alertItems = toastListNode.querySelectorAll('[class^="contentContainerWrapper-"]');

  for (const item of alertItems) {
    const contentContainer = item.querySelector('[class^="contentContainer-"]');
    if (contentContainer) {
      let title = contentContainer.querySelector('[class^="title-"]')?.innerText.trim() || '';
      title = title.replace(/\s+/g, ' ').trim();

      const name = contentContainer.querySelector('[class^="name-"]')?.innerText.trim() || '';
      const description = contentContainer.querySelector('[class^="description-"]')?.innerText.trim() || '';
      const time = contentContainer.querySelector('[class^="time-"]')?.innerText.trim() || '';

      const alertInfo = {name, title, description, time};

      if (name && title && description && time && /Alert on/.test(title)) {
        console.log('Alert detected:', alertInfo);
        await processAlert(alertInfo);
      }
    }
  }

  console.log('All alerts processed, checking for new alerts...');
  setTimeout(() => extractAlertInfo(toastListNode), 3000);
}

function processAlert(alertInfo) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: "alertDetected", alert: alertInfo
    }).then(response => {
      console.log('Response from background script:', response);
      resolve();
    }).catch(error => {
      console.error('Error in sending message:', error);
      reject(error);
    });
  });
}

startMonitoring();
console.log('Content script loaded and initialized');
