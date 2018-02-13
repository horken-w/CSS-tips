//inline CKEDITOR cdn in index.html
import {
  AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef, ViewChild
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

declare let CKEDITOR: any;

@Component({
  selector: 'techmore-ckeditor',
  template: `
    <div [class.deny]="disabled"><textarea class="form-control" rows="3" #host name="host"></textarea></div>


    <template #template2>
      <div>
        <section>Template2</section>
      </div>
    </template>

    <template #templateDefault>
      <div><p></p></div>
    </template>
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
export class CkeditorComponent implements OnInit, AfterViewInit {
  @ViewChild('host') host: any;
  @Input() debounce: string;
  @Input() tempNum: any;
  @Input() disabled: boolean;

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
    extraPlugins: 'embedbase,videoembed,widget,notificationaggregator,lineutils,notification,widgetselection',
    removeButtons: 'Save,Print,Preview,NewPage,Templates,PasteFromWord,Scayt,HiddenField,ImageButton,Strike,BidiRtl,BidiLtr,Language,Flash,Table,PageBreak,Iframe,Maximize,ShowBlocks,Source,Find,CreateDiv,About',
    contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'],
    allowedContent: true,
    height: '400px'
  };
  @Output() ready = new EventEmitter();
  @Output() change = new EventEmitter();
  // @Output() blur = new EventEmitter();
  // @Output() focus = new EventEmitter();

  @ViewChild('template2')
  tplRef2: TemplateRef<any>;
  @ViewChild('templateDefault')
  tplRefDefaul: TemplateRef<any>;

  // @ViewChild('template2', { read: ViewContainerRef }) //顯示畫面成HTML元素
  //   tplVcRef: ViewContainerRef;
  _value = '';
  instance: any;
  debounceTimeout: any;

  constructor() { }


  writeValue(value: any) {
    if (!value) return;
    if (this.instance)
      this.instance.setData(value);

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
    return this._value;
  };

  @Input() set value(v) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Configuration
    if (!document.getElementById('ck_cdn')) { // create CKEditor cdn tag if it doesn't exist
      const script = document.createElement('script');
      script.src = 'https://cdn.ckeditor.com/4.5.11/full/ckeditor.js';
      script.id = 'ck_cdn';
      document.getElementsByTagName('head')[0].appendChild(script);
      script.onload = () => setTimeout(() => this.ckeditorInit(this.txtConfig || {}));
    }
    else setTimeout(() => this.ckeditorInit(this.txtConfig || {}));
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
      const root = document.createElement('div');
      let embeddedView;
      switch (this.tempNum) {
        case 'template3':
          embeddedView = this.tplRef2.createEmbeddedView(null); //HTML5 Temp to embed element
          config['contentsCss'].push('/css/template/single_03.css'); //set insert css file
          break;
        default:
          embeddedView = this.tplRefDefaul.createEmbeddedView(null); //HTML5 Temp to embed element
          config['contentsCss'].push(''); //set insert css file
          break;
      }
      embeddedView.rootNodes.forEach((node) => {//make HTML5 temp transform to DOM element
        root.appendChild(node);
      });
      
      //Import plugin
      CKEDITOR.plugins.addExternal( 'embedbase', '/js/ckeditor/plugins/embedbase/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'videoembed', '/js/ckeditor/plugins/videoembed/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'widget', '/js/ckeditor/plugins/widget/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'notificationaggregator', '/js/ckeditor/plugins/notificationaggregator/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'lineutils', '/js/ckeditor/plugins/lineutils/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'notification', '/js/ckeditor/plugins/notification/plugin.js', '' );
      CKEDITOR.plugins.addExternal( 'widgetselection', '/js/ckeditor/plugins/widgetselection/plugin.js', '' );
      this.instance = CKEDITOR.replace(this.host.nativeElement, config);
      this.instance.setData(root.innerHTML);
      this.instance.on('instanceReady', (evt: any) => {
        // send the evt to the EventEmitter
        this.ready.emit(evt);
      });

      this.instance.on('change', () => {
        this.onTouched();
        let value = this.instance.getData();
        if (this.debounce) {
          if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
          this.debounceTimeout = setTimeout(() => {
            this.updateValue(value);
            this.debounceTimeout = null;
          }, parseInt(this.debounce));
        }
        else this.updateValue(value);

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
