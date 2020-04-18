chrome.storage.sync.get("settings", storage => {

    if (storage.settings !== undefined) {
        settings = storage.settings;
    }

    Object.keys(settings).forEach(action => {

        Object.keys(settings[action]).filter(prop => prop !== "func").forEach(prop => {

            document.querySelector(`#${action}>input[name="${prop}"]`).setAttribute("value", settings[action][prop]);
        });
    });
});






const saveSettings = () => {

    Object.keys(settings).forEach(action => {
        Object.keys(settings[action]).filter(prop => prop !== "func").forEach(prop => {

            const elem = document.querySelector(`#${action}>input[name="${prop}"]`);

            switch (elem.getAttribute("type")) {
                case "text":
                    settings[action][prop] = elem.value;
                    break;
                case "number":
                    settings[action][prop] = Number(elem.value);
                    break;
            }
        });
    });
    chrome.storage.sync.set({ settings: settings });
}



document.querySelectorAll("input").forEach(input => input.addEventListener("change", saveSettings));
