document.querySelector("#enable").addEventListener("click", event => {
    alert("enabled");
    chrome.storage.sync.set({ enable: true }, () => { });
});


document.querySelector("#disable").addEventListener("click", event => {
    alert("disabled");
    chrome.storage.sync.set({ enable: false }, () => { });
});


document.querySelector("#open_options").addEventListener("click", event => {
    window.open("options.html");
});