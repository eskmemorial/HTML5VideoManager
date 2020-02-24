chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        switch (message.type) {
            case "setBadgeText":
                chrome.browserAction.setBadgeText({ text: message.value });
                break;
            case "removeBadgeText":
                chrome.browserAction.setBadgeText({ text: "" });
                break;
            case "setIcon":
                chrome.browserAction.setIcon(message.value);
                break;

        }

        return true;
    }
);
