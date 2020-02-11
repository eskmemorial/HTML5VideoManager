var settings = loadSettings();

var isVideoPlaying = false;

var video = document.querySelector("video");

document.addEventListener("keydown", event => {

    switch (event.key) {
        case settings["accelerateKey"] || "f":
            accelerate(video, settings["accelerateStep"]);
            break;
        case settings["resetSpeedKey"] || "d":
            setSpeed(video, settings["defaultPlaybackRate"]);
            break;
        case settings["slowDownKey"] || "s":
            slowDown(video, settings["slowDownStep"]);
            break;



        case settings["advanceKey"] || "v":
            advance(video, settings["advanceStep"]);
            break;
        case settings["playOrPauseKey"] || "c":
            if (isVideoPlaying) {
                pause(video);
                isVideoPlaying = false;
            } else {
                play(video);
                isVideoPlaying = true;
            }
            break;
        case settings["rewindKey"] || "x":
            rewind(video, settings["rewindStep"]);
            break;



        case settings["volumeUpKey"] || "r":
            volumeUp(video, settings["volumeUpStep"]);
            break;
        case settings["resetVolumeKey"] || "e":
            setVolume(video, settings["defaultVolume"]);
            break;
        case settings["volumeDownKey"] || "w":
            volumeDown(video, settings["volumeDownStep"]);
            break;



        case settings["showControllerKey"] || "z":
            showController(video);
            break;



        default:
            break;
    }

});

video.addEventListener("ratechange", event => {

    showController(event.target);
});

video.addEventListener("currenttimechange", event => {

    //showController(event.target);
});

video.addEventListener("volumechange", event => {

    //showController(event.target);
});

function loadSettings() {

    var settings = {};

    var names_str = [
        "accelerateKey", "slowDownKey", "resetSpeedKey",
        "volumeUpKey", "volumeDownKey", "resetVolumeKey",
        "advanceKey", "rewindKey", "playOrPauseKey",
        "showControllerKey"
    ];

    chrome.storage.sync.get(names_str, s => {

        names_str.forEach(name => {
            if (s[name] !== undefined) {
                settings[name] = s[name];
            }
        });

    });

    names_int = [
        "accelerateStep", "slowDownStep", "defaultPlaybackRate",
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

