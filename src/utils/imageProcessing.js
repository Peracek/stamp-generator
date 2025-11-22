import Potrace from 'potrace';

export const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

export const processImage = (img, threshold = 128) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale and threshold
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Luminance formula
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // Invert: We want black ink to be the "shape" (1) and white paper to be background (0)
        // But Potrace expects black to be the foreground.
        // So if it's dark (ink), make it black. If it's light (paper), make it white.
        const val = gray < threshold ? 0 : 255;

        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
};

export const traceBitmap = (canvas) => {
    return new Promise((resolve, reject) => {
        // Create a new Potrace instance
        // Note: Potrace might need to be imported differently depending on the build system
        // We will use the URL of the canvas data
        const src = canvas.toDataURL('image/png');

        Potrace.trace(src, (err, svg) => {
            if (err) reject(err);
            else resolve(svg);
        });
    });
};
