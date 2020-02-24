//This class is NOT thread safe.
//Don't access latestControllerTag at the same time.
class Video {

    video;
    videoId;
    defaultVolumme = 1;
    latestControllerTag = "";
    abLoopTime = { a: null, b: null };
    abLoopTimeoutID;

    setSpeedAsLastSpeed = () => {
        chrome.storage.sync.get("lastSpeed", storage => {

            this.video.playbackRate = storage.lastSpeed;
        });
    };

    saveSpeed = () => {

        chrome.storage.sync.set({ lastSpeed: this.video.playbackRate }, () => { });
    };

    setBadgeText = () => {

        chrome.runtime.sendMessage(
            {
                type: "setBadgeText",
                value: "x" + this.video.playbackRate.toFixed(2)
            }
        );
    };

    showControllerSpeed = () => {

        this.showController({ speed: true });
    };

    showControllerCurrentTime = () => {

        this.showController({ currentTime: true });
    };

    showControllerVolume = () => {

        this.showController({ volume: true });
    };

    checkInAB = () => {

        if (Math.min(this.abLoopTime.a, this.abLoopTime.b) <= this.video.currentTime && this.video.currentTime <= Math.max(this.abLoopTime.a, this.abLoopTime.b)) {

        } else {
            clearTimeout(this.abLoopTimeoutID);
            this.abLoopTime.a = null;
            this.abLoopTime.b = null;
        }
    }

    constructor(video) {
        this.video = video;
        this.videoId = Math.random().toString().substr(2, 6);

        this.video.setAttribute("hvm_video_id", this.videoId);

        this.defaultVolumme = this.video.volume;

        chrome.runtime.sendMessage(
            {
                type: "setBadgeText",
                value: "x" + this.video.playbackRate.toFixed(2)
            }
        );

        chrome.storage.sync.get("lastSpeed", storage => {

            this.video.playbackRate = storage.lastSpeed;
        });





        this.video.addEventListener("play", this.setSpeedAsLastSpeed);

        this.video.addEventListener("hvm_ratechange", this.saveSpeed);

        this.video.addEventListener("ratechange", this.setBadgeText);
        this.video.addEventListener("ratechange", this.showControllerSpeed);

        this.video.addEventListener("ratenotchange", this.showControllerSpeed);

        this.video.addEventListener("seeked", this.checkInAB);

        this.video.addEventListener("currenttimechange", this.showControllerCurrentTime);
        this.video.addEventListener("currenttimechange", this.checkInAB);

        this.video.addEventListener("currenttimenotchange", this.showControllerCurrentTime);

        this.video.addEventListener("volumechange", this.showControllerVolume);

        this.video.addEventListener("volumenotchange", this.showControllerVolume);
    }

    release() {

        this.video.removeAttribute("hvm_video_id");
        if (this.video.defaultMuted) {
            this.video.muted = true;
        } else {
            this.video.volume = this.defaultVolumme;
        }
        this.video.playbackRate = this.video.defaultPlaybackRate;

        clearTimeout(this.abLoopTimeoutID);
        this.abLoopTime.a = null;
        this.abLoopTime.b = null;



        this.video.removeEventListener("play", this.setSpeedAsLastSpeed);

        this.video.removeEventListener("hvm_ratechange", this.saveSpeed);

        this.video.removeEventListener("ratechange", this.setBadgeText);
        this.video.removeEventListener("ratechange", this.showControllerSpeed);

        this.video.removeEventListener("ratenotchange", this.showControllerSpeed);

        this.video.removeEventListener("seeked", this.checkInAB);

        this.video.removeEventListener("currenttimechange", this.showControllerCurrentTime);
        this.video.removeEventListener("currenttimechange", this.checkInAB);

        this.video.removeEventListener("currenttimenotchange", this.showControllerCurrentTime);

        this.video.removeEventListener("volumechange", this.showControllerVolume);

        this.video.removeEventListener("volumenotchange", this.showControllerVolume);
    }

    paused() {
        return this.video.paused;
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
            let event = new Event("hvm_ratechange");
            this.video.dispatchEvent(event);
        }
    }

    speedDown(amount) {

        if (this.video.playbackRate === 0.1) {
            let event = new Event("ratenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.playbackRate = Math.max(this.video.playbackRate - amount, 0.1);
            let event = new Event("hvm_ratechange");
            this.video.dispatchEvent(event);
        }
    }

    setSpeed(playbackRate) {

        if (this.video.playbackRate === playbackRate) {
            let event = new Event("ratenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.playbackRate = playbackRate;
            let event = new Event("hvm_ratechange");
            this.video.dispatchEvent(event);
        }
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

    abLoop() {

        if (this.abLoopTime.a === null && this.abLoopTime.b === null) {

            this.abLoopTime.a = this.video.currentTime;
            this.showController({ abLoopA: true, abLoopB: false });
        } else if (this.abLoopTime.a !== null && this.abLoopTime.b === null) {

            this.abLoopTime.b = this.video.currentTime;

            let abLoopRecursive = () => {

                this.video.currentTime = Math.min(this.abLoopTime.a, this.abLoopTime.b);
                this.abLoopTimeoutID = setTimeout(abLoopRecursive, Math.abs(this.abLoopTime.a - this.abLoopTime.b) * 1000 / this.video.playbackRate);
                this.showController({ abLoopA: true, abLoopB: true });
            };

            abLoopRecursive();

        } else {

            clearTimeout(this.abLoopTimeoutID);
            this.abLoopTime.a = null;
            this.abLoopTime.b = null;
            this.showController({ abLoopClear: true });
        }
    }

    volumeUp(amount) {

        this.video.muted = false;
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

        this.video.muted = false;
        if (this.video.volume === volume) {
            let event = new Event("volumenotchange");
            this.video.dispatchEvent(event);
        } else {
            this.video.volume = volume;
        }
    }

    //This function is NOT thread safe.
    //You can read comment about flow of process near the end of this function.
    showController(config) {

        const removeController = (controllerTag) => {
            if (document.querySelector(`div[id^="hvm_controller${this.videoId}${controllerTag}"]`) !== null) {
                document.querySelector(`div[id^="hvm_controller${this.videoId}${controllerTag}"]`).remove();
            }
        };

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



                controller.innerHTML += `
            <div class="time">TIME ${formatTime(this.video.currentTime)}</div>
            `;
            }
            if (config.abLoopA === true) {
                controller.innerHTML += `
                <div class="ab-loop-a">LOOP FROM ${formatTime(Math.min(this.abLoopTime.a || this.video.duration, this.abLoopTime.b || this.video.duration))}</div>
                `;
            }
            if (config.abLoopB === true) {
                controller.innerHTML += `
                <div class="ab-loop-b">LOOP TO ${formatTime(Math.max(this.abLoopTime.a || 0, this.abLoopTime.b || 0))}</div>
                `;
            }
            if (config.abLoopClear === true) {
                controller.innerHTML += `
                <div class="ab-loop-clear">LOOP CLEAR</div>
                `;
            }

            return controller;
        }

        //controllerTag is a unique id of controller.
        //This tag is given to controller when controller node is created.

        //remove controller if it already exists.
        removeController(this.latestControllerTag);

        const controllerTag = Math.random().toString().substr(2, 6);

        document.firstElementChild.appendChild(createControllerNode(controllerTag));

        this.latestControllerTag = controllerTag;

        //find controller identified by controllerTag and remove it after specific time pass.
        //if showController() is called before controller is removed by function below,
        //removeController(this.latestControllerTag) removes the controller.
        setTimeout(removeController, 3 * 1000, controllerTag);

    }

}