var settings = loadSettings();

var videos = [];

new MutationObserver(mutations => {

    mutations.forEach(mutation => {

        mutation.addedNodes.forEach(addedNode => {

            if (addedNode.nodeName === "VIDEO") {

                videos.push(new Video(addedNode));
            }
        });

        mutation.removedNodes.forEach(removedNode => {

            if (removedNode.nodeName === "VIDEO") {

                videos = videos.filter(video => video.videoId !== removedNode.getAttribute("videoId"));
            }
        });
    });
}).observe(document, { childList: true, subtree: true });


document.addEventListener("keydown", event => {
    console.log(event);
    console.log(videos);
    switch (event.key) {
        case settings["speedUpKey"] || "d":
            videos.forEach(video => {
                video.speedUp(settings["speedUpStep"]);
            });
            break;
        case settings["resetSpeedKey"] || "a":
            videos.forEach(video => {
                video.setSpeed(settings["defaultPlaybackRate"]);
            });
            break;
        case settings["speedDownKey"] || "s":
            videos.forEach(video => {
                video.speedDown(settings["speedDownStep"]);
            });
            break;



        case settings["advanceKey"] || "c":
            videos.forEach(video => {
                video.advance(settings["advanceStep"]);
            });
            break;
        case settings["rewindKey"] || "z":
            videos.forEach(video => {
                video.rewind(settings["rewindStep"]);
            });
            break;



        case settings["volumeUpKey"] || "e":
            videos.forEach(video => {
                video.volumeUp(settings["volumeUpStep"]);
            });
            break;
        case settings["resetVolumeKey"] || "q":
            videos.forEach(video => {
                video.setVolume(settings["defaultVolume"]);
            });
            break;
        case settings["volumeDownKey"] || "w":
            videos.forEach(video => {
                video.volumeDown(settings["volumeDownStep"]);
            });
            break;



        case settings["showControllerKey"] || "r":
            videos.forEach(video => {
                video.showController({ speed: true, volume: true, currentTime: true });
            });
            break;
        case settings["reloadSettingsKey"] || "t":
            settings = loadSettings();
            break;
    }

    event.stopImmediatePropagation();

});


function loadSettings() {

    var settings = {};

    var names_str = [
        "speedUpKey", "speedDownKey", "resetSpeedKey",
        "volumeUpKey", "volumeDownKey", "resetVolumeKey",
        "advanceKey", "rewindKey",
        "showControllerKey", "reloadSettingsKey"
    ];

    chrome.storage.sync.get(names_str, s => {

        names_str.forEach(name => {
            if (s[name] !== undefined) {
                settings[name] = s[name];
            }
        });

    });

    var names_int = [
        "speedUpStep", "speedDownStep", "defaultPlaybackRate",
        "volumeUpStep", "volumeDownStep", "defaultVolume",
        "advanceStep", "rewindStep",
    ];

    chrome.storage.sync.get(names_int, s => {

        names_int.forEach(name => {
            if (s[name] !== undefined) {
                settings[name] = Number(s[name]);
            }
        });

    });

    return settings;
}