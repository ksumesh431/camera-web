let videoElem = document.querySelector("video");
let videoRecorder = document.querySelector("#record-video");
let captureBtn = document.querySelector("#capture");
let timingELem = document.querySelector(".timing");
let clearObj;  // for setInterval 
let uiFilter = document.querySelector(".ui-filter");
let allFilters = document.querySelectorAll(".filter");
let zoomInBtn = document.querySelector("#plus-container");
let zoomOutBtn = document.querySelector("#minus-container");
let filterColor = "";
let zoomLevel = 1;
let galleryBtn = document.querySelector(".gallery");
galleryBtn.onclick = (e) => {
    location.assign("gallery.html");
}


let constraints = {
    video: true,
    audio: true
}
let mediaRecorder;
let buffer = [];
let recordState = false;

navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
        videoElem.srcObject = mediaStream;
        mediaRecorder = new MediaRecorder(mediaStream);  //gives media recorder object which takes the mediastream containing video and audio

        mediaRecorder.addEventListener("dataavailable", function (e) {//recording start event
            buffer.push(e.data);//data will have video and audio
        })
        mediaRecorder.addEventListener("stop", function (e) {//recording stop event
            let blob = new Blob(buffer, { type: "video/mp4" });
            addMediaToGallery(blob,'video');

            // const url = window.URL.createObjectURL(blob);

            // let a = document.createElement("a");
            // a.download = "file.mp4";
            // a.href = url;
            // a.click();
            buffer = [];  //empty buffer so that can use again
        })
    })
    .catch(function (err) {
        console.log(err);
    })


videoRecorder.addEventListener("click", function () {
    if (!mediaRecorder) {
        alert("give permission");
    }

    if (recordState == false) {
        startTimer();
        mediaRecorder.start();
        videoRecorder.classList.add("internalAnim");
        recordState = true;
    } else {
        stopTimer();
        mediaRecorder.stop();
        videoRecorder.classList.remove("internalAnim");
        recordState = false;
    }
})
function startTimer() {
    timingELem.classList.add("timing-active");
    let timeCount = 0;
    clearObj = setInterval(function () {
        let seconds = (timeCount % 60) < 10 ? `0${timeCount % 60}` : `${timeCount % 60}`;
        let minutes = (timeCount / 60) < 10 ? `0${Number.parseInt(timeCount / 60)}` : `${Number.parseInt(timeCount / 60)}`;
        let hours = (timeCount / 3600) < 10 ? `0${Number.parseInt(timeCount / 3600)}` : `${Number.parseInt(timeCount / 3600)}`;
        timingELem.innerText = `${hours}:${minutes}:${seconds}`;
        timeCount++;
    }, 1000);

}
function stopTimer() {
    timingELem.classList.remove("timing-active");
    timingELem.innerText = "00:00:00";
    clearInterval(clearObj);
}



captureBtn.addEventListener("click", function () {

    captureBtn.classList.add("internalAnimForCapture");
    let canvas = document.createElement("canvas");
    canvas.width = videoElem.videoWidth;
    canvas.height = videoElem.videoHeight;

    let tool = canvas.getContext("2d");

    //to flip
    tool.translate(videoElem.videoWidth, 0); //move the drawing cursor to the top right edge
    tool.scale(-1, 1); //flip the image horizontally
    //``````

    tool.scale(zoomLevel, zoomLevel);//scale zooms the canvas

    let x = (canvas.width / zoomLevel - canvas.width) / 2;  //code from stackoverflow to enable zoom from center
    let y = (canvas.height / zoomLevel - canvas.height) / 2;


    tool.drawImage(videoElem, x, y); //draw current frame of video on canvas
    if (filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    let link = canvas.toDataURL(); //gets link for canvas
    addMediaToGallery(link,"img");  //image will be in base64 format

    // let anchor = document.createElement("a");
    // anchor.href = link;
    // anchor.download = "file.png";
    // anchor.click();

    // anchor.remove();
    canvas.remove();
    setTimeout(function () {
        captureBtn.classList.remove("internalAnimForCapture");
    }, 1000)

})


for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", function () {
        let color = allFilters[i].style.backgroundColor;
        if (color) {
            uiFilter.classList.add("ui-filter-active");
            uiFilter.style.backgroundColor = color;
            filterColor = color;
        } else {
            uiFilter.classList.remove("ui-filter-active");
            uiFilter.style.backgroundColor = "";
            filterColor = "";
        }
    })
}

zoomInBtn.addEventListener("click", function (e) {
    if (zoomLevel < 3) {
        zoomLevel += 0.2;
        videoElem.style.transform = `scale(${zoomLevel})`
    }
})
zoomOutBtn.addEventListener("click", function (e) {
    if (zoomLevel > 1) {
        zoomLevel -= 0.2;
        videoElem.style.transform = `scale(${zoomLevel})`
    }
})


