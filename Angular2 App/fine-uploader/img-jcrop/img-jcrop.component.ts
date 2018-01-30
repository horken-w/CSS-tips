import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ModalComponent} from "ng2-bs4-modal/lib/components/modal";

@Component({
  selector: 'tm-img-jcrop',
  templateUrl: './img-jcrop.component.html',
  styleUrls: ['./img-jcrop.component.css']
})
export class ImgJcropComponent implements OnChanges, OnInit, OnDestroy{
  @Input() filesCollection: any;
  @ViewChild(ModalComponent) innerModal: ModalComponent;
  @ViewChild('jcrop') cropZone: ElementRef;
  baseElement: any;
  cropFrameStyle=[{style: '裁內頁圖 ', className: 'frame_rectangle'}, {style: '裁列表代表圖 ', className: 'frame_square'}];
  cropId: number;
  cropAble: boolean = false;
  orgUrl: string;
  squUrl: string;
  rectUrl: string;
  cropFrameSelected: string = '0';
  roomSize: number = 0;
  jcrop_api: any;

  naturalWidth: number;
  naturalHeight: number;
  Xaxis = new BehaviorSubject(0);
  Yaxis = new BehaviorSubject(0);
  width = new BehaviorSubject(0);
  height = new BehaviorSubject(0);

  constructor(
    private sanitizer: DomSanitizer,
  ) { }
  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit(): void {
    this.Xaxis.subscribe();
    this.Yaxis.subscribe();
    this.width.subscribe();
    this.height.subscribe();
    this.baseElement = this.cropZone.nativeElement;
  }

  showCropDialog(id: number){
    const data = this.filesCollection.filter((img) => img.fileid === +id)[0];
    this.cropId = id;
    this.squUrl = data.transform.filter((img) =>  img.type === 'c').length ? data.transform.filter((img) => img.type === 'c')[0].thumbnailUrl : '/images/no-pic.png';
    this.rectUrl = data.transform.filter((img) => img.type === 'l').length ? data.transform.filter((img) => img.type === 'l')[0].thumbnailUrl : data.transform.filter((img) => img.type === 'n')[0].thumbnailUrl;
    this.innerModal.open('lg');
  }

  resetCropArea(){
    const selectedImg = this.filesCollection.filter((img) => img.fileid === +this.cropId)[0];
    this.cropAble = true;
    this.orgUrl = selectedImg.thumbnailUrl;
    this.baseElement.setAttribute('data-fileid', selectedImg.fileid);
    this.baseElement.removeAttribute('style');
    setTimeout(() => this.setCropArea(), 800);
  }

  setCropArea(){
    const _that = this, promise = Promise.resolve();
    promise.then(() => this.getNaturalWidthnHeight())
      .then(() => {
        this.roomSize = this.naturalWidth / this.baseElement.width;
        if (!this.jcrop_api)
          switch (this.cropFrameSelected){
            case '0':
              $(this.baseElement).Jcrop({
                onChange: this.showCoords.bind(this),
                setSelect: [0, 0, 800 / this.roomSize, 0],
                allowResize: true,
                aspectRatio: 4 / 3
              }, function () {
                _that.jcrop_api = this;
              });
              break;
            case '1':
              $(this.baseElement).Jcrop({
                onChange: this.showCoords.bind(this),
                setSelect: [0, 0, 500, 500],
                allowResize: true,
                aspectRatio: 2 / 2
              }, function () {
                _that.jcrop_api = this;
              });
              break;
            default:
              $(this.baseElement).Jcrop({
                onChange: this.showCoords.bind(this),
                setSelect: [0, 0, 1200, 1200],
                allowResize: true
              }, function () {
                _that.jcrop_api = this;
              });
              break;
          }
      });
  }

  showCoords(data) {
    this.Xaxis.next(data.x * this.roomSize);
    this.Yaxis.next(data.y * this.roomSize);
    this.width.next(data.w * this.roomSize);
    this.height.next(data.h * this.roomSize);
    return this;
  }

  getCropCoords() {
    const cropDetail = {id: 0, width: this.naturalWidth, height: this.naturalHeight, x: 0, y: 0, type: ''},
      org_width = this.naturalWidth, org_height = this.naturalHeight;
    cropDetail.id = parseInt(this.baseElement.dataset.fileid, 10);
    if (this.width.getValue()) cropDetail.width = Math.ceil(this.width.getValue()) > org_width ? org_width : Math.ceil(this.width.getValue());
    if (this.height.getValue()) cropDetail.height = Math.ceil(this.height.getValue()) > org_height ? org_height : Math.ceil(this.height.getValue());
    if (this.Xaxis.getValue()) cropDetail.x = Math.ceil(this.Xaxis.getValue())+ cropDetail.width > org_width ? org_width - cropDetail.width : Math.ceil(this.Xaxis.getValue());
    if (this.Yaxis.getValue()) cropDetail.y = Math.ceil(this.Yaxis.getValue()) + cropDetail.height > org_height ? org_height - cropDetail.height  : Math.ceil(this.Yaxis.getValue());
    return cropDetail;
  }

  submit(){
    const coords = this.getCropCoords();
    this.cropAble = false;
    +this.cropFrameSelected ? coords.type = 'l' : coords.type = 'c';
    console.log(coords);
    // this.uploadService.updateCropZone(coords).subscribe((data) => {
    //   if (data.type === 'l') this.rectUrl = data.thumbnailUrl;
    //   else this.squUrl = data.thumbnailUrl;
    //   console.log(data);
    // });
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.cropAble = false;
    if (this.jcrop_api) {
      this.jcrop_api.destroy();
      this.jcrop_api = undefined;
    }
  }

  getNaturalWidthnHeight(){
    return new Promise((resolve) => {
      const theImage = new Image();
      theImage.onload = () => {
        this.naturalWidth = theImage.naturalWidth;
        this.naturalHeight = theImage.naturalHeight;
        resolve();
      };
      theImage.src = this.orgUrl;
    });
  }

  safeURL(imgUrl): any{
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl + '?' + Math.random());
  }
}
