// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log("Upwork Job Details Extractor installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getJobDetails") {
    sendResponse({ status: "Background script received your message." });
  }
});
