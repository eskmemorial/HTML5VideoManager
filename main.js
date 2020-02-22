let settings = {
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
    reloadSettingsKey: "t",
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

let loadSettings = callback => {

    chrome.storage.sync.get(Object.keys(settings), storage => {

        Object.keys(settings).forEach(name => {

            if (storage[name] !== undefined) {

                if (typeof settings[name] === "string") {
                    settings[name] = storage[name];
                }
                if (typeof settings[name] === "number") {
                    settings[name] = Number(storage[name]);
                }
            }
        });
        callback();
    });
};


loadSettings(() => {
    let event = new Event("settingsloaded");
    document.dispatchEvent(event);
});



document.addEventListener("settingsloaded", () => {

    let videos = [];

    let addUnlistedVideos = () => {

        document.querySelectorAll("video").forEach(video => {

            if (video.getAttribute("hvm_video_id") === null) {
                videos.push(new Video(video));
            }
        });
    };



    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addUnlistedVideos());
    } else {
        addUnlistedVideos();
    }





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
    }).observe(document, { childList: true, subtree: true });




    chrome.runtime.sendMessage(
        {
            type: "setBadgeText",
            value: "x" + settings.lastSpeed.toFixed(2)
        }
    );




    document.addEventListener("keydown", keyDownEvent => {

        //MutationObserver can't find added <video> in websites below (why?).
        //http://video.fc2.com/
        //https://www.dailymotion.com/
        //...

        //Videos in these websites have to be found by querySelectorAll().
        addUnlistedVideos();

        let targetVideo = videos.filter(video => !video.paused());

        switch (keyDownEvent.key) {
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
                loadSettings();
                break;
        }
    });


});

