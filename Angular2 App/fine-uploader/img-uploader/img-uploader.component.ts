import {
  Component, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, Renderer2, TemplateRef,
  ViewChild
} from '@angular/core';
import {FineUploader} from 'fine-uploader';
import {APP_CONFIG_TOKEN, Config} from "../../../../core/service/config";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {FilesUploaderComponent} from "../files-uploader/files-uploader.component";
import {FilesuploaderService} from "../services/filesuploader.service";
import {Http} from "@angular/http";
import {ImgJcropComponent} from "../img-jcrop/img-jcrop.component";

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
  @Input() showRepresent: boolean = true;
  @Input() crop: boolean = false;
  @ViewChild(ImgJcropComponent) jCrop: ImgJcropComponent;
  imgList: Array<any>;
  selectedId: number;

  @Output() imgSelectedIdxChange = new EventEmitter<number>();
  _imgSelectedIdx: number = 0; // implement a fake two-way binding for Represent Image selected
  @Input()
  get imgSelectedIdx() {
    return this._imgSelectedIdx;
  }

  set imgSelectedIdx(idx: number) {
    this._imgSelectedIdx = idx;
    this.imgSelectedIdxChange.emit(this._imgSelectedIdx);
  }

  fineUploaderCallBack={
    onAllComplete: () => {
      this.imgList = this.getAllFiles();
      this.touch('');
      this.propagateChange(this.imgList);
      let item;
      this.elementRef.nativeElement.querySelectorAll('[qq-file-id]').forEach((value, idx) => {
        item = this.dataArray[value.getAttribute('qq-file-id')];
        value.getElementsByTagName('a')[0].setAttribute('href', item.thumbnailUrl);
        value.getElementsByTagName('a')[0].setAttribute('target', '_target');
        value.getElementsByClassName('qq-default-image')[0].setAttribute('file-id', value.getAttribute('qq-file-id'));
        value.getElementsByClassName('qq-upload-crop-selector')[0].setAttribute('successId', this.imgList[idx].fileid);
      });

      // photo gallery default image
      if (this.showRepresent) {
        this.setDefaultImageSelector();
        this.titleEditBtn = true; // show hide title edit btn
      }
      if(this.crop) this.setCropBtn();
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
              protected http: Http,
              @Inject(APP_CONFIG_TOKEN) protected config: Config,
              private sanitizer: DomSanitizer
  ) {
    super(elementRef, renderer, uploadService, http, config);
  }

  setDefaultImageSelector() {
    const representBtn = this.elementRef.nativeElement.querySelectorAll('.qq-default-image');
    let imgList = this.getAllFiles();
    representBtn.forEach((el) => {
      el.classList.remove('qq-hide');
    });
    $('.qq-default-image').find('[type=radio]').off('click').on('click', (evt) => {
      this.imgSelectedIdx = imgList[$(evt.target).parent().attr('file-id')].fileid;
    });
    if (this.imgSelectedIdx) {
      const indexOfStevie = imgList.findIndex(v => v['fileid'] === this.imgSelectedIdx);
      $('.qq-default-image').find('[type=radio]').eq(indexOfStevie).click();
    }
  }

  setCropBtn(){
    const dataArray = this.getAllFiles();
    this.elementRef.nativeElement.querySelectorAll('.qq-upload-crop-selector').forEach((v, i) =>{
      const squUrl = dataArray[i].transform.filter((img) =>  img.type === 'c');
      const rectUrl = dataArray[i].transform.filter((img) =>  img.type === 'h');
      $(v).off('click').on('click', this.showCropZone.bind(this));
      $(v).data({'squUrl': squUrl, 'rectUrl': rectUrl, 'imgId': v.getAttribute('successid'), 'imgOrg': dataArray[i].thumbnailUrl});
      $(v).show();
    })
  }

  showCropZone(evt){
    evt.preventDefault(); //deny url redirect action
    this.jCrop.showCropDialog(evt.currentTarget.getAttribute('successid'));
  }

  safeURL(imgUrl): any{
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }
}
