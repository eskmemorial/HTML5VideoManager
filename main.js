let settings = loadSettings();

let videos = [];

new MutationObserver(mutations => {

    mutations.forEach(mutation => {

        mutation.removedNodes.forEach(removedNode => {

            if (removedNode.nodeName === "VIDEO") {
                videos = videos.filter(video => video.videoId !== removedNode.getAttribute("hvm_video_id"));
            }
        });
    });
}).observe(document, { childList: true, subtree: true });


document.addEventListener("keydown", event => {

    //MutationObserver can't find added <video> in websites below (why?).
    //http://video.fc2.com/
    //https://www.dailymotion.com/
    //...

    //Videos in these websites have to be found by querySelectorAll().
    document.querySelectorAll("video").forEach(video => {

        if (video.getAttribute("hvm_video_id") === null) {
            videos.push(new Video(video));
        }
    });


    let targetVideo = videos.filter(video => !video.paused());

    switch (event.key) {
        case settings["speedUpKey"] || "d":
            targetVideo.forEach(video => {
                video.speedUp(settings["speedUpAmount"] || 0.1);
            });
            break;
        case settings["speedDownKey"] || "a":
            targetVideo.forEach(video => {
                video.speedDown(settings["speedDownAmount"] || 0.1);
            });
            break;
        case settings["resetSpeedKey"] || "s":
            targetVideo.forEach(video => {
                video.setSpeed(settings["defaultPlaybackRate"] || 1);
            });
            break;



        case settings["advanceKey"] || "c":
            targetVideo.forEach(video => {
                video.advance(settings["advanceAmount"] || 10);
            });
            break;
        case settings["rewindKey"] || "z":
            targetVideo.forEach(video => {
                video.rewind(settings["rewindAmount"] || 10);
            });
            break;
        case settings["pauseKey"] || "x":
            targetVideo.forEach(video => {
                video.pause();
            });
            break;



        case settings["volumeUpKey"] || "e":
            targetVideo.forEach(video => {
                video.volumeUp(settings["volumeUpAmount"] || 0.1);
            });
            break;
        case settings["volumeDownKey"] || "q":
            targetVideo.forEach(video => {
                video.volumeDown(settings["volumeDownAmount"] || 0.1);
            });
            break;
        case settings["resetVolumeKey"] || "w":
            targetVideo.forEach(video => {
                video.setVolume(settings["defaultVolume"] || 0.6);
            });
            break;




        case settings["showControllerKey"] || "r":
            targetVideo.forEach(video => {
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
        "advanceKey", "rewindKey", "pauseKey",
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