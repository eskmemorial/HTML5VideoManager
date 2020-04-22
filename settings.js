let settings = {
    speedUp: {
        keyCodeStr: "KeyS",
        amount: 0.1,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeSpeed(setting.amount);
            });
        }
    },
    speedDown: {
        keyCodeStr: "KeyA",
        amount: 0.1,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeSpeed(-setting.amount);
            });
        }
    },
    favoriteSpeed: {
        keyCodeStr: "KeyD",
        favoriteSpeed: 2,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                if (video.currentSpeed() === setting.favoriteSpeed) {
                    video.setSpeed(1);
                } else {
                    video.setSpeed(setting.favoriteSpeed);
                }
            });
        }
    },
    advanceTime: {
        keyCodeStr: "KeyX",
        amount: 15,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeCurrentTime(setting.amount);
            });
        }
    },
    rewindTime: {
        keyCodeStr: "KeyZ",
        amount: 15,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeCurrentTime(-setting.amount);
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
        amount: 0.05,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeVolume(setting.amount);
            });
        }
    },
    volumeDown: {
        keyCodeStr: "KeyQ",
        amount: 0.05,
        isEnabled: true,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.changeVolume(-setting.amount);
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

