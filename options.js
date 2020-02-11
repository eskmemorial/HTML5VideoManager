document.querySelectorAll("input").forEach(input => {

    input.addEventListener("change", event => {

        var key = event.target.getAttribute("name");
        var value = event.target.value;

        chrome.storage.sync.set({ key: value }, () => { });

    });

});