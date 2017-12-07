import {
  AfterViewInit, Component, ElementRef, forwardRef, Input, Renderer2, TemplateRef,
  ViewChild
} from '@angular/core';
import {FineUploader} from 'fine-uploader';
import {HttpClient} from "@angular/common/http";
import {FilesuploaderService} from "@techmore/fine-uploader/services/filesuploader.service";
import {ModalComponent} from "ng2-bs4-modal/lib/components/modal";
import {environment} from "@env/environment";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";

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
export class ImgUploaderComponent implements AfterViewInit, ControlValueAccessor{
  propagateChange = (_: any) => {};
  touch =  (_: any) => {};

  setDisabledState(isDisabled: boolean): void{

  };

  writeValue(obj: Array<any>): void {
    if (obj)
      this.dataArray = obj;
    else
      this.dataArray = [];
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.touch = fn;
  }

  @Input() single: boolean = false;
  @Input() serverType: string;
  @Input() representImg: boolean = true;

  @ViewChild('imgTemplate')
  tempRef: TemplateRef<any>;
  @ViewChild('imgDetail') imgDetail: ModalComponent;

  apiHost = environment.apiHost;
  commonToken = environment.commonToken;
  extendTypes:any = {type: ['jpg', 'jpeg', 'bnp'], size: 500000};
  fineUploader: any;
  dataArray: Array<any> = []; // Collect all uploader files information
  titleEditBtn = false;
  imgList: Array<any>;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private uploadService: FilesuploaderService,
              private http: HttpClient,
              private sanitizer: DomSanitizer
  ) {
  }

  ngAfterViewInit(): void {
    const root = document.createElement('div');
    this.tempRef.createEmbeddedView(null).rootNodes.forEach((node) => {// make HTML5 temp transform to DOM element
      root.appendChild(node);
    });
    // this.initUploadZone(root);
    this.http.get<Array<any>>(this.apiHost + '/api/common/file.upload?type=' + this.serverType)
      .subscribe(data => {
      this.extendTypes = data;
      this.initUploadZone(root);
    });
  }

  initUploadZone(targetNode) {
    const _that = this;
    this.fineUploader = new FineUploader({
      debug: false,
      element: this.elementRef.nativeElement,
      template: targetNode,
      autoUpload: true,
      multiple: !this.single,
      request: {
        endpoint: this.apiHost + '/api/common/file.upload?type=' + this.serverType,
        customHeaders: {
          'common_token': this.commonToken
        }
      },
      deleteFile: {
        enabled: true,
        endpoint: this.apiHost + '/api/common/file.upload?type=' + this.serverType,
        method: "delete",
        customHeaders: {
          'common_token': this.commonToken// this.config.common_token
        }
      },
      thumbnails: {
        placeholders: {
          waitingPath: '/images/fine-uploader/waiting-generic.png',
          notAvailablePath: '/images/fine-uploader/not_available-generic.png'
        }
      },
      validation: {
        allowedExtensions: this.extendTypes.type,
        sizeLimit: this.extendTypes.size
      },
      messages: {
        retryFailTooManyItemsError: '超過檔案上傳數量',
        typeError: '上傳檔案格式不同，允許的檔案格式為: {extensions}.',
        sizeError: '超過檔案最大上傳大小',
      },
      callbacks: {
        onAllComplete: () => {
          this.imgList = this.getAllFiles();
          _that.touch('');
          _that.propagateChange(this.imgList);
          let item;
          _that.elementRef.nativeElement.querySelectorAll('[qq-file-id]').forEach((value) => {
            item = _that.dataArray[value.getAttribute('qq-file-id')];
            value.getElementsByTagName('a')[0].setAttribute('href', item.thumbnailUrl);
            value.getElementsByTagName('a')[0].setAttribute('target', '_target');
            value.getElementsByClassName('qq-default-image')[0].setAttribute('file-id', value.getAttribute('qq-file-id'));
          });

          // photo gallery default image
          if (_that.representImg) {
            _that.setDefaultImageSelector();
            this.titleEditBtn = true; // show hide title edit btn
          }
          // if(!this.imageSelected){
          //   $('.qq-default-image').find('[type=radio]').eq(0).click();
          // }
          // that.propagateChange(this.getAllFilesList());
        },
        onComplete: (id, name, responseJSON, xhr) => {
          //完成上傳
          if (_that.single) _that.dataArray = [];
          if (responseJSON.success) {
            responseJSON.filesId = id;
            responseJSON.represent = false;
            _that.dataArray[id] = responseJSON;
          }
          else _that.dataArray[id] = undefined;
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
          _that.dataArray[id] = undefined;
          _that.propagateChange(this.getAllFiles());
          this.titleEditBtn = false;
        },
        onUpload: (id, name) => {
          // 等待上傳中
          // that.dataArray[id] = {'name': name};
          // that.propagateChange(this.getAllFilesList());
        },
        onError: (id, name, errorReason, xhr) => {
          console.log(errorReason);
        }
      }
    });
    this.renderer.listen(this.elementRef.nativeElement.getElementsByClassName('clickarea')[0], 'click', (evt) => {
      evt.target.parentNode.getElementsByTagName('input')[0].click();
    });
    if (this.dataArray.length){ // init file icon if file already exists
      this.fineUploader.addInitialFiles(this.dataArray);
      // this.fineUploader.find('a').each(function(){
      //   var argu = Array.prototype.slice.call(arguments, 0);
      //   $(argu[2]).attr({
      //     href: argu[0][argu[1]].thumbnailUrl,
      //     target: '_blank'
      //   })
      // }.bind(this, this.dataArray));
    }
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

  getAllFiles(): any {
    return this.uploadService.getAllFilesList(this.dataArray);
  }

  safeURL(imgUrl): any{
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }
}
