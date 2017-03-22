import { ResizeOptions } from './interfaces';

export function createImage(url: string) {
    return new Promise<HTMLImageElement>((res, rej) => {
        const image = new Image();
        image.onload = () => res(image);
        image.onerror = rej;
        image.src = url;
    });
}

const resizeAreaId = 'imageupload-resize-area';

function getResizeArea() {
    let resizeArea = document.getElementById(resizeAreaId);
    if (!resizeArea) {
        let wrap = document.createElement('div');
        resizeArea = document.createElement('canvas');
        wrap.appendChild(resizeArea);
        wrap.id = 'wrap-' + resizeAreaId;
        wrap.style.position = 'relative';
        wrap.style.overflow = 'hidden';
        wrap.style.width = '0';
        wrap.style.height = '0';
        resizeArea.id = resizeAreaId;
        resizeArea.style.position = 'absolute';
        document.body.appendChild(wrap);
    }

    return <HTMLCanvasElement>resizeArea;
}

function getResizeDimensions(image, maxHeight, maxWidth, method) {
    let height = image.height;
    let width = image.width;

    switch (method) {
        case 'contain':
            // calculate width and height, constraining the proportions
            // scale the image to the largest size such that both its width and
            // its height can fit inside given dimensions
            if (maxHeight !== undefined && height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
            if (maxWidth !== undefined && width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
            break;

        case 'max':
        default:
            // calculate the width and height, constraining the proportions
            // the longer side is used to decide on resize ratio.
            maxHeight = maxHeight || maxWidth;
            maxWidth = maxWidth || maxHeight;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }
            break;
    }

    return {
        width: width,
        height: height,
    };
}

export function resizeImage(origImage: HTMLImageElement, {
    resizeMaxHeight,
    resizeMaxWidth,
    resizeQuality = 0.7,
    resizeType = 'image/jpeg',
    resizeMethod = 'max'
}: ResizeOptions = {}) {

    let canvas = getResizeArea();
    let dimensions = getResizeDimensions(
        origImage, resizeMaxHeight, resizeMaxWidth, resizeMethod);

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    //draw image on canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(origImage, 0, 0, dimensions.width, dimensions.height);

    // get the data from canvas as 70% jpg (or specified type).
    return canvas.toDataURL(resizeType, resizeQuality);
}
