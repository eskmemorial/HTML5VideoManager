chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request["type"] === "setBadgeText") {
            chrome.browserAction.setBadgeText({ text: request["value"] }, () => { });
        }
        return true;
    }
);

