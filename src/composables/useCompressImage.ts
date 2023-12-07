export const useCompressImage = () => {
  const compressImages = (images: string[]) => {
    return Promise.all(images.map(compressImage));
  };

  const compressImage = (image: string) => {
    return new Promise<string>((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const targetWidth = 150;
        const targetHeight = 150;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

        const compressedImage = canvas.toDataURL('image/jpeg');
        resolve(compressedImage);
      };

      img.src = image;
    });
  };

  return {
    compressImage,
    compressImages,
  };
};
