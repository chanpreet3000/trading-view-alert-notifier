console.log('Background script initializing');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);

  if (request.action === "alertDetected") {
    console.log("Alert detected:", request.alert);
    // Process the alert here
    // You can add your API call logic here
    console.log("Processing alert...");
    // Simulating some processing time
    setTimeout(() => {
      console.log("Alert processed");
      sendResponse({message: "Alert received and processed"});
    }, 1000);
    return true; // Indicates that the response will be sent asynchronously
  }
});

console.log('Background script initialized');