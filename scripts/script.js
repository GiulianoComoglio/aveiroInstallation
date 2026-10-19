// retrieved from https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API

// git command "git commit -a -m '191026'"
// git push origin main

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");
  navigator.mediaDevices
    .getUserMedia(
      // constraints - only audio needed for this app
      {
        audio: true,
      },
    )

    // Success callback
    .then((stream) => {})

    // Error callback
    .catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`);
    });
} else {
  console.log("getUserMedia not supported on your browser!");
}

const TIME_LIMIT = 15000; // 15 seconds

const recorder = new MediaRecorder(await navigator.mediaDevices.getUserMedia({ audio: true }));

recorder.onstart = (e) => {
  console.log("recorder started");
}

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const audioElement = document.getElementById("audio");

startButton.addEventListener("click", () => {
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, TIME_LIMIT);
});

stopButton.addEventListener("click", () => {
  recorder.stop();
});

recorder.onstop = (e) => {
  console.log("recorder stopped");
  const audioChunks = [];
  recorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };

  const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
  const audioUrl = URL.createObjectURL(audioBlob);
  audioElement.src = audioUrl;
}; 

