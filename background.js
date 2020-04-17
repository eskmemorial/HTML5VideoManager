chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        switch (message.type) {
            case "setBadgeText":
                chrome.browserAction.setBadgeText({ text: message.value });
                chrome.browserAction.setBadgeBackgroundColor({ color: "#007FFF" });
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
