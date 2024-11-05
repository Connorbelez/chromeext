chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab &&
    tab.url && // Add this check
    tab.url.startsWith("https://app.dataannotation.tech.com")
  ) {
    chrome.tabs.executeScript(tabId, { file: "content.js" });
  }
});
