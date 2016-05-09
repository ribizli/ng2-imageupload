# ng2-imageupload
A component which resizes the selected input file image

# Install

```
npm install ng2-imageupload
```

Load it via SystemJs:

```
    System.config({
        packages: {        
          'ng2-imageupload': {
              main: 'index.js',
              defaultExtension: 'js'
          }
        },
        map: {
            'ng2-imageupload': 'node_modules/ng2-imageupload'
        }
      });
```

# Usage 

```typescript
import {Component} from 'angular2/core';
import {ImageUpload, ImageResult, ResizeOptions}
  from 'ng-imageupload';

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
event fired (async) when the file input changes and the image's `dataURL` is calculated and the image is resized.

```typescript
interface ImageResult {
    file: File;
    url: string;
    dataURL?: string;
    resized?: {
        dataURL: string;
        type: string;
    }
}
```

## property: `[resizeOptions]`

 - `resizeMaxHeight`
 - `resizeMaxWidth`
 - `resizeQuality`: default: `0.7`
 - `resizeType`: default: `image/jpeg` 

Always the longer side is used to decide on resize ratio.