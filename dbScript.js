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

function deleteMedia(id){
    if (!db) return;
    let tx = db.transaction("Gallery", "readwrite");
    let gallery = tx.objectStore("Gallery");
    // when we set id as an attribute to delete btn it becomes a string but we have store the id as a number in db
    // so we have to typecast
    gallery.delete(Number(id));
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
                                     <button class="delete" data-id="${mo.mId}">Delete</button>`;
      } else {
        //I have to render a image tag
        LinkForDownload = cursor.value.media;
        MediaContainer.innerHTML = `<div class="media">
                                   <img src="${cursor.value.media}" />
                                   </div>
                                   <button class="download">Download</button>
                                   <button class="delete" data-id="${mo.mId}">Delete</button>`;
      }
      let downloadBtn = MediaContainer.querySelector(".download");
      
      downloadBtn.addEventListener("click", function () {
        let a = document.createElement("a");
        a.href = LinkForDownload;
        if(mo.type=="video"){
            a.download = "video.mp4";
        }else{
            a.download = "img.png";
        }
        a.click();
        a.remove();
      });
       
      let deleteBtn = MediaContainer.querySelector(".delete");

      deleteBtn.addEventListener("click",function(e){
          //removing from db
          let id = e.currentTarget.getAttribute("data-id");
          deleteMedia(id);
          //removing from UI 
          e.currentTarget.parentElement.remove();
      })
      div.appendChild(MediaContainer);
      cursor.continue();
    }
  });
}
