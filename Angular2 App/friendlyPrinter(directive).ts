import {Directive, ElementRef, AfterViewInit, Input, Renderer2, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/platform-browser";

/*-  html setUp
trigger btn set #friendlyPrint
ex: <a class="print" title="{{'print' | translate}}" id="btnPrint" href="javascript:void(0)" #friendlyPrint>
printer tag set clickEl and selector
ex: <section [clickEl]=friendlyPrint printer> ..... </section>
-*/

@Directive({
  selector: '[printer]'
})
export class PrinterDirective implements AfterViewInit {
  @Input() clickEl: ElementRef; 

  constructor(private el: ElementRef,
              private rend: Renderer2,
              @Inject(DOCUMENT) private document: any) {
  }

  ngAfterViewInit() {
    this.rend.listen(this.clickEl, 'click', this.friendlyPrint.bind(this))
  }

  
  friendlyPrint(evt) {
    evt.preventDefault();
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
            article li a:not([href^="#"]):after,
            article li a[href^="http://"]:after, 
            article li a[href^="https://"]:after {
                content: "_連結位置："attr(href);
                font-size: 80%;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
