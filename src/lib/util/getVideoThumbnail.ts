export async function getVideoThumbnail(
  videoUrl: string,
  timeInSeconds = 1,
): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.muted = true;
    video.src = videoUrl;

    const onLoadedData = () => {
      video.removeEventListener("loadeddata", onLoadedData);

      const seekTime = Math.min(timeInSeconds, video.duration);
      video.currentTime = seekTime;
    };
    video.addEventListener("loadeddata", onLoadedData);

    video.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.75,
        );
      } catch {
        resolve(null);
      } finally {
        video.remove();
      }
    });

    video.addEventListener("error", (e) => {
      resolve(null);
      video.remove();
    });

    video.load();

    video
      .play()
      .then(() => video.pause())
      .catch(() => {});
  });
}
