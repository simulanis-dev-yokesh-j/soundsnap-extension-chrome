chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download" && request.url) {
    const downloadOptions = { url: request.url };
    if (request.filename) {
      downloadOptions.filename = request.filename;
    }

    chrome.downloads.download(downloadOptions, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
        sendResponse({success: false, error: chrome.runtime.lastError.message});
      } else {
        console.log("Download started with ID:", downloadId);
        sendResponse({success: true, downloadId: downloadId});
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});

console.log("Download Assistant background script loaded."); 