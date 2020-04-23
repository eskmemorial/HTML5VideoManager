let settings = {
    speedUp: {
        keyCodeStr: "KeyS",
        value: 0.1,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeSpeed(setting.value);
            });
        }
    },
    speedDown: {
        keyCodeStr: "KeyA",
        value: 0.1,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeSpeed(-setting.value);
            });
        }
    },
    favoriteSpeed: {
        keyCodeStr: "KeyD",
        value: 2,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                if (video.currentSpeed() === setting.value) {
                    video.setSpeed(1);
                } else {
                    video.setSpeed(setting.value);
                }
            });
        }
    },
    advanceTime: {
        keyCodeStr: "KeyX",
        value: 15,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeCurrentTime(setting.value);
            });
        }
    },
    rewindTime: {
        keyCodeStr: "KeyZ",
        value: 15,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeCurrentTime(-setting.value);
            });
        }
    },
    pause: {
        keyCodeStr: "KeyC",
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.pause();
            });
        }
    },
    abLoop: {
        keyCodeStr: "KeyV",
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.abLoop();
            });
        }
    },
    volumeUp: {
        keyCodeStr: "KeyW",
        value: 0.05,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeVolume(setting.value);
            });
        }
    },
    volumeDown: {
        keyCodeStr: "KeyQ",
        value: 0.05,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeVolume(-setting.value);
            });
        }
    },
    mute: {
        keyCodeStr: "KeyE",
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.setVolume(0);
            });
        }
    },
    showInfoPanel: {
        keyCodeStr: "KeyR",
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.showInfoPanel({ speed: true, volume: true, currentTime: true });
            });
        }
    }
};

