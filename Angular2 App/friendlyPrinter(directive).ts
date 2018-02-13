import {Directive, ElementRef, AfterViewInit, Input, Renderer2, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/platform-browser";

/*-  html setUp
trigger btn set #friendlyPrint
ex: <a class="print" title="{{'print' | translate}}" id="btnPrint" href="javascript:void(0)" #friendlyPrint>
printer tag set clickEl and selector
ex: <section [customStyle]="CSSstyleUrl" [clickEl]=friendlyPrint> ..... </section>
give CSSstyleUrl to used custom style print,
else will just default print
-*/

@Directive({
  selector: '[printer]'
})
export class PrinterDirective implements AfterViewInit {
  @Input('printer') clickEl: ElementRef;
  @Input('customStyle') customPrint: ElementRef;

  constructor(private el: ElementRef,
              private rend: Renderer2) {
  }

  ngAfterViewInit() {
    this.rend.listen(this.clickEl, 'click', this.friendlyPrint.bind(this))
  }

  friendlyPrint(evt) {
    evt.preventDefault();
    if(this.customPrint){
      let printContents, popupWin;
      printContents = this.el.nativeElement.innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.write(`
      <html>
        <head>
          <title>友善列印</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
          <style>
            @page {
                margin: 0.5cm;
            }
            
            body > * {
                margin: 0;
                padding: 0;
            }
            
            body {
                font: 12pt "微軟正黑體", Microsoft JhengHei, "Times New Roman", Times, serif;
                line-height: 1.3;
            }
            
            article > h1 {
                font-size: 2em;
                line-height: 0.8em;
            }
            
            article > time {
                font-size: 0.8em;
            }
            
            article figure {
                display: inline-block;
                max-width: 280px;
            }
            article li a{
                text-decoration: none;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
      );
      popupWin.document.close();
    }
    else window.print();
  }