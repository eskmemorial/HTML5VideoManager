class Video {

    video;
    videoId;
    defaultVolume = 1;
    latestInfoPanelTag = "";
    abLoopTime = { a: null, b: null };
    abLoopTimeoutID;

    setSpeedAsLastSpeed = () => {

        chrome.storage.sync.get("lastSpeed", storage => {

            if (storage.lastSpeed !== undefined) {
                this.video.playbackRate = storage.lastSpeed;
            }
        });
    };

    saveLastSpeed = () => {

        chrome.storage.sync.set({ lastSpeed: this.video.playbackRate });
    };

    setBadgeText = () => {

        chrome.runtime.sendMessage({
            type: "setBadgeText",
            value: "x" + this.video.playbackRate.toFixed(2)
        });
    };

    showInfoPanelSpeed = () => {

        this.showInfoPanel({ speed: true });
    };

    showInfoPanelCurrentTime = () => {

        this.showInfoPanel({ currentTime: true });
    };

    showInfoPanelVolume = () => {

        if (this.video.volume === 0) {
            this.showInfoPanel({ mute: true });
        } else {
            this.showInfoPanel({ volume: true });
        }

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

        this.defaultVolume = this.video.volume;

        this.setBadgeText();
        this.setSpeedAsLastSpeed();



        this.video.addEventListener("play", this.setSpeedAsLastSpeed);

        this.video.addEventListener("hvm_ratechanged", this.saveLastSpeed);

        this.video.addEventListener("ratechange", this.setBadgeText);
        this.video.addEventListener("ratechange", this.showInfoPanelSpeed);

        this.video.addEventListener("seeked", this.checkInAB);

        this.video.addEventListener("trycurrenttimechange", this.showInfoPanelCurrentTime);
        this.video.addEventListener("trycurrenttimechange", this.checkInAB);

        this.video.addEventListener("tryvolumechange", this.showInfoPanelVolume);
    }

    release() {

        this.video.removeAttribute("hvm_video_id");
        if (this.video.defaultMuted) {
            this.video.muted = true;
        } else {
            this.video.muted = false;
            this.video.volume = this.defaultVolume;
        }
        this.video.playbackRate = this.video.defaultPlaybackRate;

        clearTimeout(this.abLoopTimeoutID);
        this.abLoopTime.a = null;
        this.abLoopTime.b = null;



        this.video.removeEventListener("play", this.setSpeedAsLastSpeed);

        this.video.removeEventListener("hvm_ratechanged", this.saveLastSpeed);

        this.video.removeEventListener("ratechange", this.setBadgeText);
        this.video.removeEventListener("ratechange", this.showInfoPanelSpeed);

        this.video.removeEventListener("seeked", this.checkInAB);

        this.video.removeEventListener("trycurrenttimechange", this.showInfoPanelCurrentTime);
        this.video.removeEventListener("trycurrenttimechange", this.checkInAB);

        this.video.removeEventListener("tryvolumechange", this.showInfoPanelVolume);
    }

    paused() {

        return this.video.paused;
    }

    currentSpeed() {

        return this.video.playbackRate;
    }

    play() {

        this.video.play();
    }

    pause() {

        this.video.pause();
    }

    changeSpeed(amount) {

        let newSpeed = Math.round((this.video.playbackRate + amount) * 100) / 100;

        newSpeed = newSpeed < 0 ? 0 : newSpeed;
        newSpeed = 16 < newSpeed ? 16 : newSpeed;

        this.video.playbackRate = newSpeed;

        this.video.dispatchEvent(new Event("hvm_ratechanged"));
    }

    setSpeed(playbackRate) {

        this.video.playbackRate = playbackRate;

        this.video.dispatchEvent(new Event("hvm_ratechanged"));
    }

    setDefaultSpeed() {

        this.video.playbackRate = this.video.defaultPlaybackRate;

        this.video.dispatchEvent(new Event("hvm_ratechanged"));
    }

    changeCurrentTime(amount) {

        let newCurrentTime = this.video.currentTime + amount;

        newCurrentTime = newCurrentTime < 0 ? 0 : newCurrentTime;
        newCurrentTime = this.video.duration - 1 < newCurrentTime ? this.video.duration - 1 : newCurrentTime;

        this.video.dispatchEvent(new Event("trycurrenttimechange"));

        this.video.currentTime = newCurrentTime;
    }

    abLoop() {

        if (this.abLoopTime.a === null && this.abLoopTime.b === null) {

            this.abLoopTime.a = this.video.currentTime;
            this.showInfoPanel({ abLoopA: true });
        } else if (this.abLoopTime.a !== null && this.abLoopTime.b === null) {

            this.abLoopTime.b = this.video.currentTime;

            const abLoopRecursive = () => {

                this.video.currentTime = Math.min(this.abLoopTime.a, this.abLoopTime.b);
                this.abLoopTimeoutID = setTimeout(abLoopRecursive, Math.abs(this.abLoopTime.a - this.abLoopTime.b) * 1000 / this.video.playbackRate);
                this.showInfoPanel({ abLoopAB: true });
            };

            abLoopRecursive();

        } else {

            clearTimeout(this.abLoopTimeoutID);
            this.abLoopTime.a = null;
            this.abLoopTime.b = null;
            this.showInfoPanel({ abLoopClear: true });
        }
    }

    changeVolume(amount) {

        let newVolume = Math.round((this.video.volume + amount) * 100) / 100;

        newVolume = newVolume < 0 ? 0 : newVolume;
        newVolume = 1 < newVolume ? 1 : newVolume;

        this.video.dispatchEvent(new Event("tryvolumechange"));

        if (newVolume === 0) {
            this.video.muted = true;
        } else {
            this.video.muted = false;
        }

        this.video.volume = newVolume;
    }

    setVolume(volume) {

        if (volume === 0) {
            this.video.muted = true;
        } else {
            this.video.muted = false;
        }

        this.video.dispatchEvent(new Event("tryvolumechange"));

        this.video.volume = volume;
    }

    //This function is NOT thread safe.
    //You can read comment about flow of process near the end of this function.
    showInfoPanel(config) {

        const removeInfoPanel = (infoPanelTag) => {
            if (document.querySelector(`div[id^="hvm_infopanel${this.videoId}${infoPanelTag}"]`) !== null) {
                document.querySelector(`div[id^="hvm_infopanel${this.videoId}${infoPanelTag}"]`).remove();
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

        const createInfoPanelNode = (infoPanelTag) => {

            let infoPanel = document.createElement("div");
            infoPanel.setAttribute("id", "hvm_infopanel" + this.videoId + infoPanelTag);

            const style = `
            top:${window.pageYOffset + this.video.getBoundingClientRect().top + 5}px;
            left:${window.pageXOffset + this.video.getBoundingClientRect().left + 5}px;
            `;
            infoPanel.setAttribute("style", style);
            infoPanel.innerHTML = "";

            if (config.speed === true) {
                infoPanel.innerHTML += `
            <div class="speed">x${(Math.round(this.video.playbackRate * 100) / 100).toFixed(2)}</div>
            `;
            }
            if (config.volume === true) {
                infoPanel.innerHTML += `
            <div class="volume">${(Math.round(this.video.volume * 100) / 100).toFixed(2)}</div>
            `;
            }
            if (config.mute === true) {
                infoPanel.innerHTML += `
            <div class="mute"></div>
            `;
            }
            if (config.currentTime === true) {

                infoPanel.innerHTML += `
            <div class="time">${formatTime(this.video.currentTime)}</div>
            `;
            }
            if (config.abLoopA === true) {
                infoPanel.innerHTML += `
                <div class="ab-loop-a">${formatTime(Math.min(this.abLoopTime.a || this.video.duration, this.abLoopTime.b || this.video.duration))} -> </div>
                `;
            }
            if (config.abLoopAB === true) {
                infoPanel.innerHTML += `
                <div class="ab-loop-ab">${formatTime(Math.min(this.abLoopTime.a || this.video.duration, this.abLoopTime.b || this.video.duration))} -> ${formatTime(Math.max(this.abLoopTime.a || 0, this.abLoopTime.b || 0))}</div>
                `;
            }
            if (config.abLoopClear === true) {
                infoPanel.innerHTML += `
                <div class="ab-loop-clear"></div>
                `;
            }

            return infoPanel;
        }

        //infoPanelTag is a unique id of infoPanel.
        //This tag is given to infoPanel when infoPanel node is created.

        //remove infoPanel if it already exists.
        removeInfoPanel(this.latestInfoPanelTag);

        const infoPanelTag = Math.random().toString().substr(2, 6);

        document.firstElementChild.appendChild(createInfoPanelNode(infoPanelTag));

        this.latestInfoPanelTag = infoPanelTag;

        //find infoPanel identified by infoPanelTag and remove it after specific time pass.
        //if showInfoPanel() is called before infoPanel is removed by function below,
        //removeInfoPanel(this.latestInfoPanelTag) removes the infoPanel.
        setTimeout(removeInfoPanel, 3 * 1000, infoPanelTag);
    }
}