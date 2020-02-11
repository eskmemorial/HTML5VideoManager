isVideoPlaying = false;

video = document.querySelector("video");

document.addEventListener("keydown", event => {

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



        case "r":
        case "f":
        case "v":
            showController(video);
            break;



        default:
            break;
    }

});

video.addEventListener("ratechange", event => {

    showController(event.target);
});

video.addEventListener("currenttimechange", event => {

    //showController(event.target);
});

video.addEventListener("volumechange", event => {

    //showController(event.target);
});


function showController(video) {

    var removeController = () => {
        if (document.querySelector("#controller") !== null) {
            document.querySelector("#controller").remove();
        }
    };

    var format = (number) => {
        return (Math.round(number * 100) / 100).toFixed(2);
    };

    removeController();

    var controller = document.createElement("div");
    controller.innerHTML = `
<div id="controller" style="position:fixed; top:10px; left:10px;color:white;background:black;opacity:0.6;padding:5px;border-radius:3px;">
    <div><button onclick="slowDown(document.querySelector('video'))">-</button>  ${format(video.playbackRate)}  <button onclick="accelerate(document.querySelector('video'))">+</button></div>
</div>
    `;

    document.firstElementChild.appendChild(controller);

    setTimeout(removeController, 6000);

}

