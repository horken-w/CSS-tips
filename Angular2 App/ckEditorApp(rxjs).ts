import {
  AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef, ViewChild
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {isNullOrUndefined} from "util";

declare let CKEDITOR: any;

@Component({
  selector: 'techmore-ckeditor',
  template: `
    <div [class.deny]="disabled"><textarea class="form-control" rows="3" #host name="host"></textarea></div>

    <ng-template #template1>
      <div>
         <section> Template1</section>
      </div>
    </ng-template>
    
    <ng-template #template2>
      <div>
        <div>
         <section> Template2</section>
      </div>
      </div>
    </ng-template>

    <ng-template #template3>
      <div>
        <div>
         <section> Template3</section>
        </div>
      </div>
    </ng-template>
    <ng-template #template4>
      <div>
        <div>
         <section> Template4</section>
        </div>
      </div>
    </ng-template>
    <ng-template #templateDefault>
      <div></div>
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CkeditorComponent),
      multi: true
    }
  ],
  styleUrls: ['ckeditor.component.css'],
})
export class CkeditorComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild('host') host: any;
  @Input() debounce: string;
  @Input() disabled: boolean;
  setCKData: boolean = true;

  @Input() txtConfig: any = {
    toolbarGroups: [
      {name: 'clipboard', groups: ['clipboard', 'undo']},
      {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
      {name: 'forms', groups: ['forms']},
      {name: 'document', groups: ['mode', 'document', 'doctools']},
      {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
      {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
      '/',
      {name: 'links', groups: ['links']},
      {name: 'insert', groups: ['insert']},
      {name: 'styles', groups: ['styles']},
      {name: 'colors', groups: ['colors']},
      {name: 'tools', groups: ['tools']},
      {name: 'others', groups: ['others']},
      {name: 'about', groups: ['about']}
    ],
    // extraPlugins: 'trytry,embedbase,videoembed,widget,notificationaggregator,lineutils,notification,widgetselection',
    extraPlugins: 'imageinsert',
    removeButtons: 'Save,Print,ImageButton,Preview,NewPage,Templates,PasteFromWord,Scayt,HiddenField,ImageButton,Strike,BidiRtl,BidiLtr,Language,Flash,Table,PageBreak,Maximize,ShowBlocks,Source,Find,About',
    contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'],
    allowedContent: true,
    height: '400px'
  };
  @Output() ready = new EventEmitter();
  @Output() change = new EventEmitter();
  // @Output() blur = new EventEmitter();
  // @Output() focus = new EventEmitter();

  @ViewChild('template1')
  tplRef1: TemplateRef<any>;
  @ViewChild('template2')
  tplRef2: TemplateRef<any>;
  @ViewChild('template3')
  tplRef3: TemplateRef<any>;
  @ViewChild('template4')
  tplRef4: TemplateRef<any>;
  @ViewChild('templateDefault')
  tplRefDefaul: TemplateRef<any>;

  // @ViewChild('template2', { read: ViewContainerRef }) //顯示畫面成HTML元素
  //   tplVcRef: ViewContainerRef;
  // @Input() tempNum: any;
  _tempNum = new BehaviorSubject<string>(null);
  _value = new BehaviorSubject<string>('');
  instance: any;
  debounceTimeout: any;

  subscription: Subscription;
  instanceLin = new BehaviorSubject<any>(null);

  constructor(
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(() => this.setCKData = true)
  }

  get tempNum(){
    return this._tempNum.getValue();
  }

  @Input() set tempNum(val:any){
    this._tempNum.next(val);
  }

  writeValue(value: any) {
    // if (!value) return;
    // if (this.instance)
    //   this.instance.setData(value);

    this.value = value;

  }

  onChange(_: any) {
  }

  onTouched() {
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  get value(): any {
    return this._value.getValue();
  };

  @Input() set value(v) {
    // if (v !== this._value) {
    //   this._value = v;
    //   this.onChange(v);
    // }
    if ( !isNullOrUndefined(v) && v !== '' && v !== this._value.getValue() )
      this._value.next(v);
  }

  ngOnInit() {
    // Configuration


    this.subscription = Observable.combineLatest(
      this._value.distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
      this.instanceLin, (value, i) => {
        return {
          value: value,
          instance: i
        }
      })
      .filter(sub => !isNullOrUndefined(sub.instance))
      .debounceTime(500)
      .subscribe(sub => {
        if (this.setCKData) {
          sub.instance.setData(sub.value);
        }
      })

    this._tempNum
      .filter(val => !isNullOrUndefined(val))
      .subscribe(val=>{
        const root = document.createElement('div');
        let embeddedView;
        switch (val) {
          case '01':
            embeddedView = this.tplRef1.createEmbeddedView(null); //HTML5 Temp to embed element
            break;
          case '02':
            embeddedView = this.tplRef2.createEmbeddedView(null); //HTML5 Temp to embed element
            break;
          case '03':
            embeddedView = this.tplRef3.createEmbeddedView(null); //HTML5 Temp to embed element
            break;
          case '04':
            embeddedView = this.tplRef4.createEmbeddedView(null); //HTML5 Temp to embed element
            break;
          default:
            embeddedView = this.tplRefDefaul.createEmbeddedView(null); //HTML5 Temp to embed element
            break;
        }
        embeddedView.rootNodes.forEach((node) => {//make HTML5 temp transform to DOM element
          root.appendChild(node);
        });
        this.value = root.innerHTML;
      })

    // this._value
    //   .subscribe(
    //     (content) => {
    //       this.onChange(content);
    //       if (this.instance)
    //         this.instance.setData(content);
    //     }
    //   )
    this.ckeditorInit(this.txtConfig || {});
  }

  ngAfterViewInit() {

  }

  updateValue(value: string) {
    this.value = value;
    this.onChange(value);

    this.onTouched();
    this.change.emit(value);
  }

  ckeditorInit(config: object) {
    if (typeof CKEDITOR == 'undefined') {
      console.warn('CKEditor 4.x is missing (http://ckeditor.com/)');
    }
    else {
      // const root = document.createElement('div');
      // let embeddedView;
      // switch (this.tempNum) {
      //   case '01':
      //     embeddedView = this.tplRef1.createEmbeddedView(null); //HTML5 Temp to embed element
      //     config['contentsCss'].push('/css/template/single_01.css'); //set insert css file
      //     break;
      //   case '02':
      //     embeddedView = this.tplRef2.createEmbeddedView(null); //HTML5 Temp to embed element
      //     config['contentsCss'].push('/css/template/single_02.css'); //set insert css file
      //     break;
      //   default:
      //     embeddedView = this.tplRefDefaul.createEmbeddedView(null); //HTML5 Temp to embed element
      //     config['contentsCss'].push(''); //set insert css file
      //     break;
      // }
      // embeddedView.rootNodes.forEach((node) => {//make HTML5 temp transform to DOM element
      //   root.appendChild(node);
      // });

      switch (this.tempNum) {
        case '01':
          config['contentsCss'].push('/css/template/single/single_01.css'); //set insert css file
          break;
        case '02':
          config['contentsCss'].push('/css/template/single/single_02.css'); //set insert css file
          break;
        case '03':
          config['contentsCss'].push('/css/template/single/single_03.css'); //set insert css file
          break;
        case '04':
          config['contentsCss'].push('/css/template/single/single_04.css'); //set insert css file
          break;
        default:
          config['contentsCss'].push(''); //set insert css file
          break;
      }

      //載入外掛插件
      CKEDITOR.plugins.addExternal( 'embedbase', '/js/ckeditor/plugins/embedbase/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'videoembed', '/js/ckeditor/plugins/videoembed/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'widget', '/js/ckeditor/plugins/widget/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'notificationaggregator', '/js/ckeditor/plugins/notificationaggregator/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'lineutils', '/js/ckeditor/plugins/lineutils/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'notification', '/js/ckeditor/plugins/notification/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'widgetselection', '/js/ckeditor/plugins/widgetselection/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'imageinsert', '/js/ckeditor/plugins/imageinsert/plugin.js', '' );
      this.instance = CKEDITOR.replace(this.host.nativeElement, config);
      // this.instance.setData(root.innerHTML);
      this.instance.on('instanceReady', (evt: any) => {
        this.instanceLin.next(this.instance);
      //   // send the evt to the EventEmitter
      //   // if(this.value == '<div></div>') this.updateValue(this.instance.getData());
      //   // this.instance.setData(this.value);
      //   // this.ready.emit(evt);
      });

      this.instance.on('afterSetData', (evt) => {
        // this.onTouched();
        // let value = this.instance.getData();
        // if (this.debounce) {
        //   if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        //   this.debounceTimeout = setTimeout(() => {
        //     this.updateValue(value);
        //     this.debounceTimeout = null;
        //   }, parseInt(this.debounce));
        // }
        // else this.updateValue(value);
        this.updateValue(evt.data.dataValue);

        // this.instance.setData(this.value);
      });

      this.instance.on('change', (evt) => {
        this.onTouched();
        const value = this.instance.getData();
        if (value.length) this.setCKData = false;
        if (this.debounce) {
          if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
          this.debounceTimeout = setTimeout(() => {
            this.updateValue(value);
            this.debounceTimeout = null;
          }, parseInt(this.debounce));
        }
        else this.updateValue(value);
        // this.updateValue(value);

        // this.instance.setData(this.value);
      })

      // this.instance.on('blur', (evt: any) => {
      //   this.blur.emit(evt);
      // });
      //
      // this.instance.on('focus', (evt: any) => {
      //   this.focus.emit(evt);
      // });
    }
  }
}