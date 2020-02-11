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