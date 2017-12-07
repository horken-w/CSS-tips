import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImgUploaderComponent} from "@techmore/fine-uploader/img-uploader/img-uploader.component";
import { FilesUploaderComponent } from './files-uploader/files-uploader.component';
import {FilesuploaderService} from "@techmore/fine-uploader/services/filesuploader.service";
import {ModalModule} from "ng2-bs4-modal/lib/ng2-bs4-modal.module";
import { ImageCroperDirective } from './directive/image-croper.directive';
import { TransformToStringPipe } from './pipe/transform-to-string.pipe';
import {TransformPipe} from "@techmore/fine-uploader/pipe/transform.pipe";

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
  ],
  declarations: [
    ImgUploaderComponent,
    FilesUploaderComponent,
    ImageCroperDirective,
    TransformToStringPipe,
    TransformPipe
  ],
  exports:[
    ImgUploaderComponent,
    FilesUploaderComponent,
    ImageCroperDirective,
    TransformPipe
  ],
  providers: [
    FilesuploaderService,
  ]
})
export class FineUploaderModule { }
