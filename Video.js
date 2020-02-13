class Video {

    video;
    vmId;

    constructor(video) {
        this.video = video;
        this.videoId = Math.random().toString().substr(2, 6);

        this.video.setAttribute("videoId", this.videoId);

        this.video.addEventListener("ratechange", event => {

            this.showController({ speed: true });
        });

        this.video.addEventListener("currenttimechange", event => {

            this.showController({ currentTime: true });
        });

        this.video.addEventListener("volumechange", event => {

            this.showController({ volume: true });
        });
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

    speedUp(step) {
        this.video.playbackRate = Math.min(this.video.playbackRate + step, 16);
    }

    speedDown(step) {
        this.video.playbackRate = Math.max(this.video.playbackRate - step, 0.1);
    }

    setSpeed(playbackRate) {
        this.video.playbackRate = playbackRate;
    }

    advance(step) {
        this.video.currentTime = Math.min(this.video.currentTime + step, this.video.duration - 1);

        var event = new Event("currenttimechange");
        this.video.dispatchEvent(event);
    }

    rewind(step) {
        this.video.currentTime = Math.max(this.video.currentTime - step, 0);

        var event = new Event("currenttimechange");
        this.video.dispatchEvent(event);
    }

    volumeUp(step) {
        this.video.volume = Math.min(this.video.volume + step, 1);
    }

    volumeDown(step) {
        this.video.volume = Math.max(this.video.volume - step, 0);
    }

    setVolume(volume) {
        this.video.volume = volume;
    }

    showController(config) {

        var removeController = () => {
            if (document.querySelector("#controller" + this.videoId) !== null) {
                document.querySelector("#controller" + this.videoId).remove();
            }
        };

        removeController();

        var controller = document.createElement("div");
        controller.setAttribute("id", "controller" + this.videoId);

        var style = `
    position:fixed;
    top:${this.video.getBoundingClientRect().top + 5}px;
    left:${this.video.getBoundingClientRect().left + 5}px;
    z-index:65535;
    color:white;
    background:black;
    opacity:0.6;
    padding:5px;
    border-radius:3px;
    `;
        controller.setAttribute("style", style);
        controller.innerHTML = "";

        if (config.speed) {
            controller.innerHTML += `
            <div>SPEED x${(Math.round(this.video.playbackRate * 100) / 100).toFixed(2)}</div>
        `;
        }
        if (config.volume) {
            controller.innerHTML += `
            <div>VOLUME ${(Math.round(this.video.volume * 100) / 100).toFixed(2)}</div>
     `;
        }
        if (config.currentTime) {

            var formatTime = time => {

                var date = new Date(Date.UTC(0, 0, 0, 0, 0, time, 0));

                var timeString = "";
                if (date.getUTCHours() > 0) {
                    timeString += `${date.getUTCHours()}:`;
                }
                if (date.getUTCMinutes() > 0 || date.getUTCHours() > 0) {
                    timeString += `${("00" + date.getUTCMinutes()).slice(-2)}:`;
                }

                timeString += `${("00" + date.getUTCSeconds()).slice(-2)}'`;

                return timeString;
            };

            controller.innerHTML += `
            <div>TIME ${formatTime(this.video.currentTime)}</div>
     `;
        }


        document.firstElementChild.appendChild(controller);

        setTimeout(removeController, 6000);

    }




}
