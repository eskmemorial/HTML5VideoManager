var names = []

document.querySelectorAll("input").forEach(input => {
    names.push(input.getAttribute("name"));
});




chrome.storage.sync.get(names, settings => {

    names.forEach(name => {
        if (settings[name] !== undefined) {
            document.querySelector(`input[name='${name}']`).setAttribute("value", settings[name]);
        }
    });

});





document.querySelector("#save").addEventListener("click", event => {

    var settings = {};

    names.forEach(name => {

        settings[name] = document.querySelector(`input[name='${name}']`).value;
    });

    chrome.storage.sync.set(settings, () => { });

});