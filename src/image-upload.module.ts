import {NgModule} from '@angular/core';
import {ImageUploadDirective} from './image-upload.directive';

@NgModule({
    declarations: [ImageUploadDirective],
    exports: [ImageUploadDirective]
})
export class ImageUploadModule { }