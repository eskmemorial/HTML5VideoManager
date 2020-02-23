chrome.storage.sync.get("enable", storage => {

    if (storage.enable !== false) {
        enableExtension();
    } else {
        disableExtension();
    }
});


document.querySelector("#enable").addEventListener("click", enableExtension);


document.querySelector("#disable").addEventListener("click", disableExtension);


document.querySelector("#open_options").addEventListener("click", event => {
    window.open("options.html");
});


function enableExtension() {

    chrome.storage.sync.set({ enable: true }, () => {
        document.querySelector("#enable").setAttribute("style", "display:none;");
        document.querySelector("#disable").setAttribute("style", "display:inline-block;");

        chrome.runtime.sendMessage(
            {
                type: "setIcon",
                value: { path: "icon64.png" }
            }
        );

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { type: "extensionEnable", value: true });
        });
    });
}


function disableExtension() {

    chrome.storage.sync.set({ enable: false }, () => {
        document.querySelector("#disable").setAttribute("style", "display:none;");
        document.querySelector("#enable").setAttribute("style", "display:inline-block;");

        chrome.runtime.sendMessage(
            {
                type: "setIcon",
                value: { path: "icon64_disabled.png" }
            }
        );

        chrome.runtime.sendMessage(
            {
                type: "removeBadgeText"
            }
        );

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

            chrome.tabs.sendMessage(tabs[0].id, { type: "extensionEnable", value: false });
        });
    });
}