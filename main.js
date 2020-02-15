let settings = loadSettings();

let videos = [];

new MutationObserver(mutations => {

    mutations.forEach(mutation => {

        mutation.addedNodes.forEach(addedNode => {

            if (addedNode.nodeName === "VIDEO") {
                videos.push(new Video(addedNode));
            }
        });

        mutation.removedNodes.forEach(removedNode => {

            if (removedNode.nodeName === "VIDEO") {
                videos = videos.filter(video => video.videoId !== removedNode.getAttribute("hvm_video_id"));
            }
        });
    });

}).observe(document, { childList: true, subtree: true, attributes: true, characterData: true });


document.addEventListener("keydown", event => {

    //MutationObserver can't find <video> in websites below (why?).
    //http://video.fc2.com/
    //https://www.dailymotion.com/
    //...

    //Videos in these websites have to be found by querySelectorAll().
    document.querySelectorAll("video").forEach(video => {

        if (video.getAttribute("hvm_video_id") === null) {
            videos.push(new Video(video));
        }
    });

    switch (event.key) {
        case settings["speedUpKey"] || "d":
            videos.forEach(video => {
                video.speedUp(settings["speedUpAmount"] || 0.1);
            });
            break;
        case settings["resetSpeedKey"] || "s":
            videos.forEach(video => {
                video.setSpeed(settings["defaultPlaybackRate"] || 1);
            });
            break;
        case settings["speedDownKey"] || "a":
            videos.forEach(video => {
                video.speedDown(settings["speedDownAmount"] || 0.1);
            });
            break;



        case settings["advanceKey"] || "c":
            videos.forEach(video => {
                video.advance(settings["advanceAmount"] || 10);
            });
            break;
        case settings["rewindKey"] || "z":
            videos.forEach(video => {
                video.rewind(settings["rewindAmount"] || 10);
            });
            break;



        case settings["volumeUpKey"] || "e":
            videos.forEach(video => {
                video.volumeUp(settings["volumeUpAmount"] || 0.1);
            });
            break;
        case settings["resetVolumeKey"] || "w":
            videos.forEach(video => {
                video.setVolume(settings["defaultVolume"] || 0.6);
            });
            break;
        case settings["volumeDownKey"] || "q":
            videos.forEach(video => {
                video.volumeDown(settings["volumeDownAmount"] || 0.1);
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

});


function loadSettings() {

    let settings = {};

    const names_str = [
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

    const names_int = [
        "speedUpAmount", "speedDownAmount", "defaultPlaybackRate",
        "volumeUpAmount", "volumeDownAmount", "defaultVolume",
        "advanceAmount", "rewindAmount",
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