export const compressImageFile = (file, maxWidth = 900, quality = 0.78) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      image.onerror = () => reject(new Error("Selected image could not be processed."));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Selected image could not be read."));
    reader.readAsDataURL(file);
  });
