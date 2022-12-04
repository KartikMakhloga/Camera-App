let video = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let isRecording = false;
let recDiv = recordBtn.querySelector("div");
let capBtn = document.querySelector("#capture");
let capDiv = capBtn.querySelector("div");
let mediaRecorder;
let chunks = [];

// navigator is a object in browser in which their is mediaDevices is present which is a child object
// of a navigator. In mediaDevices their is a function called getUserMedia which help us to get
// Permissions of media from the hardware using browser

// startBtn.addEventListener("click", function () {
//   //code for start recording
//   mediaRecorder.start();
// });

// stopBtn.addEventListener("click", function () {
//   //code for stop recording
//   mediaRecorder.stop();
// });

recordBtn.addEventListener("click", function (e) {
  if (isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    recDiv.classList.remove("record-animation");
    video.setAttribute("muted");
  } else {
    mediaRecorder.start();
    isRecording = true;
    recDiv.classList.add("record-animation");
    video.removeAttribute("muted");
  }
});

capBtn.addEventListener("click", function () {
  //code for clicking pic
  if (isRecording) return;

  capDiv.classList.add("capture-animation");
  setTimeout(function () {
    capDiv.classList.remove("capture-animation");
  }, 1000);
  let canvas = document.createElement("canvas");
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0);

  let link = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = link;
  a.download = "img.png";
  a.click();
  a.remove();
  canvas.remove();
});

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then(function (mediaStream) {
    video.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", function (e) {
      let blob = new Blob(chunks, { type: "video/mp4" });
      chunks = [];
      let a = document.createElement("a");
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "video.mp4";
      a.click();
      a.remove();
    });
  })
  .catch(function (err) {
    console.log(err);
  });
