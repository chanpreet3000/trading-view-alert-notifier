console.log('Content script loading...');

function injectTradingButtons() {
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'trading-buttons-container';
  buttonContainer.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.6);
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    cursor: move;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    width: auto;
  `;

  const buttonStyle = `
    width: 70px;
    height: 30px;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    border: none;
    border-radius: 3px;
  `;

  const buttons = [{text: 'BUY', color: '#4CAF50'}, {text: 'SELL', color: '#F44336'}, {
    text: 'COVER', color: '#2196F3'
  }, {text: 'SHORT', color: '#FF9800'}];

  buttons.forEach(button => {
    const btn = document.createElement('button');
    btn.textContent = button.text;
    btn.style.cssText = buttonStyle + `background-color: ${button.color}; color: white;`;
    btn.addEventListener('click', () => {
      const [symbol, price] = extractSymbolPriceAndCurrency();

      function formatDate(date) {
        const pad = (n) => (n < 10 ? '0' + n : n);

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());

        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }

      const data = {
        action: button.text, symbol: symbol, currentPrice: price, time: formatDate(new Date())
      };
      chrome.runtime.sendMessage({
        action: "buttonClicked",
        data
      }, (response) => {
        if (response.success) {
          alert(response.message);
        } else {
          alert("Failed to process action: " + response.message);  // Show failure alert
        }
      });
    });
    buttonContainer.appendChild(btn);
  });

  document.body.appendChild(buttonContainer);

  // Make the container draggable
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  buttonContainer.addEventListener("mousedown", dragStart);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", dragEnd);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === buttonContainer) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, buttonContainer);
    }
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
}

function extractSymbolPriceAndCurrency() {
  const title = document.title;
  const match = title.match(/^(\S+)\s+(\S+)/);
  let symbol = 'Unknown';
  let price = 'Unknown';

  if (match) {
    [symbol, price] = match.slice(1);
  }

  // Append current price to currency
  return [symbol, price];
}


async function startMonitoring() {
  console.log('Starting monitoring for alerts');
  const toastList = document.querySelector('div[class^="toastListInner-"]');
  if (!toastList) {
    console.log('Target node not found, retrying in 1 second');
    setTimeout(startMonitoring, 1000);
    return;
  }

  console.log('Toast list found, starting alert extraction');
  injectTradingButtons();
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
      const time = contentContainer.querySelector('[class^="time-"]')?.innerText.trim() || 'Unnamed Alert';

      const alertInfo = {name, title, description, time};

      if (title && description && time && /Alert on/.test(title)) {
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
