import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesUploaderComponent } from './files-uploader/files-uploader.component';
import { TransformToStringPipe } from './pipe/transform-to-string.pipe';
import {FormsModule} from "@angular/forms";
import {ImgUploaderComponent} from "./img-uploader/img-uploader.component";
import { ImgJcropComponent } from './img-jcrop/img-jcrop.component';
import {TransformPipe} from "./pipe/transform.pipe";
import {ModalModule} from "ng2-bs4-modal/lib/ng2-bs4-modal.module";

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
  ],
  declarations: [
    ImgUploaderComponent,
    FilesUploaderComponent,
    ImgJcropComponent,
    TransformToStringPipe,
    TransformPipe
  ],
  exports:[
    ImgUploaderComponent,
    FilesUploaderComponent,
    ImgJcropComponent,
  ]
})
export class FineUploaderModule { }
