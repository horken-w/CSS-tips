import {
  Component, ElementRef, forwardRef, Input, OnChanges, Renderer2, SimpleChanges, TemplateRef, ViewChild
} from '@angular/core';
import { FineUploader } from 'fine-uploader';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

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
export class FilesUploaderComponent implements OnChanges, ControlValueAccessor {
  @Input() single = false;
  @Input() serverType: string;
  @Input() showDetail: boolean = true;
  @Input() name: string;
  @Input() extendTypes: any = {type: [], size: 500000};
  @ViewChild('filesTemplate')
  tempRef: TemplateRef<any>;

  apiHost = 'http://localhost:8080';
  commonToken = '8CC1C549-35D7-4691-9E1D-67D8EC7951B5';
  fineUploader: any;
  dataArray: Array<any> = []; // Collect all uploader files information
  titleEditBtn: boolean;
  filesList: Array<any>;
  disabled: boolean = false;

  fineUploaderCallBack={
    onAllComplete: () => {
      this.filesList = this.getAllFiles();
      this.touch('');
      this.propagateChange(this.filesList);
      let item;
      this.elementRef.nativeElement.querySelectorAll('[qq-file-id]').forEach((value) => {
        item = this.dataArray.filter(el =>{
          return el ? el.filesId == value.getAttribute('qq-file-id') : false;
        });
        value.getElementsByTagName('a')[0].setAttribute ('href', item.thumbnailUrl);
        value.getElementsByTagName('a')[0].setAttribute ('target', '_target');
      });
      this.titleEditBtn = true; // show hide title edit btn
    },
    onComplete: (id, name, responseJSON, xhr) => {
      // 完成上傳
      if(this.single) this.dataArray = [];
      if (responseJSON.success) {
        responseJSON.filesId=id;
        this.dataArray[id] = responseJSON;
      }
      else
        this.dataArray[id] = undefined;
    },
    onSubmitDelete: (id) => {
      // 點擊刪除按鈕
    },
    onDeleteComplete: (id, xhr, isError) => {
      // 完成刪除
      this.dataArray[id] = undefined;
      this.propagateChange(this.getAllFiles());
      if(!this.getAllFiles().length) this.titleEditBtn = false;
    },
    onUpload: (id, name) => {
      // 等待上傳中
    },
    onError: (id, name, errorReason, xhr) => {
      console.log(errorReason);
    }
  };

  constructor(
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
  ) { }

  propagateChange = (_: any) => {};
  touch =  (_: any) => {};

  writeValue(obj: Array<any>): void {
    if(obj){
      this.dataArray = obj;
      this.setInitFiles();
    }
    else this.dataArray = [];
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.touch = fn;
  }
  setDisabledState?(isDisabled: boolean): void{
    if (isDisabled) this.disabled = isDisabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const root = document.createElement('div');
    if(changes.extendTypes.currentValue){
      this.tempRef.createEmbeddedView(null).rootNodes.forEach((node) => { // make HTML5 temp transform to DOM element
        root.appendChild(node);
      });
      this.initUploadZone(root);
    }
  }

  initUploadZone(targetNode){
    this.fineUploader = new FineUploader({
      debug: false,
      element: this.elementRef.nativeElement,
      template: targetNode,
      autoUpload: true,
      multiple: !this.single,
      request: {
        endpoint: this.apiHost + '/api/common/file.upload?type=' + this.serverType,
        customHeaders: {
          'access_token': this.commonToken
        }
      },
      deleteFile: {
        enabled: true,
        endpoint: this.apiHost + '/api/common/file.upload?type=' + this.serverType,
        method: 'delete',
        customHeaders: {
          'access_token': this.commonToken // this.config.common_token
        }
      },
      thumbnails: {
        placeholders: {
          waitingPath: '/images/fineUploader/waiting-generic.png',
          notAvailablePath: '/images/fineUploader/not_available-generic.png'
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
      callbacks: this.fineUploaderCallBack
    });

      this.renderer.listen(this.elementRef.nativeElement.getElementsByClassName('clickarea')[0], 'click', (evt) => {
        evt.target.parentNode.getElementsByTagName('input')[0].click();
      });

    if(this.dataArray.length) // init file icon if file already exists
      this.setInitFiles();
  }

  setInitFiles(){
    if(this.fineUploader) this.fineUploader.addInitialFiles(this.dataArray);
  }

  private getAllFilesList(dataArray: Array<Object> = []): Array<any> {
    const temp = [];

    for (let i of dataArray)
      i && temp.push(i); // copy each non-empty value to the 'temp' array

    return temp;
  }

  getAllFiles(){
    return this.getAllFilesList(this.dataArray);
  }

  addFilesDescription(node, ...keys){
    const id = node.target.closest('div.row').dataset.imgId.toString(),
      selectedItem = this.dataArray.filter(v => v.fileid === +id)[0];
    switch(keys[1]){
      case 'input':
        selectedItem[keys[0]] = node.target.value;
        break;
      case 'select':
        selectedItem[keys[0]] = node.target.selectedOptions[0].value;
        break;
    }
    console.log(selectedItem);
  }
}
