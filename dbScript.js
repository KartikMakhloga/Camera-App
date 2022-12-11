let req = indexedDB.open("Camera", 1);
let div = document.querySelector(".container");
let db;

req.addEventListener("success", function () {
  db = req.result;
});
req.addEventListener("upgradeneeded", function () {
  let access = req.result;
  access.createObjectStore("Gallery", { keyPath: "mId" });
});
req.addEventListener("error", function () {
  console.log("error");
});

function addMedia(media, type) {
  if (!db) return;
  let obj = { mId: Date.now(), media, type };
  let tx = db.transaction("Gallery", "readwrite");
  let gallery = tx.objectStore("Gallery");
  gallery.add(obj);
}

function viewMedia() {
  if (!db) return;

  let tx = db.transaction("Gallery", "readonly");
  let gallery = tx.objectStore("Gallery");
  let cursorReq = gallery.openCursor();

  cursorReq.addEventListener("success", function () {
    let cursor = cursorReq.result;
    let MediaContainer = document.createElement("div");
    MediaContainer.classList.add("media-container");
    let LinkForDownload = "";
    if (cursor) {
      let mo = cursor.value;
      if (mo.type == "video") {
        //I have to render a video tag
        let url = window.URL.createObjectURL(cursor.value.media);
        LinkForDownload = url;
        MediaContainer.innerHTML = `<div class="media">
                                    <video src="${url}" autoplay loop controls muted></video>
                                     </div>
                                     <button class="download">Download</button>
                                     <button class="delete">Delete</button>`;
      } else {
        //I have to render a image tag
        LinkForDownload = cursor.value.media;
        MediaContainer.innerHTML = `<div class="media">
                                   <img src="${cursor.value.media}" />
                                   </div>
                                   <button class="download">Download</button>
                                   <button class="delete">Delete</button>`;
      }
      
      

      div.appendChild(MediaContainer);
      console.log(cursor);
      cursor.continue();
    }
  });
}
