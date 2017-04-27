import { ResizeOptions } from './interfaces';
import { Exif } from './exif';

export function createImage(url: string) {
    return new Promise<HTMLImageElement>((res, rej) => {
        const image = new Image();
        image.onload = () => res(image);
        image.onerror = rej;
        image.src = url;
    });
}

/**
 * adapted from http://stackoverflow.com/questions/20600800/#40867559
 */
export function resetOrientation(srcBase64): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      let exif = Exif.readFromBinaryFile(Exif.base64ToArrayBuffer(srcBase64));
      let orientation = exif.Orientation;
      if (orientation === 1 || orientation === undefined) {
        resolve(srcBase64);
      }

      let width = img.width;
      let height = img.height;
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext("2d");

      // set proper canvas dimensions before transform & export
      if ([5,6,7,8].indexOf(orientation) > -1) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (orientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height , width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: ctx.transform(1, 0, 0, 1, 0, 0);
      }

      // draw image
      ctx.drawImage(img, 0, 0);

      // export base64
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = srcBase64;
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

export function resizeImage(origImage: HTMLImageElement, {
    resizeMaxHeight,
    resizeMaxWidth,
    resizeQuality = 0.7,
    resizeType = 'image/jpeg'
}: ResizeOptions = {}) {

    let canvas = getResizeArea();

    let height = origImage.height;
    let width = origImage.width;

    if (width > resizeMaxWidth) {
        height = Math.round(height * resizeMaxWidth / width);
        width = resizeMaxWidth;
    }

    if (height > resizeMaxHeight) {
        width = Math.round(width * resizeMaxHeight / height);
        height = resizeMaxHeight;
    }

    canvas.width = width;
    canvas.height = height;

    //draw image on canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(origImage, 0, 0, width, height);

    // get the data from canvas as 70% jpg (or specified type).
    return canvas.toDataURL(resizeType, resizeQuality);
}


