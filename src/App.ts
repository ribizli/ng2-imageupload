import {Component} from 'angular2/core';

import {ImageUpload, ImageResult, ResizeOptions} from './ImageUpload';

@Component({
    selector: 'my-app',
    template: `
      <img [src]="src" [hidden]="!src">
      <input type="file" image-upload (imageSelected)="selected($event)" [resizeOptions]="resizeOptions">
    `,
    directives: [ImageUpload]
})
export class App {
    
    src: string = "";
    
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 64,
        resizeMaxWidth: 64
    };
    
    selected(imageResult: ImageResult) {
        this.src = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
    }
}
