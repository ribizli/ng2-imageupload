import {Directive, ViewContainerRef,
    OnInit, Input, Output, EventEmitter} from 'angular2/core';

export interface ImageResult {
    file: File;
    url: string;
    dataURL?: string;
    resized?: {
        dataURL: string;
        type: string;
    }
}

export interface ResizeOptions {
    resizeMaxHeight?: number;
    resizeMaxWidth?: number;
    resizeQuality?: number;
    resizeType?: string;
}

@Directive({
    selector: '[image-upload]'
})
export class ImageUpload implements OnInit {

    @Output() imageSelected = new EventEmitter<ImageResult>();

    @Input() resizeOptions: ResizeOptions;

    constructor(private view: ViewContainerRef) {
    }

    ngOnInit() {
        this.view.element.nativeElement.addEventListener('change', e => this.readFiles(e));
    }

    private readFiles(event) {
        for (let file of event.target.files) {
            let result: ImageResult = {
                file: file,
                url: URL.createObjectURL(file)
            };
            this.fileToDataURL(file, result).then(r => this.resize(r)).then(r => this.imageSelected.emit(r));
        }
    }

    private resize(result: ImageResult): Promise<ImageResult> {
        return new Promise((resolve) => {
            if (this.resizeOptions) {
                createImage(result.url, image => {
                    let dataUrl = resizeImage(image, this.resizeOptions);
                    result.resized = {
                        dataURL: dataUrl,
                        type: dataUrl.match(/:(.+\/.+;)/)[1]
                    };
                    resolve(result);
                });
            } else {
                resolve(result);
            }
        });
    }

    private fileToDataURL(file: File, result: ImageResult): Promise<ImageResult> {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = function(e) {
                result.dataURL = reader.result;
                resolve(result);
            };
            reader.readAsDataURL(file);
        });
    }
}


function createImage(url: string, cb: (i: HTMLImageElement) => void) {
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

function resizeImage(origImage: HTMLImageElement, {
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
