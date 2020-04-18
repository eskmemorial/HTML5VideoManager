let videos = [];

const findVideos = () => {

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

// MutationObserver cannot find some videos.
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

videoObserver.observe(document, { childList: true, subtree: true });



document.addEventListener("keydown", keyDownEvent => {

    chrome.storage.sync.get(["isEnabled", "settings"], storage => {

        if (storage.isEnabled === false) {
            return;
        }

        if (storage.settings !== undefined) {
            Object.keys(storage.settings).forEach(action => {

                Object.keys(storage.settings[action]).forEach(prop => {

                    settings[action][prop] = storage.settings[action][prop];
                });
            });
        }

        findVideos();

        const targetVideos = videos.filter(video => !video.paused());

        Object.keys(settings)
            .filter(action => settings[action].keyCodeStr !== undefined && settings[action].keyCodeStr === keyDownEvent.code)
            .forEach(action => {
                settings[action].func(targetVideos, settings[action]);
            });
    });
});

