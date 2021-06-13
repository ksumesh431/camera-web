const request = indexedDB.open("camera", 1);
let db;

request.onupgradeneeded = function () {
    db = request.result;
    db.createObjectStore("gallery", { keyPath: "mId" });
}
request.onsuccess = function () {
    db = request.result;
}
request.onerror = function () {
    console.log(e);
}

const addMediaToGallery = (data, type) => {
    const tx = db.transaction("gallery", "readwrite");
    const gallery = tx.objectStore("gallery");
    gallery.add({
        mId: Date.now(),
        type,
        media: data
    })
}

const displayMediaOnPage = () => {
    let body = document.querySelector("body");
    let tx = db.transaction("gallery", "readonly");
    let gallery = tx.objectStore("gallery");
    let container = document.querySelector(".container");

    let req = gallery.openCursor();
    req.onsuccess = function () {
        let cursor = req.result;

        if (cursor) {
            if (cursor.value.type == "video") {


                let vidContainer = document.createElement("div");
                vidContainer.setAttribute("data-mId", cursor.value.mId);
                vidContainer.classList.add("gallery-vid-container", "card");


                let video = document.createElement("video");
                video.controls = true;
                vidContainer.appendChild(video);
                video.src = URL.createObjectURL(cursor.value.media);

                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                let deleteBtn = document.createElement("button");
                deleteBtn.classList.add("gallery-delete-btn", "btn", "btn-danger");
                deleteBtn.innerText = "Delete";
                deleteBtn.addEventListener("click", deleteBtnHandler);

                let downloadBtn = document.createElement("button");
                downloadBtn.classList.add("gallery-download-btn", "btn", "btn-primary");
                downloadBtn.innerText = "Download";
                downloadBtn.addEventListener("click", downloadBtnHandler);

                cardBody.appendChild(deleteBtn);
                cardBody.appendChild(downloadBtn);

                vidContainer.appendChild(cardBody);

                container.appendChild(vidContainer);

            } else {


                let imgContainer = document.createElement("div");
                imgContainer.setAttribute("data-mId", cursor.value.mId);
                imgContainer.classList.add("gallery-img-container", "card");

                let img = document.createElement("img");
                img.src = cursor.value.media;
                imgContainer.appendChild(img);

                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                let deleteBtn = document.createElement("button");
                deleteBtn.classList.add("gallery-delete-btn", "btn", "btn-danger");
                deleteBtn.innerText = "Delete";
                deleteBtn.addEventListener("click", deleteBtnHandler);

                let downloadBtn = document.createElement("button");
                downloadBtn.classList.add("gallery-download-btn", "btn", "btn-primary");
                downloadBtn.innerText = "Download";
                downloadBtn.addEventListener("click", downloadBtnHandler);

                cardBody.appendChild(deleteBtn);
                cardBody.appendChild(downloadBtn);

                imgContainer.appendChild(cardBody);

                container.appendChild(imgContainer);

            }
            cursor.continue();
        }
    }

}

function deleteBtnHandler(e) {
    let mId = e.currentTarget.parentNode.parentNode.getAttribute('data-mId');
    deleteMediaFromGallery(mId);
    e.currentTarget.parentNode.parentNode.remove();
}
function deleteMediaFromGallery(mId) {
    let tx = db.transaction('gallery', 'readwrite');
    let gallery = tx.objectStore('gallery');
    gallery.delete(Number(mId));
}
function downloadBtnHandler(e) {
    let a = document.createElement('a');
    a.href = e.currentTarget.parentNode.parentNode.children[0].src;
    if (e.currentTarget.parentNode.parentNode.children[0].nodeName == 'IMG') {
        a.download = 'image.png';
    }
    else {
        a.download = 'video.mp4';
    }
    a.click();
    a.remove();
}



// class="card" style="width: 18rem;"