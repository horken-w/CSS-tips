import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[textEllipsis]'
})
export class TextEllipsisDirective implements AfterViewInit {
  @Input('textEllipsis') ellipsisType: string;
  cloneDOM: ElementRef;

  constructor(private el: ElementRef, private render: Renderer2) {
  }

  ngAfterViewInit() {
    if (this.ellipsisType === 'multi') this.multipleTextEllipsis();
    this.destoryCloneElement();
  }

  multipleTextEllipsis() {
    let content = this.el.nativeElement.innerHTML;
    this.cloneElement();
    while (content.length > 0 && this.getHeight()) {
      content = content.substr(0, content.length - 1);
      this.cloneDOM['innerHTML'] = content + '...';
    }
    this.el.nativeElement.innerHTML = this.cloneDOM['innerHTML'];
  }

  cloneElement() {
    this.cloneDOM = this.el.nativeElement.cloneNode(true);
    this.render.setStyle(this.cloneDOM, 'position', 'absolute');
    this.render.setStyle(this.cloneDOM, 'opacity', 0);
    this.render.setStyle(this.cloneDOM, 'overflow', 'visible');
    this.render.setStyle(this.cloneDOM, 'visibility', 'hidden')
    this.render.setStyle(this.cloneDOM, 'width', this.el.nativeElement.clientWidth + 'px');
    this.render.setStyle(this.cloneDOM, 'height', 'auto');
    this.render.appendChild(this.el.nativeElement.parentElement, this.cloneDOM);
  }

  getHeight() {
    return this.cloneDOM['offsetHeight'] > this.el.nativeElement.offsetHeight;
  }

  getWidth() {

  }

  destoryCloneElement() {
    this.render.removeChild(this.cloneDOM['parentElement'], this.cloneDOM);
  }
}
