import {Directive, OnInit, ElementRef, Renderer2, HostListener, Host} from '@angular/core';
import {NgModel} from "@angular/forms";


@Directive({
  selector: '[textCount]'
})
export class TextCountDirective implements OnInit {
  maxCount: number;
  orginalHeight: number;
  countArea: ElementRef;  // ElementRef 用來對 DOM 處理
  total: number;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              @Host() private ngModel: NgModel
  ) {
  }

  ngOnInit() {
    // debugger;
    const _span = this.renderer.createElement('span'), // 剩餘字數的字
          root = this.el.nativeElement.parentElement;
    this.maxCount = this.el.nativeElement.maxLength;
    this.countArea=_span;  // 剩餘字數的字

    // console.log(this.el.nativeElement);
    this.renderer.appendChild(root, _span);
    this.orginalHeight = this.el.nativeElement.scrollHeight;

    // 當ngmodel 值改變的時候
    this.total = 0;
    this.ngModel.valueChanges.subscribe(
      () => {
        _span.innerText = this.maxCount - this.el.nativeElement.value.length;
        if(JSON.stringify(this.el.nativeElement.value).match(/(?:\\[rn]|[\r\n])/g)) {
          this.total = JSON.stringify(this.el.nativeElement.value).match(/(?:\\[rn]|[\r\n])/g).length;
          this.total = this.total * 16;  // 字體px
          this.el.nativeElement.style.height = this.orginalHeight/1.5 + this.total + 'px';
        }
      }
    )
  }

  @HostListener('keyup', ['$event']) //偵測事件
  onKeypress(evt) {
    this.countArea['innerText'] = this.maxCount - evt.currentTarget.value.length;
    // this.dynamicGroup(evt.currentTarget);
  }

  //調整高度
  // dynamicGroup(target){
  //   if (target.scrollHeight > this.orginalHeight-15){
  //     target.style.height = "2px";
  //     target.style.height = target.scrollHeight + "px";
  //   }
  // }
}
