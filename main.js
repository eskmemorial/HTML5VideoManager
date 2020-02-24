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
    abLoopKey: "v",
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
    enable: true
};

let loadSettings = callback => {

    chrome.storage.sync.get(Object.keys(settings), storage => {

        Object.keys(settings).forEach(name => {

            if (storage[name] !== undefined) {
                settings[name] = storage[name];
            }
        });

        callback();
    });
};






let videos = [];

let makeVideoList = () => {

    document.querySelectorAll("video").forEach(video => {

        if (video.getAttribute("hvm_video_id") === null) {
            videos.push(new Video(video));
        }
    });

    let videoIds = [];

    document.querySelectorAll("video").forEach(video => {

        if (video.getAttribute("hvm_video_id") !== null) {
            videoIds.push(video.getAttribute("hvm_video_id"));
        }
    });

    videos = videos.filter(video => videoIds.find(id => video.videoId === id) !== undefined);
};

let videoObserver = new MutationObserver(mutations => {

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
});








loadSettings(() => {
    let event = new Event("settingsloaded");
    document.dispatchEvent(event);
});

document.addEventListener("settingsloaded", () => {

    if (settings.enable) {

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', makeVideoList());
        } else {
            makeVideoList();
        }

        videoObserver.observe(document, { childList: true, subtree: true });
    } else {
        chrome.runtime.sendMessage(
            {
                type: "setIcon",
                value: { path: "icon64_disabled.png" }
            }
        );
    }










    document.addEventListener("keydown", keyDownEvent => {

        chrome.storage.sync.get("enable", storage => {

            if (storage.enable === false) {
                return;
            }


            //MutationObserver can't find added <video> in websites below (why?).
            //http://video.fc2.com/
            //https://www.dailymotion.com/
            //...

            //Videos in these websites have to be found by querySelectorAll().
            makeVideoList();



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
                case settings.abLoopKey:
                    targetVideo.forEach(video => {
                        video.abLoop();
                    });
                    break;



                case settings.volumeUpKey:
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
                    loadSettings(() => { });
                    break;
            }

        });
    });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "extensionEnable") {

        if (message.value) {

            makeVideoList();
            videoObserver.observe(document, { childList: true, subtree: true });
        } else {

            videos.forEach(video => { video.release(); });

            videos = [];

            videoObserver.disconnect();
        }
    }
});