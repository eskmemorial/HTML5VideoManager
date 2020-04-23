// syncs settings, storage.settings,value in dom.
Object.keys(settings).forEach(action => {

    settings[action].enable = () => {

        const htmlElem = document.querySelector(`#${action}`);

        htmlElem.setAttribute("isEnabled", "true");
        htmlElem.querySelector("input[name='isEnabled']").setAttribute("checked", "");
        htmlElem.querySelector("input[name='isEnabled']").setAttribute("value", "true");

        settings[action].unlockInput();

        if (settings[action].isEnabled !== true) {

            settings[action].isEnabled = true;
            chrome.storage.sync.set({ settings: settings });
        }
    };

    settings[action].disable = () => {

        const htmlElem = document.querySelector(`#${action}`);

        htmlElem.setAttribute("isEnabled", "false");
        htmlElem.querySelector("input[name='isEnabled']").removeAttribute("checked");
        htmlElem.querySelector("input[name='isEnabled']").setAttribute("value", "false");

        settings[action].lockInput();

        if (settings[action].isEnabled !== false) {

            settings[action].isEnabled = false;
            chrome.storage.sync.set({ settings: settings });
        }
    }

    settings[action].lockInput = () => {

        document.querySelector(`#${action}`)
            .querySelectorAll("input[name='keyCodeStr'],input[type='number'],button")
            .forEach(input => {
                input.setAttribute("disabled", "");
            });
    };

    settings[action].unlockInput = () => {

        document.querySelector(`#${action}`)
            .querySelectorAll("input[name='keyCodeStr'],input[type='number'],button")
            .forEach(input => {
                input.removeAttribute("disabled");
            });
    };

    settings[action].setShortcutKey = keyCodeStr => {

        const textbox = document.querySelector(`#${action} input[name='keyCodeStr']`);

        textbox.value = keyCodeStr;
        textbox.setAttribute("value", keyCodeStr);

        if (settings[action].keyCodeStr !== keyCodeStr) {

            settings[action].keyCodeStr = keyCodeStr;
            chrome.storage.sync.set({ settings: settings });
        }
    };

    settings[action].setValue = value => {

        const numbox = document.querySelector(`#${action} input[name='value']`);

        value = value < Number(numbox.getAttribute("min")) ? Number(numbox.getAttribute("min")) : value;
        value = Number(numbox.getAttribute("max")) < value ? Number(numbox.getAttribute("max")) : value;

        value = Math.round(value * 100) / 100;

        numbox.value = value;
        numbox.setAttribute("value", value);

        if (settings[action].value !== value) {

            settings[action].value = value;
            chrome.storage.sync.set({ settings: settings });
        }
    }

    settings[action].initialize = () => {

        if (settings[action].isEnabled) {
            settings[action].enable();
        } else {
            settings[action].disable();
        }

        settings[action].setShortcutKey(settings[action].keyCodeStr);

        if (settings[action].value !== undefined) {
            settings[action].setValue(settings[action].value);
        }



        const htmlElem = document.querySelector(`#${action}`);

        htmlElem.querySelector("input[name='isEnabled']").addEventListener("change", changeEvent => {

            if (changeEvent.srcElement.checked) {
                settings[action].enable();
            } else {
                settings[action].disable();
            }
        });

        htmlElem.querySelector("input[name='keyCodeStr']").addEventListener("click", clickEvent => {

            const oldVal = clickEvent.target.value;

            const monitorKey = keyUpEvent => {

                settings[action].setShortcutKey(keyUpEvent.code);

                document.removeEventListener("keyup", monitorKey);
                document.removeEventListener("mousedown", monitorMouseDown);
            };

            const monitorMouseDown = mouseDownEvent => {

                settings[action].setShortcutKey(oldVal);

                document.removeEventListener("keyup", monitorKey);
                document.removeEventListener("mousedown", monitorMouseDown);
            };

            clickEvent.target.value = "press a key . . .";
            document.addEventListener("keyup", monitorKey);
            document.addEventListener("mousedown", monitorMouseDown);
        });

        if (settings[action].value !== undefined) {

            htmlElem.querySelector("input[name='value']").addEventListener("change", changeEvent => {

                settings[action].setValue(Number(changeEvent.srcElement.value));
            });

            htmlElem.querySelectorAll("button").forEach(button => {

                button.addEventListener("click", clickEvent => {

                    const oldVal = Number(htmlElem.querySelector("input[name='value']").getAttribute("value"));
                    const step = Number(button.getAttribute("step"));

                    settings[action].setValue(oldVal + step);
                });
            });
        }
    };
});






chrome.storage.sync.get(["isEnabled", "settings"], storage => {

    if (storage.settings !== undefined) {

        Object.keys(storage.settings).forEach(action => {
            Object.keys(storage.settings[action]).forEach(prop => {

                settings[action][prop] = storage.settings[action][prop];
            });
        });
    }

    Object.keys(settings).forEach(action => {

        settings[action].initialize();
    });

    if (storage.isEnabled === false) {
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

        Object.keys(settings).forEach(action => {

            document.querySelector(`#${action}`).removeAttribute("disabled");
            document.querySelector(`#${action} input[name='isEnabled']`).removeAttribute("disabled");
            settings[action].initialize();
        });
    });
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

        chrome.runtime.sendMessage({ type: "removeBadgeText" });

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {

            chrome.tabs.sendMessage(tabs[0].id, { type: "enableExtension", value: false });
        });

        Object.keys(settings).forEach(action => {

            document.querySelector(`#${action}`).setAttribute("disabled", "");
            document.querySelector(`#${action} input[name='isEnabled']`).setAttribute("disabled", "");
            settings[action].lockInput();
        });
    });
}
