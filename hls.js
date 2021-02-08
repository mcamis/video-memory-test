function setup(src) {
  const MB_IN_DECIMAL_BYTES = 1000000;
  const BUFFER_SIZE = 31 * MB_IN_DECIMAL_BYTES;
  const video = document.querySelector("video");

  const hls = new Hls({
    enableWorker: false,
    maxBufferSize: BUFFER_SIZE,
    maxMaxBufferLength: 25,
    startLevel: -1,
    liveBackBufferLength: 0,
  });
  hls.loadSource(src);
  hls.attachMedia(video);
  hls.on("hlsManifestParsed", () => hls.media.play());

  hls.on(Hls.Events.ERROR, (_, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          hls.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          console.error("Unrecoverable hls error");
          hls.destroy();
          break;
      }
    }
  });

  const endButton = document.getElementById("endVideo");
  endButton.addEventListener("click", () => {
    hls.streamController.mediaBuffer.remove(0, Infinity);
    hls.destroy();
    video.src = "";
    video.load();
    window.location = "./index.html";
  });

  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", () => {
    window.location.reload();
  });
}
