let names = []

document.querySelectorAll("input").forEach(input => {
    names.push(input.getAttribute("name"));
});


chrome.storage.sync.get(names, settings => {

    names.forEach(name => {
        if (settings[name] !== undefined) {
            document.querySelector(`input[name='${name}']`).setAttribute("value", settings[name].toString());
        }
    });

});





document.querySelector("#save").addEventListener("click", event => {

    let settings = {};


    document.querySelectorAll("input").forEach(input => {

        switch (input.getAttribute("valuetype")) {
            case "string":
                settings[input.getAttribute("name")] = input.value;
                break;

            case "number":
                settings[input.getAttribute("name")] = Number(input.value);
                break;
        }

    });

    chrome.storage.sync.set(settings, () => { });

    alert("saved!");

});