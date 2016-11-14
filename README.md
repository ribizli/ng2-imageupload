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
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImageUploadModule } from 'ng2-imageupload';

import { AppComponent }  from './app.component';

@NgModule({
  imports: [ BrowserModule, ImageUploadModule ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

```typescript
import { Component } from '@angular/core';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';

@Component({
    selector: 'my-app',
    template: `
      <img [src]="src" [hidden]="!src"><br>
      <input type="file" image-upload
        (imageSelected)="selected($event)"
        [resizeOptions]="resizeOptions">`
})
export class AppComponent {
    src: string = "";
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 128,
        resizeMaxWidth: 128
    };

    selected(imageResult: ImageResult) {
        this.src = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
    }
}
```
# API
## selector: `input[type=file][image-upload]`

## event: `(imageSelected)`
event fired (async) when the file input changes and the image's `dataURL` is calculated and the image is resized.

```typescript
interface ImageResult {
    file: File;
    url: string;
    error?: string;
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

## property: `[allowedExtensions]`
Array of allowed extensions (e.g. `[jpg, jpeg, png]`). If specified and an input file has different extension the
`imageSelected` event is fired with the error field set to 'Extension Not Allowed'. `dataUrl` and `resize` not calculated
at all.
