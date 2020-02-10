function play(video) {
    video.play();
}

function pause(video) {
    video.pause();
}

function accelerate(video) {
    video.playbackRate += 0.1;
}

function slowDown(video) {
    video.playbackRate -= 0.1;
}

function resetSpeed(video) {
    video.playbackRate = 1;
}

function advance(video) {
    video.currentTime += 10;
}

function rewind(video) {
    video.currentTime -= 10;
}

function volumeUp(video) {
    video.volume += 0.05;
}

function volumeDown(video) {
    video.volume -= 0.05;
}

function resetVolume(video) {
    video.volume = 0.5;
}