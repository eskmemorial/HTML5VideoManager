class Video {

    video;
    videoId;
    latestControllerTag = "";

    constructor(video) {
        this.video = video;
        this.videoId = Math.random().toString().substr(2, 6);

        this.video.setAttribute("hvm_video_id", this.videoId);

        this.video.addEventListener("ratechange", event => {

            this.showController({ speed: true });
        });

        this.video.addEventListener("ratenotchange", event => {

            this.showController({ speed: true });
        });

        this.video.addEventListener("currenttimechange", event => {

            this.showController({ currentTime: true });
        });

        this.video.addEventListener("currenttimenotchange", event => {

            this.showController({ currentTime: true });
        });

        this.video.addEventListener("volumechange", event => {

            this.showController({ volume: true });
        });

        this.video.addEventListener("volumenotchange", event => {

            this.showController({ volume: true });
        });

        this.video.addEventListener("loopchange", event => {

            this.showController({ loop: true });
        });

        this.video.addEventListener("loopnotchange", event => {

            this.showController({ loop: true });
        });
    }

    paused() {
        return this.video.paused;
    }

    looping() {
        return this.video.loop;
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    speedUp(amount) {

        if (this.video.playbackRate === 16) {
            let event = new Event("ratenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.playbackRate = Math.min(this.video.playbackRate + amount, 16);
        }
    }

    speedDown(amount) {

        if (this.video.playbackRate === 0.1) {
            let event = new Event("ratenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.playbackRate = Math.max(this.video.playbackRate - amount, 0.1);
        }
    }

    setSpeed(playbackRate) {
        this.video.playbackRate = playbackRate;
    }

    advance(amount) {

        if (this.video.currentTime === this.video.duration - 1) {
            let event = new Event("currenttimenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.currentTime = Math.min(this.video.currentTime + amount, this.video.duration - 1);

            let event = new Event("currenttimechange");
            this.video.dispatchEvent(event);
        }
    }

    rewind(amount) {

        if (this.video.currentTime === 0) {
            let event = new Event("currenttimenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.currentTime = Math.max(this.video.currentTime - amount, 0);

            let event = new Event("currenttimechange");
            this.video.dispatchEvent(event);
        }
    }

    volumeUp(amount) {

        if (this.video.volume === 1) {
            let event = new Event("volumenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.volume = Math.min(this.video.volume + amount, 1);
        }
    }

    volumeDown(amount) {

        if (this.video.volume === 0) {
            let event = new Event("volumenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.volume = Math.max(this.video.volume - amount, 0);
        }
    }

    setVolume(volume) {

        if (this.video.volume === volume) {
            let event = new Event("volumenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.volume = volume;
        }
    }

    enableLoop() {

        if (this.video.loop) {
            let event = new Event("loopnotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.loop = true;
            let event = new Event("loopchange");
            this.video.dispatchEvent(event);
        }
    }

    disableLoop() {

        if (!this.video.loop) {
            let event = new Event("loopnotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.loop = false;
            let event = new Event("loopchange");
            this.video.dispatchEvent(event);
        }
    }

    showController(config) {

        const removeController = (controllerTag) => {
            if (document.querySelector(`div[id^="hvm_controller${this.videoId}${controllerTag}"]`) !== null) {
                document.querySelector(`div[id^="hvm_controller${this.videoId}${controllerTag}"]`).remove();
            }
        };

        const createControllerNode = (controllerTag) => {

            let controller = document.createElement("div");
            controller.setAttribute("id", "hvm_controller" + this.videoId + controllerTag);

            const style = `
    top:${this.video.getBoundingClientRect().top + 5}px;
    left:${this.video.getBoundingClientRect().left + 5}px;
    `;
            controller.setAttribute("style", style);
            controller.innerHTML = "";

            if (config.speed === true) {
                controller.innerHTML += `
            <div class="speed">SPEED x${(Math.round(this.video.playbackRate * 100) / 100).toFixed(2)}</div>
        `;
            }
            if (config.volume === true) {
                controller.innerHTML += `
            <div class="volume">VOLUME ${(Math.round(this.video.volume * 100) / 100).toFixed(2)}</div>
     `;
            }
            if (config.currentTime === true) {

                const formatTime = time => {

                    const date = new Date(Date.UTC(0, 0, 0, 0, 0, time, 0));

                    let formattedTime = "";
                    if (date.getUTCHours() > 0) {
                        formattedTime += `${date.getUTCHours()}:`;
                    }
                    if (date.getUTCMinutes() > 0 || date.getUTCHours() > 0) {
                        formattedTime += `${("00" + date.getUTCMinutes()).slice(-2)}:`;
                    }

                    formattedTime += `${("00" + date.getUTCSeconds()).slice(-2)}'`;

                    return formattedTime;
                };

                controller.innerHTML += `
            <div class="time">TIME ${formatTime(this.video.currentTime)}</div>
     `;
            }
            if (config.loop === true) {
                controller.innerHTML += `
            <div class="loop">LOOP ${this.video.loop ? "TRUE" : "FALSE"}</div>
     `;
            }

            return controller;
        }




        removeController(this.latestControllerTag);

        const controllerTag = Math.random().toString().substr(2, 6);

        document.firstElementChild.appendChild(createControllerNode(controllerTag));

        this.latestControllerTag = controllerTag;

        setTimeout(removeController, 3 * 1000, controllerTag);

    }

}