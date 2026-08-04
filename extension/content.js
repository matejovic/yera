// Yera Extension Content Script
console.log("Yera Content Script Loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageData") {
    sendResponse({
      title: document.title,
      url: window.location.href,
      selectedText: window.getSelection().toString(),
    });
  }
});
