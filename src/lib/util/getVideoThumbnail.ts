export async function getVideoThumbnail(
  videoUrl: string,
): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.muted = true;
    video.src = videoUrl;

    const onLoadedData = () => {
      video.removeEventListener("loadeddata", onLoadedData);

      video.currentTime = Math.floor(Math.random() * video.duration);
    };
    video.addEventListener("loadeddata", onLoadedData);

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      try {
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
      }

      video.remove();
      canvas.remove();
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
