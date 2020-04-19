document.querySelectorAll("input[name='isEnabled']").forEach(checkbox => checkbox.addEventListener("change", event => {

    if (event.srcElement.checked) {
        event.target.value = "true";
    } else {
        event.target.value = "false";
    }
}));


chrome.storage.sync.get("settings", storage => {

    if (storage.settings !== undefined) {
        Object.keys(storage.settings).forEach(action => {

            Object.keys(storage.settings[action]).forEach(prop => {

                settings[action][prop] = storage.settings[action][prop];
            });
        });
    }

    Object.keys(settings).forEach(action => {

        Object.keys(settings[action]).filter(prop => prop !== "func").forEach(prop => {

            document.querySelector(`#${action} input[name="${prop}"]`).setAttribute("value", settings[action][prop]);
        });


        if (settings[action].isEnabled) {
            document.querySelector(`#${action} input[name='isEnabled']`).setAttribute("checked", "");
        } else {
            document.querySelector(`#${action} input[name='isEnabled']`).removeAttribute("checked");
        }
    });
});






document.querySelectorAll("input").forEach(input => {

    input.addEventListener("change", event => {

        Object.keys(settings).forEach(action => {
            Object.keys(settings[action]).filter(prop => prop !== "func").forEach(prop => {

                const elem = document.querySelector(`#${action} input[name="${prop}"]`);

                switch (elem.type) {
                    case "text":
                        settings[action][prop] = elem.value;
                        break;
                    case "number":
                        settings[action][prop] = Number(elem.value);
                        break;
                    case "checkbox":
                        if (elem.value === "true") {
                            settings[action][prop] = true;
                        } else {
                            settings[action][prop] = false;
                        }
                        break;
                }
            });
        });

        chrome.storage.sync.set({ settings: settings });
    });
});



document.querySelectorAll("input[name='keyCodeStr']").forEach(input => input.addEventListener("click", clickEvent => {

    const monitorKey = keyUpEvent => {

        clickEvent.target.value = keyUpEvent.code;

        document.removeEventListener("keyup", monitorKey);
    };

    clickEvent.target.value = "press key . . .";
    document.addEventListener("keyup", monitorKey);
}));

