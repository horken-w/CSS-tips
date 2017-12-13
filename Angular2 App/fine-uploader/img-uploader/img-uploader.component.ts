import {
  Component, ElementRef, forwardRef, Input, Renderer2, TemplateRef,
  ViewChild
} from '@angular/core';
import {FineUploader} from 'fine-uploader';
import {HttpClient} from "@angular/common/http";
import {FilesuploaderService} from "@techmore/fine-uploader/services/filesuploader.service";
import {ModalComponent} from "ng2-bs4-modal/lib/components/modal";
import {environment} from "@env/environment";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {FilesUploaderComponent} from "@techmore/fine-uploader/files-uploader/files-uploader.component";

@Component({
  selector: 'tm-img-uploader',
  templateUrl: './img-uploader.component.html',
  styleUrls: ['./img-uploader.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImgUploaderComponent),
      multi: true
    }
  ]
})
export class ImgUploaderComponent extends FilesUploaderComponent implements ControlValueAccessor{
  @Input() representImg: boolean = true;
  imgList: Array<any>;
  fineUploaderCallBack={
    onAllComplete: () => {
      this.imgList = this.getAllFiles();
      this.touch('');
      this.propagateChange(this.imgList);
      let item;
      this.elementRef.nativeElement.querySelectorAll('[qq-file-id]').forEach((value) => {
        item = this.dataArray[value.getAttribute('qq-file-id')];
        value.getElementsByTagName('a')[0].setAttribute('href', item.thumbnailUrl);
        value.getElementsByTagName('a')[0].setAttribute('target', '_target');
        value.getElementsByClassName('qq-default-image')[0].setAttribute('file-id', value.getAttribute('qq-file-id'));
      });

      // photo gallery default image
      if (this.representImg) {
        this.setDefaultImageSelector();
        this.titleEditBtn = true; // show hide title edit btn
      }
      // if(!this.imageSelected){
      //   $('.qq-default-image').find('[type=radio]').eq(0).click();
      // }
      // that.propagateChange(this.getAllFilesList());
    },
    onComplete: (id, name, responseJSON, xhr) => {
      //完成上傳
      if (this.single) this.dataArray = [];
      if (responseJSON.success) {
        responseJSON.filesId = id;
        responseJSON.represent = false;
        this.dataArray[id] = responseJSON;
      }
      else this.dataArray[id] = undefined;
      // if (responseJSON.success) {
      //   that.dataArray[id] = responseJSON;
      //   const imageSuccess = this.getAllFilesList().length-1;
      //   that.target.find('[qq-file-id]').each(function () {
      //     const argu = Array.prototype.slice.call(arguments, 0);
      //     if ($(argu[4]).attr('qq-file-id') == argu[0]) {
      //       $(argu[4]).find('.qq-upload-crop-selector').data({
      //         'crop': argu[1].success,
      //         'successId': argu[2]
      //       });
      //       $(argu[4]).find('a').attr({
      //         href: argu[1].thumbnailUrl,
      //         target: '_target'
      //       });
      //     }
      //   }.bind(this, id, responseJSON, imageSuccess));
      //   if(this.crop) this.setCropBtn();
      //   //ckeditor single file upload
      //   if ($('#uploadfile').length)
      //     $('#uploadfile').text(name);
      //
      // }
      // else
      //   that.dataArray[id] = undefined;
    },
    onSubmitDelete: (id) => {
      //點擊刪除按鈕
    },
    onDeleteComplete: (id, xhr, isError) => {
      //完成刪除
      this.dataArray[id] = undefined;
      this.propagateChange(this.getAllFiles());
      if(!this.getAllFiles().length) this.titleEditBtn = false;
    },
    onUpload: (id, name) => {
      // 等待上傳中
      // that.dataArray[id] = {'name': name};
      // that.propagateChange(this.getAllFilesList());
    },
    onError: (id, name, errorReason, xhr) => {
      console.log(errorReason);
    }
  };

  constructor(protected elementRef: ElementRef,
              protected renderer: Renderer2,
              protected uploadService: FilesuploaderService,
              protected http: HttpClient,
              private sanitizer: DomSanitizer
  ) {
    super(elementRef, renderer, uploadService, http);
  }

  setDefaultImageSelector() {
    const representBtn = this.elementRef.nativeElement.querySelectorAll('.qq-default-image');
    let selectedidx = -1, imgList = this.getAllFiles();
    const setReoresentImg = (evt) => {
      imgList = this.uploadService.resetAllRepresentImg(imgList);
      imgList[evt.target.parentNode.getAttribute('file-id')].represent = true;
    };
    selectedidx = imgList.findIndex(v => v.hasOwnProperty('represent') ? v.represent : false);
    representBtn.forEach((el, idx) => {
      el.classList.remove('qq-hide');
      el.removeEventListener('click', setReoresentImg);
      el.addEventListener('click', setReoresentImg);
      if (idx === selectedidx) el.querySelectorAll('[type=radio]')[0].checked = true;
    });
  }

  addImageDescription(node){
    const id = node.target.dataset.imgId.toString(),
    selectedItem = this.dataArray.filter(v => v.fileid === +id);

    selectedItem[0].description = node.target.value;
  }

  safeURL(imgUrl): any{
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }
}
