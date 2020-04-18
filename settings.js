let settings = {
    speedUp: {
        keyCodeStr: "KeyS",
        amount: 0.1,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.speedUp(setting.amount);
            });
        }
    },
    speedDown: {
        keyCodeStr: "KeyA",
        amount: 0.1,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.speedDown(setting.amount);
            });
        }
    },
    favoriteSpeed: {
        keyCodeStr: "KeyD",
        favoriteSpeed: 2,
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
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.advance(setting.amount);
            });
        }
    },
    rewindTime: {
        keyCodeStr: "KeyZ",
        amount: 15,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.rewind(setting.amount);
            });
        }
    },
    pause: {
        keyCodeStr: "KeyV",
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.pause();
            });
        }
    },
    abLoop: {
        keyCodeStr: "KeyC",
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.abLoop();
            });
        }
    },
    volumeUp: {
        keyCodeStr: "KeyW",
        amount: 0.05,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.volumeUp(setting.amount);
            });
        }
    },
    volumeDown: {
        keyCodeStr: "KeyQ",
        amount: 0.05,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.volumeDown(setting.amount);
            });
        }
    },
    mute: {
        keyCodeStr: "KeyE",
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.setVolume(0);
            });
        }
    },
    showController: {
        keyCodeStr: "KeyR",
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                video.showController({ speed: true, volume: true, currentTime: true });
            });
        }
    }
};

