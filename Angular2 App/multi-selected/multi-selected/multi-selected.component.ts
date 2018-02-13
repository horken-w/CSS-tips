import {
  Component, ElementRef, forwardRef, HostListener, Input, OnChanges,
  SimpleChanges
} from '@angular/core';
import {MultiSelectService} from "@techmore/multi-selected/multi-select.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'tm-multi-selected',
  templateUrl: './multi-selected.component.html',
  styleUrls: ['./multi-selected.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectedComponent),
      multi: true
    }
  ]
})
export class MultiSelectedComponent implements ControlValueAccessor, OnChanges {
  propagateChange = (_: any) => {};
  touch =  (_: any) => {};

  writeValue(obj: Array<any>): void {
    if(obj)
      this._keyTags = obj;
    else
      this._keyTags = [];
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.touch = fn;
  }
  disabled: boolean = true;
  orgData: Array<{label: string, value: string}> = [{label: '選項一', value: 's'}, {label: '選項二', value: 's'}, {label: '選項三', value: 's'}, {label: '選項四', value: 'a'}, {label: '最後一選項', value: '2'}];
  filterData: Array<{label: string, value: string}> = [];
  _keyTags: any;
  @Input() url: string;

  constructor(
    private myElement: ElementRef,
    private dataService: MultiSelectService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataService.getSourceData(this.url).subscribe(data => {
      this.orgData = data;
      this.transformMutually(this.keyTags);
    });
  }

  get keyTags(): any {
    return this._keyTags;
  };

  @Input() set keyTags(v) {
    if (v) this._keyTags.push(v);
  }

  @HostListener('document:click', ['$event'])
  handleClick(evt: any) {
    const clickedComponent = evt.target;
    let inside = false;
    if (this.myElement.nativeElement.contains(clickedComponent)) inside = true;

    if (inside) {
      this.resetItemList();
    } else this.filterData = [];
  }
  realtimeFilter(evt){
    // todo keyboard arraow to select item;
    if (evt.keyCode !== 13){
      if (evt.target.value) {
        this.filterData = this.orgData.filter((cht) => {
          return cht['label'].indexOf(evt.target.value) > -1;
        })
      } else this.resetItemList();
    }
    else
      if(this.findMe(evt.target.value, false)){
        this.keyTags = this.orgData.filter((cht) => {
            return cht['label'].indexOf(evt.target.value) === 1;
          });
        evt.target.value = '';
        this.resetItemList();
      }
      else{
        this.keyTags.push({label: evt.target.value, value: evt.target.value});
        evt.target.value = '';
        this.touch('');
        this.propagateChange(this.transformMutually(this.keyTags));
      }

  }

  //Help Function
  resetItemList(){
    this.filterData = this.orgData;
  }

  findMe(selectOpt, selected){
    //used to find out selected item idx which already in an array
    let findIdx;
    if(typeof selectOpt === 'object')
      findIdx = this.keyTags.findIndex(item => JSON.stringify(item) === JSON.stringify(selectOpt));
    else{
      findIdx = this.keyTags.filter((cht) => cht.label.indexOf(selectOpt) > -1).length;
    }
    if(!selected) return findIdx;
    else return findIdx > -1;
  }

  selectMe(selectOpt){
    //used to select an item if it already exist then remove it else add to array
    (this.findMe(selectOpt, false) > -1) ? this.removeMe(selectOpt) : this.keyTags = selectOpt;
  }

  removeMe(selectOpt){
    //used remove item from Array
    this.keyTags.splice(this.findMe(selectOpt, false), 1);
    this.touch('');
    this.propagateChange(this.transformMutually(this.keyTags));
  }

  transformMutually(data){
    const arrayBox = [];
    if(!data.length) return [];
    else if(typeof data[0] === 'object'){
      data.forEach(data => {
        arrayBox.push(data.value);
      });
      return arrayBox;
    }
    else
      data.forEach((data, idx) => {
        this._keyTags[idx] = this.orgData.filter((cht) => cht.label.indexOf(data) > -1)[0];
      });

  }
}
