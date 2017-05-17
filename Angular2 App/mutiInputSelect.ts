import {Component, ElementRef, forwardRef, Input, ViewChild, HostListener, AfterViewInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MultiSelectService} from 'app/module/techmore/techmore-form/service/multi-select.service';
import {Response} from '@angular/http';

@Component({
  selector: 'techmore-multiselect',
  template: `
    <div class="txtsearch">
      <div class="txt-ctrl">
        <div class="txt-select-item" *ngFor="let kw of keyWords">{{kw}}
          <button class="removebtn" type="button" (click)="removeMe($event, kw)">X</button>
        </div>
        <input type="txt" placeholder="請輸入關鍵字，或從現有關鍵字中選擇。" class="form-control txt-inputexpend"
               (keyup)=filterOptions($event) #searchInput>
      </div>
      <select class="txt-selectbox" multiple name="selectarea" [disabled]="dataArray.length" [hidden]="true">
        <option *ngFor="let opt of dataArray;" value="{{opt.value}}" [selected]="itemArrivable(opt.label)">{{opt.label}}
        </option>
      </select>
      <div class="multi-selectbox" [hidden]="!filterList.length">
        <ul>
          <li class="txt-item" [class.selected]="itemArrivable(opt.label)" *ngFor="let opt of filterList"
              (click)="selectItem(opt.label)">{{opt.label}}
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .multi-selectbox{
      position: absolute;
      max-height: 35em;
      top: 100%;
      left: -1px;
      right: -1px;
      border: 1px solid #D7D7D7;
      margin: 0 16px;
      overflow-x: hidden;
      overflow-y: auto;
      background: white;
      z-index: 10;
    }

    .multi-selectbox .txt-item{
      font-size: 1em;
      display: block;
      padding: .5em .71429em;
      margin: 0;
      cursor: pointer;
      border-top: 1px solid #fff;
    }

    .multi-selectbox ul{
      padding: 5px;
    }

    .multi-selectbox .txt-item:hover,
    .multi-selectbox .txt-item.selected{
      background: hsl(230, 60%, 80%);
      color: white;
    }

    .txt-ctrl .txt-inputexpend{
      float: none;
      padding: 0.2em .1em;
      width: 100%;
      font-size: 1em;
      border: none;
      outline: none;
    }

    .txt-select-item{
      font-size: 0.8em;
      position: relative;
      margin: 0.2em;
      padding: .33333em .33333em .33333em 1.5em;
      float: left;
      border-radius: .25em;
      border: 1px solid hsl(230, 60%, 80%);
      color: #fff;
      background-color: hsl(230, 60%, 80%);
      -webkit-animation: fstAnimationEnter 0.2s;
      -moz-animation: fstAnimationEnter 0.2s;
      animation: fstAnimationEnter 0.2s;
    }

    .removebtn{
      margin: 0;
      padding: 0;
      border: 0;
      cursor: pointer;
      background: none;
      font-size: 1.16667em;
      position: absolute;
      left: 0;
      top: 50%;
      width: 1.28571em;
      line-height: 1.28571em;
      margin-top: -.64286em;
      text-align: center;
      color: #fff;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectInputComponent),
      multi: true
    }
  ],
})
export class MultiSelectInputComponent implements AfterViewInit, ControlValueAccessor {
  filterList: Array<string> = [];
  elementRef: ElementRef;
  dataArray: Array<string> = ['選項一', '選項二', '選項三', '選項四', '最後一選項'];
  keyWords: Array<string> = [];
  @Input() source: string;
  @Input() cataType: string;
  @Input() path?: string;
  @Input() siteToken?: string;
  @ViewChild('searchInput') inputVal;


  constructor(myElement: ElementRef,
              private dataService: MultiSelectService) {
    this.elementRef = myElement;
  }

  writeValue(value: any) {
      this.value = value;
  }

  onChange = (_: any) => {};

  onTouched = (_: any) => {};

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  get value(): any {
    return this.keyWords;
  };

  @Input() set value(v) {
    this.keyWords = v;
  }

  ngAfterViewInit() {
    this.dataService.getSourceData(this.cataType, this.source, this.path, this.siteToken)
      .map((response: Response) => response.json())
      .subscribe((data: Array<any>) => {
        this.dataArray = data;
      });
  }

  generatItems() {

  }

  filterOptions(evt) {
    if (evt.keyCode !== 13) {
      if (this.inputVal.nativeElement.value) {
        this.filterList = this.dataArray.filter((cht) => {
          return cht.indexOf(this.inputVal.nativeElement.value) > -1;
        })
      } else this.filterList = this.dataArray;
    } else {
      if (!this.itemArrivable(this.inputVal.nativeElement.value)) {
        this.value.push(this.inputVal.nativeElement.value);
        this.inputVal.nativeElement.value = '';
        this.filterList = this.dataArray;
        // this.onChange(this.keyWords);
      }
      else return;

    }
  }

  selectItem(item: string) {
    if (this.value.indexOf(item) > -1)
      this.value.splice(this.value.indexOf(item), 1);
    else {
      this.value.push(item);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClick(evt: any) {
    const clickedComponent = evt.target;
    let inside = false;
    if (this.elementRef.nativeElement.contains(clickedComponent))
      inside = true;

    if (inside) {
      this.filterList = this.dataArray;
    } else this.filterList = [];
  }

  itemArrivable(options) {
    const opts = this.value.indexOf(options);

    if (opts > -1) return true;
    else return false;
  };

  removeMe(item) {
    this.value.splice(this.value.indexOf(item), 1);
  }

  // txtChange(evt) {
  //   this.value.push(this.inputVal.nativeElement.value);
  //   this.onChange(this.value);
  // }
}
