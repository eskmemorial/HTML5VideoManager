// syncs settings, storage.settings,value in dom.
Object.keys(settings).forEach(action => {

    settings[action].enable = () => {

        const actionElem = document.querySelector(`#${action}`);

        actionElem.setAttribute("isEnabled", "true");
        actionElem.querySelector("input[name='isEnabled']").setAttribute("checked", "");
        actionElem.querySelector("input[name='isEnabled']").setAttribute("value", "true");
        actionElem
            .querySelectorAll("input[name='keyCodeStr'],input[type='number'],button")
            .forEach(input => {
                input.removeAttribute("disabled");
            });

        if (settings[action].isEnabled !== true) {

            settings[action].isEnabled = true;
            chrome.storage.sync.set({ settings: settings });
        }
    };

    settings[action].disable = () => {

        const actionElem = document.querySelector(`#${action}`);

        actionElem.setAttribute("isEnabled", "false");
        actionElem.querySelector("input[name='isEnabled']").removeAttribute("checked");
        actionElem.querySelector("input[name='isEnabled']").setAttribute("value", "false");
        actionElem
            .querySelectorAll("input[name='keyCodeStr'],input[type='number'],button")
            .forEach(input => {
                input.setAttribute("disabled", "");
            });

        if (settings[action].isEnabled !== false) {

            settings[action].isEnabled = false;
            chrome.storage.sync.set({ settings: settings });
        }
    }

    settings[action].lockActionElem = () => {

        const actionElem = document.querySelector(`#${action}`);

        actionElem
            .querySelectorAll("input[name='keyCodeStr'],input[type='number'],button")
            .forEach(input => {
                input.setAttribute("disabled", "");
            });

        actionElem.setAttribute("disabled", "");
        actionElem.querySelector("input[name='isEnabled']").setAttribute("disabled", "");
    };

    settings[action].unlockActionElem = () => {

        const actionElem = document.querySelector(`#${action}`);

        actionElem
            .querySelectorAll("input[name='keyCodeStr'],input[type='number'],button")
            .forEach(input => {
                input.removeAttribute("disabled");
            });

        actionElem.removeAttribute("disabled");
        actionElem.querySelector("input[name='isEnabled']").removeAttribute("disabled");
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

    settings[action].initialize = (addEventListener) => {

        if (settings[action].isEnabled) {
            settings[action].enable();
        } else {
            settings[action].disable();
        }

        settings[action].setShortcutKey(settings[action].keyCodeStr);

        if (settings[action].value !== undefined) {
            settings[action].setValue(settings[action].value);
        }

        if (!addEventListener) { return; }


        const actionElem = document.querySelector(`#${action}`);

        actionElem.querySelector("input[name='isEnabled']").addEventListener("change", changeEvent => {

            if (changeEvent.srcElement.checked) {
                settings[action].enable();
            } else {
                settings[action].disable();
            }
        });

        actionElem.querySelector("input[name='keyCodeStr']").addEventListener("click", clickEvent => {

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

            actionElem.querySelector("input[name='value']").addEventListener("change", changeEvent => {

                settings[action].setValue(Number(changeEvent.srcElement.value));
            });

            actionElem.querySelectorAll("button").forEach(button => {

                button.addEventListener("click", clickEvent => {

                    const oldVal = Number(actionElem.querySelector("input[name='value']").getAttribute("value"));
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

    if (storage.isEnabled !== false) {
        
        Object.keys(settings).forEach(action => {

            settings[action].unlockActionElem();
            settings[action].initialize(true);
        });
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

            settings[action].unlockActionElem();
            settings[action].initialize(false);
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

            settings[action].lockActionElem();
        });
    });
}
