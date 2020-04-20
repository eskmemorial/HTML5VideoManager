document.querySelectorAll("input[name='isEnabled']").forEach(checkbox => checkbox.addEventListener("change", event => {

    if (event.srcElement.checked) {
        event.target.value = "true";
        event.srcElement.parentElement.parentElement.setAttribute("isEnabled", "true");
    } else {
        event.target.value = "false";
        event.srcElement.parentElement.parentElement.setAttribute("isEnabled", "false");
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
            document.querySelector(`#${action}`).setAttribute("isEnabled", "true");
        } else {
            document.querySelector(`#${action} input[name='isEnabled']`).removeAttribute("checked");
            document.querySelector(`#${action}`).setAttribute("isEnabled", "false");
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

    const oldVal = clickEvent.target.value;

    const monitorKey = keyUpEvent => {

        clickEvent.target.value = keyUpEvent.code;

        document.removeEventListener("keyup", monitorKey);
        document.removeEventListener("mousedown", monitorMouseDown);
    };

    const monitorMouseDown = () => {

        clickEvent.target.value = oldVal;
        document.removeEventListener("keyup", monitorKey);
        document.removeEventListener("mousedown", monitorMouseDown);
    };

    clickEvent.target.value = "press a key . . .";
    document.addEventListener("keyup", monitorKey);
    document.addEventListener("mousedown", monitorMouseDown);
}));







function enableExtension() {

    chrome.storage.sync.set({ enable: true }, () => {

        document.querySelector("#switch_btn").src = "img/on.png";

        chrome.runtime.sendMessage(
            {
                type: "setIcon",
                value: { path: "img/icon64.png" }
            }
        );

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { type: "enableExtension", value: true });
        });
    });

    enableControllPanel();
}


function disableExtension() {

    chrome.storage.sync.set({ enable: false }, () => {

        document.querySelector("#switch_btn").src = "img/off.png";

        chrome.runtime.sendMessage(
            {
                type: "setIcon",
                value: { path: "img/icon64_disabled.png" }
            }
        );

        chrome.runtime.sendMessage(
            {
                type: "removeBadgeText"
            }
        );

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

            chrome.tabs.sendMessage(tabs[0].id, { type: "enableExtension", value: false });
        });
    });

    disableControllPanel();
}



chrome.storage.sync.get("isEnabled", storage => {

    if (storage.isEnabled !== false) {
        enableExtension();
    } else {
        disableExtension();
    }
});



document.querySelector("header>img").addEventListener("click", () => {

    chrome.storage.sync.get("isEnabled", storage => {

        if (storage.isEnabled !== false) {
            chrome.storage.sync.set({ isEnabled: false }, disableExtension);
        } else {
            chrome.storage.sync.set({ isEnabled: true }, enableExtension);
        }
    });
});



const enableControllPanel = () => {

    document.querySelectorAll("div.action").forEach(action => {

        action.removeAttribute("disabled");
    });
    document.querySelectorAll("div.action input").forEach(input => {

        input.removeAttribute("disabled");
    });
    document.querySelectorAll("div.action button").forEach(button => {

        button.removeAttribute("disabled");
    });
};

const disableControllPanel = () => {

    document.querySelectorAll("div.action").forEach(action => {

        action.setAttribute("disabled", "");
    });
    document.querySelectorAll("div.action input").forEach(input => {

        input.setAttribute("disabled", "");
    });
    document.querySelectorAll("div.action button").forEach(button => {

        button.setAttribute("disabled", "");
    });
};


document.querySelectorAll("div.action button").forEach(button => {

    button.addEventListener("click", clickEvent => {

        const input = clickEvent.srcElement.parentElement.querySelector("input");
        const newVal = Math.round((Number(input.value) + Number(button.getAttribute("step"))) * 100) / 100;

        if (newVal < Number(input.min)) {
            input.value = Number(input.min);
        } else if (Number(input.max) < newVal) {
            input.value = Number(input.max);
        } else {
            input.value = newVal;
        }

        input.dispatchEvent(new Event("change"));
    });
});