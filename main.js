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





document.addEventListener("DOMContentLoaded", event => {

    chrome.runtime.sendMessage(
        {
            type: "setBadgeText",
            value: "x" + settings.lastSpeed.toFixed(2)
        }
    );
});





document.addEventListener("keydown", event => {

    //MutationObserver can't find added <video> in websites below (why?).
    //http://video.fc2.com/
    //https://www.dailymotion.com/
    //...

    //Videos in these websites have to be found by querySelectorAll().
    document.querySelectorAll("video").forEach(video => {

        if (video.getAttribute("hvm_video_id") === null) {
            videos.push(new Video(video, settings.lastSpeed));
        }
    });


    let targetVideo = videos.filter(video => !video.paused());

    switch (event.key) {
        case settings.speedUpKey:
            targetVideo.forEach(video => {
                video.speedUp(settings.speedUpAmount);
            });
            break;
        case settings.speedDownKey:
            targetVideo.forEach(video => {
                video.speedDown(settings.speedDownAmount);
            });
            break;
        case settings.resetSpeedKey:
            targetVideo.forEach(video => {
                video.setSpeed(settings.defaultPlaybackRate);
            });
            break;



        case settings.advanceKey:
            targetVideo.forEach(video => {
                video.advance(settings.advanceAmount);
            });
            break;
        case settings.rewindKey:
            targetVideo.forEach(video => {
                video.rewind(settings.rewindAmount);
            });
            break;
        case settings.pauseKey:
            targetVideo.forEach(video => {
                video.pause();
            });
            break;



        case settings.olumeUpKey:
            targetVideo.forEach(video => {
                video.volumeUp(settings.volumeUpAmount);
            });
            break;
        case settings.volumeDownKey:
            targetVideo.forEach(video => {
                video.volumeDown(settings.volumeDownAmount);
            });
            break;
        case settings.resetVolumeKey:
            targetVideo.forEach(video => {
                video.setVolume(settings.defaultVolume);
            });
            break;




        case settings.showControllerKey:
            targetVideo.forEach(video => {
                video.showController({ speed: true, volume: true, currentTime: true });
            });
            break;
        case settings.reloadSettingsKey:
            settings = loadSettings();
            break;
    }

});


function loadSettings() {

    let settings = {};

    const names_str = {
        speedUpKey: "d",
        speedDownKey: "a",
        resetSpeedKey: "s",
        volumeUpKey: "e",
        volumeDownKey: "q",
        resetVolumeKey: "w",
        advanceKey: "c",
        rewindKey: "z",
        pauseKey: "x",
        showControllerKey: "r",
        reloadSettingsKey: "t"
    };

    chrome.storage.sync.get(Object.keys(names_str), s => {

        Object.keys(names_str).forEach(name => {

            if (s[name] !== undefined) {
                settings[name] = s[name];
            } else {
                settings[name] = names_str[name];
            }
        });
    });



    const names_int = {
        speedUpAmount: 0.1,
        speedDownAmount: 0.1,
        defaultPlaybackRate: 1,
        volumeUpAmount: 0.1,
        volumeDownAmount: 0.1,
        defaultVolume: 0.8,
        advanceAmount: 10,
        rewindAmount: 10,
        lastSpeed: 1,
    };

    chrome.storage.sync.get(Object.keys(names_int), s => {

        Object.keys(names_int).forEach(name => {
            if (s[name] !== undefined) {
                settings[name] = Number(s[name]);
            } else {
                settings[name] = names_int[name];
            }
        });
    });

    return settings;
}