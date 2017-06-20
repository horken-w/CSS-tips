import {Directive, ElementRef, EventEmitter, Injectable, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Directive({
  selector: '[jcrop]'
})
@Injectable()
export class JcropDirective implements OnInit, OnDestroy {
  target: JQuery;
  jcrop_api: any;
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  @Output() uploadUrl = new EventEmitter<string>();

  Xaxis = new BehaviorSubject(0);
  Yaxis = new BehaviorSubject(0);
  width = new BehaviorSubject(0);
  height = new BehaviorSubject(0);

  constructor(private el: ElementRef) {
    this.target = $(el.nativeElement);

  }

  ngOnInit() {
    this.Xaxis.subscribe();
    this.Yaxis.subscribe();
    this.width.subscribe();
    this.height.subscribe();
  }

  resetCropArea() {
    const that = this;
    if (!this.jcrop_api)
      this.target.Jcrop({
        onChange: this.showCoords.bind(this),
      }, function () {
        that.jcrop_api = this;
      });
  }

  showCoords(data) {
    const roomSize = this.target[0]['naturalWidth'] / this.target.width();
    this.Xaxis.next(data.x * roomSize);
    this.Yaxis.next(data.y * roomSize);
    this.width.next(data.w * roomSize);
    this.height.next(data.h * roomSize);
    return this;
  }

  getCropCoords() {
    const cropDetail = {w: this.target[0]['naturalWidth'], h: this.target[0]['naturalHeight'], x: 0, y: 0};
    if(this.Xaxis.getValue()) cropDetail.x = this.Xaxis.getValue();
    if(this.Yaxis.getValue()) cropDetail.y = this.Yaxis.getValue();
    if(this.width.getValue()) cropDetail.w = this.width.getValue();
    if(this.height.getValue()) cropDetail.h = this.height.getValue();
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

  ngOnDestroy() {
    if (this.jcrop_api){
      this.jcrop_api.destroy();
      this.jcrop_api = undefined;
    }
  }
}
