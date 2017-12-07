import {
  AfterViewInit, Component, ElementRef, forwardRef, Input, Renderer2, TemplateRef,
  ViewChild
} from '@angular/core';
import { FineUploader } from 'fine-uploader';
import {FilesuploaderService} from "@techmore/fine-uploader/services/filesuploader.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";

@Component({
  selector: 'tm-files-uploader',
  templateUrl: './files-uploader.component.html',
  styleUrls: ['./files-uploader.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilesUploaderComponent),
      multi: true
    }
  ]
})
export class FilesUploaderComponent implements AfterViewInit, ControlValueAccessor {
  propagateChange = (_: any) => {};
  touch =  (_: any) => {};

  writeValue(obj: Array<any>): void {
    if(obj)
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
  setDisabledState(isDisabled: boolean): void{

  }

  @Input() single: boolean = false;
  @Input() serverType: string;
  @ViewChild('filesTemplate')
  tempRef: TemplateRef<any>;

  extendTypes:any = {type: ['jpg', 'jpeg', 'bnp'], size: 500000};
  apiHost = environment.apiHost;
  commonToken = environment.commonToken;
  fineUploader: any;
  dataArray: Array<any>=[]; //Collect all uploader files information
  titleEditBtn: boolean;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private uploadService: FilesuploaderService,
    private http: HttpClient
  ) { }

  ngAfterViewInit(): void {
    const root = document.createElement('div');
    this.tempRef.createEmbeddedView(null).rootNodes.forEach((node) => {//make HTML5 temp transform to DOM element
      root.appendChild(node);
    });
    this.http.get<Array<any>>(this.apiHost + '/api/common/file.upload?type=' + this.serverType)
      .subscribe(data => {
        this.extendTypes = data;
        this.initUploadZone(root);
      });
  }

  initUploadZone(targetNode){
    const _that=this;
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
          _that.touch('');
          _that.propagateChange(this.getAllFiles());
          let item;
          _that.elementRef.nativeElement.querySelectorAll('[qq-file-id]').forEach((value) => {
            item = _that.dataArray.filter(el =>{
              return el ? el.filesId == value.getAttribute('qq-file-id') : false;
            });
            value.getElementsByTagName('a')[0].setAttribute ('href', item.thumbnailUrl);
            value.getElementsByTagName('a')[0].setAttribute ('target', '_target');
          });
          // if(!this.imageSelected){
          //   $('.qq-default-image').find('[type=radio]').eq(0).click();
          // }
          // that.propagateChange(this.getAllFilesList());
        },
        onComplete: (id, name, responseJSON, xhr) => {
          //完成上傳
          if(_that.single) _that.dataArray = [];
          if (responseJSON.success) {
            responseJSON.filesId=id;
            _that.dataArray[id] = responseJSON;
          }
          else
            _that.dataArray[id] = undefined;
        },
        onSubmitDelete: (id) => {
          //點擊刪除按鈕
        },
        onDeleteComplete: (id, xhr, isError) => {
          //完成刪除
          _that.dataArray[id] = undefined;
          _that.propagateChange(this.getAllFiles());
          // const imgWrapList = this.getAllFilesList();
          // that.propagateChange(imgWrapList);
          // this.change.emit(this.dataArray);
          // if (!imgWrapList.length) this.imgExist.emit(false); //show hide title edit btn
        },
        onUpload: (id, name) => {
          //等待上傳中
        },
        onError: (id, name, errorReason, xhr) => {
          console.log(errorReason);
        }
      }
    });

    this.renderer.listen(this.elementRef.nativeElement.getElementsByClassName('clickarea')[0], 'click', (evt) => {
      evt.target.parentNode.getElementsByTagName('input')[0].click()
    });

    if(this.dataArray.length) // init file icon if file already exists
      this.fineUploader.addInitialFiles(this.dataArray);
  }

  getAllFiles(){
    return this.uploadService.getAllFilesList(this.dataArray);
  }
}
