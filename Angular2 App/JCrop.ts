import {Directive, ElementRef, EventEmitter, Injectable, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {JcropService} from "../../service/jcrop.service";

@Directive({
  selector: '[jcrop]',
  providers: [JcropService]
})
@Injectable()
export class JcropDirective implements OnInit, OnDestroy {
  target: JQuery;
  jcrop_api: any;
  roomSize: number = 0
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  @Output() uploadUrl = new EventEmitter<string>();
  @Output() imgsUrl = new EventEmitter<string>();

  Xaxis = new BehaviorSubject(0);
  Yaxis = new BehaviorSubject(0);
  width = new BehaviorSubject(0);
  height = new BehaviorSubject(0);

  constructor(
    private el: ElementRef,
    private jcservice: JcropService
  ) {
    this.target = $(el.nativeElement);
  }

  ngOnInit() {
    this.Xaxis.subscribe();
    this.Yaxis.subscribe();
    this.width.subscribe();
    this.height.subscribe();
  }

  resetCropArea() {
    this.imgsUrl.emit(this.target[0].dataset.fileorg);
    setTimeout(() => this.setCropArea(), 800); // wait for image loaded
  }

  setCropArea(){
    const that = this;
    this.roomSize = this.target[0]['naturalWidth'] / this.target.width();
    if (!this.jcrop_api)
      this.target.Jcrop({
        onChange: this.showCoords.bind(this),
        setSelect: [0, 0, 800 / this.roomSize, 0],
        allowResize: true,
        aspectRatio: 4 / 3
      }, function () {
        that.jcrop_api = this;
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
    const cropDetail = {id: 0, width: this.target[0]['naturalWidth'], height: this.target[0]['naturalHeight'], x: 0, y: 0},
          org_width = this.target[0]['naturalWidth'], org_height = this.target[0]['naturalHeight'];
    cropDetail.id = parseInt(this.target[0].dataset.fileid, 10);
    if (this.width.getValue()) cropDetail.width = Math.ceil(this.width.getValue()) > org_width ? org_width : Math.ceil(this.width.getValue());
    if (this.height.getValue()) cropDetail.height = Math.ceil(this.height.getValue()) > org_height ? org_height : Math.ceil(this.height.getValue());
    if (this.Xaxis.getValue()) cropDetail.x = Math.ceil(this.Xaxis.getValue())+ cropDetail.width > org_width ? org_width - cropDetail.width : Math.ceil(this.Xaxis.getValue());
    if (this.Yaxis.getValue()) cropDetail.y = Math.ceil(this.Yaxis.getValue()) + cropDetail.height > org_height ? org_height - cropDetail.height  : Math.ceil(this.Yaxis.getValue());
    return cropDetail;
  }

  setCanvas(w: number, h: number) {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    document.body.appendChild(this.cvs);
    this.cvs.style.display = 'none';
    $(this.cvs).attr({
      'width': w,
      'height': h
    });
  }

  drawNewPhoto(cropDetail) {
    const cnsimg: HTMLImageElement = document.createElement('img');
    let crop;
    cnsimg.src = $('#crop_image').attr('src');
    this.ctx.drawImage(cnsimg, cropDetail.x, cropDetail.y, cropDetail.w, cropDetail.h, 0, 0, cropDetail.w, cropDetail.h);
    crop = this.cvs.toDataURL('image/jpeg');
    crop = crop.split(',')[1];
    this.uploadUrl.emit(crop);
    this.ngOnDestroy();
  }

  submitSelection(coords){
    this.jcservice.updateCropZone(coords).subscribe(() => {
      console.log('success!!');
    });
  }

  ngOnDestroy() {
    if (this.jcrop_api) {
      this.jcrop_api.destroy();
      this.jcrop_api = undefined;
    }
  }
}
