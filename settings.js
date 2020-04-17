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
    resetSpeed: {
        keyCodeStr: "KeyD",
        favoriteSpeed: 2,
        func: (targetVideos, setting) => {

            targetVideos.forEach(video => {
                if (video.currentSpeed() === setting.favoriteSpeed) {
                    video.setDefaultSpeed();
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
    abLoop: {
        keyCodeStr: "KeyC",
        func: (targetVideos, setting) => {
            targetVideos.forEach(video => {
                video.abLoop();
            });
        }
    }
};

