chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request["type"] === "setBadgeText") {
            chrome.browserAction.setBadgeText({ text: request["value"] });
        }
        if (request["type"] === "removeBadgeText") {
            chrome.browserAction.setBadgeText({ text: "" });
        }
        return true;
    }
);

