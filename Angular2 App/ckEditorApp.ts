import {
  AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef, ViewChild
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

declare let CKEDITOR: any;

@Component({
  selector: 'techmore-ckeditor',
  template: `
    <textarea class="form-control" rows="3" #host name="host"></textarea>

    <template #template2>
      <section class="row clearfix">
        <div class="col-lg-3 col-md-3  col-sm-4">
          <figure class="thumbnail"><img alt="圖片說明" title="圖片說明" class="portrait"
                                         src="http://w1.loxa.edu.tw/xxxeee/Giulio%20Ceppi.jpg"/>
            <figcaption>圖片說明</figcaption>
          </figure>
        </div>
        <div class="col-lg-8 col-md-8 col-sm-7">
          <h3 class="strong">石大宇</h3>
          <time>2007-2008</time>
          <div>石大宇擁有於紐約求學、工作、創業的生活與專業經歷，作為多次獲得國際設計大獎的設計師，被媒體譽為臺灣設計界的創意教父。1996年石大宇辭去「鑽石之王」Harry
            Winston珠寶公司設計師一職，從紐約返回臺灣成立設計生活領導品牌「清庭」，引進全球頂尖設計生活物件，提供消費者與全球同步的設計美學場所。作為資深的國際設計商品買家，石大宇常年接觸最前沿的設計，對設計潮流的動向極具敏感性。既能以西方人的觀點，挑選符合其品味的中國式設計商品；也能以中國人的立場，推廣傳統文化，促其創新。2007、2008年擔任工藝時尚「Yii易計畫」的創意總監，將懸臂竹椅43及臺灣竹工藝家推上國際設計舞臺，成為以當代設計活化傳統工藝的典範。
          </div>
        </div>
      </section>
      <section class="row clearfix">
        <div class="col-lg-3 col-md-3  col-sm-4">
          <figure class="thumbnail"><img alt="圖片說明" title="圖片說明" src="../images/tmp/Gijs Bakker.jpg">
            <figcaption>圖片說明</figcaption>
          </figure>
        </div>
        <div class="col-lg-8 col-md-8 col-sm-7">
          <h3 class="strong">海斯˙巴克 Gijs Bakker</h3>
          <time>2009-2010</time>
          <div>Gijs Bakker (1942年生於荷蘭)是國際知名的設計大師，楚格設計(Droog Design)及當代珠寶設計品牌Chi ha paura...?的共同創辦人，並擔任安荷芬設計學院(Design
            Academy Eindhoven) IM Master研究所所長。<br>
            Bakker的專業設計領域包含珠寶設計、家電、家具、家居用品、室內設計、公共空間及各型展場。他的作品常於全球各大美術館，以及設計藝廊展覽。<br>
            Gijs Bakker經常在世界各地講學，並擔任各項設計大獎及競賽的專業評審。2007年起，有關他個人創作生涯的回顧展-Gijs Bakker and
            Jewelery已開始在世界各大博物館巡迴展出，同名研究專書亦已同步出版。
          </div>
        </div>
      </section>
      <section class="row clearfix">
        <div class="col-lg-3 col-md-3 col-sm-4">
          <figure class="thumbnail"><img alt="圖片說明" title="圖片說明" src="../images/tmp/Giulio Ceppi.jpg">
            <figcaption>圖片說明</figcaption>
          </figure>
        </div>
        <div class="col-lg-8 col-md-8 col-sm-7">
          <h3 class="strong">朱利歐˙賽皮 Giulio Ceppi </h3>
          <time>2012</time>
          <div>建築師，工業設計博士，米蘭理工大學(Politecnico di Milano)及艾弗瑞亞互動設計學院(Interaction Design Institure in
            Ivrea)教授並自2004年起擔任多摩斯設計學院(Domus)商業設計碩士班總監。他專注於感知設計、新設計策略的開發及品牌商業建築設計。<br>
            自1990到1997年間，他帶領多摩斯設計學院研究中心(Domus Academy Research Centre)，1998年至2000年間則擔任飛利浦設計的資深設計顧問。<br>
            現在他擔任Total Tool的管理總監。Total Tool是一總部位於義大利米蘭(Milan, Italy)的策略設計顧問公司，在2005及2008年得到金指南針獎(Golden Compass
            Prize)且在2007年入選為ICSID國際工業設計社團協會名人堂成員。
          </div>
        </div>
      </section>
    </template>

    <template #templateDefault><div></div></template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CkeditorComponent),
      multi: true
    }
  ]
})
export class CkeditorComponent implements OnInit, AfterViewInit {
  @ViewChild('host') host: any;
  @Input() debounce: string;
  @Input() tempNum: any;

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
    removeButtons: 'Save,Print,Preview,NewPage,Templates,PasteFromWord,Scayt,HiddenField,ImageButton,Strike,BidiRtl,BidiLtr,Language,Flash,Table,PageBreak,Iframe,Maximize,ShowBlocks,Source,Find,CreateDiv,About',
    contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'],
    allowedContent: true,
    height: '400px'
  };
  @Output() ready = new EventEmitter();
  @Output() change = new EventEmitter();
  // @Output() blur = new EventEmitter();
  // @Output() focus = new EventEmitter();

  constructor() {
  }

  @ViewChild('template2')
  tplRef2: TemplateRef<any>;
  @ViewChild('templateDefault')
  tplRefDefaul: TemplateRef<any>;

  // @ViewChild('template2', { read: ViewContainerRef }) //顯示畫面成HTML元素
  //   tplVcRef: ViewContainerRef;
  _value = '';
  instance: any;
  debounceTimeout: any;

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
    this.ckeditorInit(this.txtConfig || {});
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
