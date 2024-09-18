chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkUrl") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const url = tabs[0].url;
      const isTradingView = url.startsWith("https://in.tradingview.com/");
      sendResponse({isTradingView: isTradingView});
    });
    return true;
  }
});