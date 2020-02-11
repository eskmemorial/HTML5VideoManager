function play(video) {
    video.play();
}

function pause(video) {
    video.pause();
}

function accelerate(video) {
    video.playbackRate = Math.min(video.playbackRate + 0.1, 64);
}

function slowDown(video) {
    video.playbackRate = Math.max(video.playbackRate - 0.1, 0.1);
}

function resetSpeed(video) {
    video.playbackRate = video.defaultPlaybackRate;
}

function advance(video) {
    video.currentTime = Math.min(video.currentTime + 10, video.duration - 1);
}

function rewind(video) {
    video.currentTime = Math.max(video.currentTime - 10, 0);
}

function volumeUp(video) {
    video.volume = Math.min(video.volume + 0.05, 1);
}

function volumeDown(video) {
    video.volume = Math.max(video.volume - 0.05, 0);
}

function resetVolume(video) {
    video.volume = 0.5;
}