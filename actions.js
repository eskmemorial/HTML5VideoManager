function play(video) {
    video.play();
}

function pause(video) {
    video.pause();
}

function accelerate(video, step) {
    video.playbackRate = Math.min(video.playbackRate + step, 16);
}

function slowDown(video, step) {
    video.playbackRate = Math.max(video.playbackRate - step, 0.1);
}

function setSpeed(video, playbackRate) {
    video.playbackRate = playbackRate;
}

function advance(video, step) {
    video.currentTime = Math.min(video.currentTime + step, video.duration - 1);

    var event = new Event("currenttimechange");
    video.dispatchEvent(event);
}

function rewind(video, step) {
    video.currentTime = Math.max(video.currentTime - step, 0);

    var event = new Event("currenttimechange");
    video.dispatchEvent(event);
}

function volumeUp(video, step) {
    video.volume = Math.min(video.volume + step, 1);
}

function volumeDown(video, step) {
    video.volume = Math.max(video.volume - step, 0);
}

function setVolume(video, volume) {
    video.volume = volume;
}