// retrieved from https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API

// git command "git commit -a -m '191026'"
// git push origin main

const TIME_LIMIT = 15000; // 15 secondi

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const audioElement = document.getElementById("audio");
const htmlTimer = document.getElementById("timer");

console.log(startButton, stopButton, audioElement, htmlTimer);

let recorder = null;
let audioChunks = [];
let timerInterval = null;
let stopTimeout = null;

function setupRecorder(stream) {
  recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

  recorder.onstart = () => {
    console.log("recorder started");
  };

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) audioChunks.push(e.data);
  };

  recorder.onstop = () => {
    console.log("recorder stopped");
    clearInterval(timerInterval);
    clearTimeout(stopTimeout);

    const audioBlob = new Blob(audioChunks, { type: recorder.mimeType });
    audioElement.src = URL.createObjectURL(audioBlob);
    audioChunks = [];
  };

  startButton.disabled = false;
}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(setupRecorder) // stream viene passato qui
    .catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`);
    });
} else {
  console.log("getUserMedia not supported on your browser!");
}

startButton.addEventListener("click", () => {
  if (!recorder || recorder.state !== "inactive") return;

  audioChunks = [];
  recorder.start();

  const startTime = Date.now();
  htmlTimer.textContent = "00:00";
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    htmlTimer.textContent = `${minutes}:${15-seconds}`;
  }, 1000);

  stopTimeout = setTimeout(() => {
    if (recorder.state === "recording") recorder.stop();
  }, TIME_LIMIT);
});

stopButton.addEventListener("click", () => {
  if (recorder && recorder.state === "recording") recorder.stop();
});