import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesUploaderComponent } from './files-uploader/files-uploader.component';
import { ImageCroperDirective } from './directive/image-croper.directive';
import { TransformToStringPipe } from './pipe/transform-to-string.pipe';
import {FormsModule} from "@angular/forms";
import {Ng2Bs3ModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import {TransformPipe} from "./pipe/transform.pipe";
import {ImgUploaderComponent} from "./img-uploader/img-uploader.component";
import {FilesuploaderService} from "./services/filesuploader.service";
import { ImgJcropComponent } from './img-jcrop/img-jcrop.component';

@NgModule({
  imports: [
    CommonModule,
    Ng2Bs3ModalModule,
    FormsModule,
  ],
  declarations: [
    ImgUploaderComponent,
    FilesUploaderComponent,
    ImageCroperDirective,
    TransformToStringPipe,
    TransformPipe,
    ImgJcropComponent
  ],
  exports:[
    ImgUploaderComponent,
    FilesUploaderComponent,
    ImageCroperDirective,
    TransformPipe,
    ImgJcropComponent
  ],
  providers: [
    FilesuploaderService,
  ]
})
export class FineUploaderModule { }
