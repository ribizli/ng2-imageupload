import {
    Directive, ElementRef,
    OnInit, Input, Output, EventEmitter, Renderer, HostListener
} from '@angular/core';

import { ImageResult, ResizeOptions } from './interfaces';
import { createImage, resizeImage } from './utils';

@Directive({
    selector: 'input[type=file][image-upload]'
})
export class ImageUploadDirective {

    @Output() imageSelected = new EventEmitter<ImageResult>();

    @Input() resizeOptions: ResizeOptions;
    private _allowedExtensions: string[];
    
    @Input()
    get allowedExtensions() {
        return this._allowedExtensions;
    }

    set allowedExtensions(allowed: string[]) {
        this._allowedExtensions = allowed && allowed.map(a => a.toLowerCase());
    }


    constructor(private _elementref: ElementRef, private _renderer: Renderer) {
    }

    @HostListener('change', ['$event'])
    private readFiles(event) {
        for (let file of event.target.files as File[]) {
            let result: ImageResult = {
                file: file,
                url: URL.createObjectURL(file)
            };
            let ext: string = file.name.split('.').pop();
            ext = ext && ext.toLowerCase();
            if (ext && this.allowedExtensions && this.allowedExtensions.length && this.allowedExtensions.indexOf(ext) === -1) {
                result.error = 'Extension Not Allowed';
                this.imageSelected.emit(result);
            } else {
                this.fileToDataURL(file, result).then(r => this.resize(r))
                    .then(r => this.imageSelected.emit(r))
                    .catch(e => {
                        result.error = 'Image processing error';
                        this.imageSelected.emit(result);
                    });
            }
        }
    }

    private resize(result: ImageResult): Promise<ImageResult> {
        if (!this.resizeOptions) return Promise.resolve(result);
        return createImage(result.url).then(image => {
            let dataUrl = resizeImage(image, this.resizeOptions);
            result.resized = {
                dataURL: dataUrl,
                type: dataUrl.match(/:(.+\/.+;)/)[1]
            };
            return result;
        });
    }

    private fileToDataURL(file: File, result: ImageResult): Promise<ImageResult> {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = function (e) {
                result.dataURL = reader.result;
                resolve(result);
            };
            reader.readAsDataURL(file);
        });
    }
}


