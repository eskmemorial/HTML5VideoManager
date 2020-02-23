chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (message.type === "setBadgeText") {
            chrome.browserAction.setBadgeText({ text: message.value });
        }
        if (message.type === "removeBadgeText") {

            chrome.browserAction.setBadgeText({ text: "" });
        }
        return true;
    }
);
