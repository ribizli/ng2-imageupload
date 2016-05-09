import {ResizeOptions} from './interfaces';

export function createImage(url: string, cb: (i: HTMLImageElement) => void) {
    var image = new Image();
    image.onload = function() {
        cb(image);
    };
    image.src = url;
}

const resizeAreaId = 'imageupload-resize-area';

function getResizeArea() {
    let resizeArea = document.getElementById(resizeAreaId);
    if (!resizeArea) {
        resizeArea = document.createElement('canvas');
        resizeArea.id = resizeAreaId;
        resizeArea.style.visibility = 'hidden';
        document.body.appendChild(resizeArea);
    }

    return <HTMLCanvasElement>resizeArea;
}

export function resizeImage(origImage: HTMLImageElement, {
    resizeMaxHeight,
    resizeMaxWidth,
    resizeQuality = 0.7,
    resizeType = 'image/jpeg'
}: ResizeOptions = {}) {
    
    let canvas = getResizeArea();

    let height = origImage.height;
    let width = origImage.width;

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > resizeMaxWidth) {
            height = Math.round(height *= resizeMaxWidth / width);
            width = resizeMaxWidth;
        }
    } else {
        if (height > resizeMaxHeight) {
            width = Math.round(width *= resizeMaxHeight / height);
            height = resizeMaxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;

    //draw image on canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(origImage, 0, 0, width, height);

    // get the data from canvas as 70% jpg (or specified type).
    return canvas.toDataURL(resizeType, resizeQuality);
}


