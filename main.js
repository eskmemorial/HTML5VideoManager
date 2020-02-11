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

    showController(video);

});

function showController(video) {

    var removeController = () => {
        if (document.querySelector("#controller") !== null) {
            document.querySelector("#controller").remove();
        }
    };

    removeController();

    var controller = document.createElement("div");
    controller.innerHTML = `
<div id="controller" style="position:fixed; top:10px; left:10px;">
    <div>${video.currentTime}</div>
    <div>${video.playbackRate}</div>
    <div>${video.volume}</div>
</div>
    `;

    document.firstElementChild.appendChild(controller);

    setTimeout(removeController, 10000);

}

