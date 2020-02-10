isVideoPlaying = false;


document.addEventListener("keydown", event => {
    video = document.querySelector("video");

    switch (event.key) {
        case "d":
            accelerate(video);
            break;
        case "s":
            resetSpeed(video);
            break;
        case "a":
            slowDown(video);
            break;



        case "c":
            advance(video);
            break;
        case "x":
            if (isVideoPlaying) {
                pause(video);
                isVideoPlaying = false;
            } else {
                play(video);
                isVideoPlaying = true;
            }
            break;
        case "z":
            rewind(video);
            break;



        case "e":
            volumeUp(video);
            break;
        case "w":
            resetVolume(video);
            break;
        case "q":
            volumeDown(video);
            break;


        default:
            break;
    }



});