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
// findVideos() picks up those videos.
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





chrome.storage.sync.get("isEnabled", storage => {

    if (storage.isEnabled !== false) {

        videoObserver.observe(document, { childList: true, subtree: true });

        if (document.readyState === 'loading') {

            document.addEventListener('DOMContentLoaded', findVideos);
        } else {
            findVideos();
        }
    } else {
        chrome.runtime.sendMessage({
            type: "setIcon",
            value: { path: "icon64_disabled.png" }
        });
    }
});





document.addEventListener("keydown", keyDownEvent => {

    chrome.storage.sync.get(["isEnabled", "settings"], storage => {

        if (storage.isEnabled === false) {
            return;
        }

        if (storage.settings !== undefined) {
            Object.keys(storage.settings).forEach(action => {

                Object.keys(storage.settings[action]).forEach(prop => {

                    // action 'showController' is a legacy and replaced to 'showInfoPanel'
                    if (settings[action] !== undefined) {

                        settings[action][prop] = storage.settings[action][prop];
                    }
                });
            });
        }

        findVideos();

        const targetVideos = videos.filter(video => !video.paused());

        Object.keys(settings)
            .filter(action => settings[action].keyCodeStr === keyDownEvent.code && settings[action].isEnabled)
            .forEach(action => {
                settings[action].func(targetVideos, settings[action]);
            });
    });
});





chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    switch (message.type) {
        case "enableExtension":

            if (message.value) {

                videoObserver.observe(document, { childList: true, subtree: true });

                findVideos();
            } else {

                videoObserver.disconnect();

                videos.forEach(video => { video.release(); });

                videos = [];
            }
            break;
    }
});