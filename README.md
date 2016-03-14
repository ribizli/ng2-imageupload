# ng2-imageupload
A component which resizes the selected file image

# Usage 

```typescript
import {Component} from 'angular2/core';
import {ImageUpload, ImageResult, ResizeOptions}
  from 'ng-imageupload/ImageUpload';

@Component({
    selector: 'my-app',
    template: `
      <img [src]="src" [hidden]="!src">
      <input type="file" image-upload
        (imageSelected)="selected($event)"
        [resizeOptions]="resizeOptions">
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
        this.src = imageResult.resized 
          && imageResult.resized.dataURL
          || imageResult.dataURL;
    }
}
```
# API
## selector: `[image-upload]`

## event: `(imageSelected)`
event fired when the file input changes and the image's `dataURL` is calculated and the image is resized.

## property: `[resizeOptions]`

 - `resizeMaxHeight`
 - `resizeMaxWidth`
 - `resizeQuality`: default: `0.7`
 - `resizeType`: default: `image/jpeg` 

Always the longer side is used to decide on resize ratio.