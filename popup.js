document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    const currentUrl = tabs[0].url;
    const statusElement = document.getElementById('status');
    const redirectElement = document.getElementById('redirect');
    const redirectButton = document.getElementById('redirectButton');

    if (currentUrl.match(/https:\/\/.*\.tradingview\.com\/chart\/.*/)) {
      statusElement.innerHTML = '<div>Extension is active. Please visit any chart to start monitoring for alerts.</div>';
      redirectElement.style.display = 'none';
    } else {
      statusElement.innerHTML = '<div class="text-red">Extension is NOT ACTIVE on this page.</div>';
      redirectElement.style.display = 'block';
    }

    redirectButton.addEventListener('click', function () {
      chrome.tabs.create({url: 'https://in.tradingview.com/chart/Tzg1eNST/'});
    });
  });
});