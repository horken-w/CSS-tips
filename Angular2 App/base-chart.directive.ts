import {
  Directive, ElementRef, EventEmitter, Input, OnDestroy, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import {Chart} from "chart.js";

@Directive({
  selector: 'canvas[baseChart]',
  exportAs: 'base-chart'
})
export class BaseChartDirective implements OnDestroy, OnChanges, OnInit {
  public static defaultColors: Array<number[]> = [
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [231, 233, 237],
    [75, 192, 192],
    [151, 187, 205],
    [220, 220, 220],
    [247, 70, 74],
    [70, 191, 189],
    [253, 180, 92],
    [148, 159, 177],
    [77, 83, 96]
  ];

  @Input() data: number[] | any[];
  @Input() datasets: any[];
  @Input() labels: Array<any> = [];
  @Input() options: any = [];
  @Input() chartType: string;
  @Input() colors: Array<any>;
  @Input() legend: boolean;

  @Output() chartClick: EventEmitter<any> = new EventEmitter();
  @Output() chartHover: EventEmitter<any> = new EventEmitter();

  //canvas declar
  ctx: CanvasRenderingContext2D;
  chart: any;
  cvs: HTMLCanvasElement;
  initFlag: boolean = false;
  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  ngOnInit() {
    this.ctx = this.element.nativeElement.getContext('2d');
    this.cvs = this.element.nativeElement;
    this.setBarCorner();
    if (this.data || this.datasets && this.datasets.length) {
      this.initFlag = true;
      this.refresh();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let maxYAxis: number;
    if (this.initFlag) {
      if (changes.hasOwnProperty('datasets') || changes.hasOwnProperty('data')) {
        if (changes['data']) {
          maxYAxis = Math.max(...changes['data'].currentValue[0].data);
          this.updateChartData(changes['data'].currentValue);
        } else {
          maxYAxis = Math.max(...changes['datasets'].currentValue[0].data);
          this.updateChartData(changes['datasets'].currentValue);
        }
        if (maxYAxis > 1500) this.chart.config.options.scales.yAxes[0].ticks.max = maxYAxis + 500; //dynamic change Y Axis value
        else if (maxYAxis < 10) this.chart.config.options.scales.yAxes[0].ticks.max = maxYAxis + 2; //dynamic change Y Axis value
        else this.chart.config.options.scales.yAxes[0].ticks.max = maxYAxis + 10; //dynamic change Y Axis value
        this.chart.update();
      }
      else this.refresh();

    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = void 0;
    }
  }

  refresh() {
    this.ngOnDestroy();
    this.chart = this.getChartBuilder(/*this.ctx, data, this.options*/);
  }

  getChartBuilder(): any {
    const datasets: any = this.getDatasets();
    const barChartOptions = {
      onResize: (chart) =>{
        debugger;
      },
      animation: {
        onComplete: (chart) => {// set label on the top of bar
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              const data = dataset.data[index];
              ctx.save();
              ctx.fillStyle = 'black';
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
              ctx.font = 'bold 15px 微軟正黑體, Microsoft JhengHei, Arial, sans-serif';
              const labelText  = bar._model.label.split('');
              let yxAis = bar._chart.chartArea.bottom + 7;
              labelText.forEach((v, i) => {
                ctx.fillText(v, bar._model.x, yxAis += 15);
              });
              ctx.restore();
              // debugger;
            });
          });
        }
      }
    }
    const options: any = Object.assign({}, this.options, barChartOptions);

    if (this.legend === false) {
      options.legend = {display: false}
    }

    options.hover = options.hover || {};
    if (!options.hover.onHover) {
      options.hover.onHover = (active: Array<any>) => {
        if (active && !active.length) {
          return;
        }
        this.chartHover.emit({active});
      };
    }

    if (!options.onClick) {
      options.onClick = (event: any, active: Array<any>) => {
        this.chartClick.emit({event, active});
      }
    }

    const opts = {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: datasets
      },
      options: options
    }
    return new Chart(this.ctx, opts);
  }

  updateChartData(newDataValues: number[] | any[]) {
    if (Array.isArray(newDataValues[0].data)) {
      this.chart.data.datasets.forEach((dataset: any, i: number) => {
        dataset.data = newDataValues[i].data;

        if (newDataValues[i].label) {
          dataset.label = newDataValues[i].label;
        }
      });
      if (this.labels.length) this.chart.data.labels = this.labels;
    }
    else {
      this.chart.data.datasets[0].data = newDataValues;
    }
  }

  getDatasets(): any {
    let datasets: any = void 0;

    if (!this.datasets || !this.datasets.length && (this.data && this.data.length)) {
      if (Array.isArray(this.data[0])) {
        datasets = (this.data as Array<number[]>).map((data: number[], index: number) => {
          return {data, label: this.labels[index] || `label ${index}`}
        })
      }
      else datasets = [{data: this.data, label: `Label 0`}];
    }

    if (this.datasets && this.datasets.length || (datasets && datasets.length)) {
      datasets = (this.datasets || datasets).map((elm: number, index: number) => {
        let newElm: any = Object.assign({}, elm);
        if (this.colors && this.colors.length)
          Object.assign(newElm, this.colors[index]);
        else Object.assign(newElm, getColors(this.chartType, index, newElm.data.length));

        return newElm;
      })
    }

    if (!datasets) {
      throw new Error(`ng-charts configuration error,
      data or datasets field are required to render char ${this.chartType}`);
    }
    return datasets;
  }

  setBarCorner() {
    Chart.plugins.register({
      beforeDraw: function (chartInstance) {
        const ctx = chartInstance.chart.ctx;
        // ctx.fillStyle = 'white';
        // ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
      }
    });

    Chart.elements.Rectangle.prototype.draw = function () {

      let ctx = this._chart.ctx;
      let vm = this._view;
      let left, right, top, bottom, signX, signY, borderSkipped;
      let borderWidth = vm.borderWidth;
      let nextCornerId: number, nextCorner: any, width: number, height: number;
      // Set Radius Here
      // If radius is large enough to cause drawing errors a max radius is imposed
      let cornerRadius = 10;

      if (!vm.horizontal) {
        // bar
        left = vm.x - vm.width / 2;
        right = vm.x + vm.width / 2;
        top = vm.y;
        bottom = vm.base;
        signX = 1;
        signY = bottom > top ? 1 : -1;
        borderSkipped = vm.borderSkipped || 'bottom';
      }
      else {
        // horizontal bar
        left = vm.base;
        right = vm.x;
        top = vm.y - vm.height / 2;
        bottom = vm.y + vm.height / 2;
        signX = right > left ? 1 : -1;
        signY = 1;
        borderSkipped = vm.borderSkipped || 'left';
      }

      // Canvas doesn't allow us to stroke inside the width so we can
      // adjust the sizes to fit if we're setting a stroke on the line
      if (borderWidth) {
        // borderWidth shold be less than bar width and bar height.
        let barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
        borderWidth = borderWidth > barSize ? barSize : borderWidth;
        let halfStroke = borderWidth / 2;
        // Adjust borderWidth when bar top position is near vm.base(zero).
        let borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
        let borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
        let borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
        let borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
        // not become a vertical line?
        if (borderLeft !== borderRight) {
          top = borderTop;
          bottom = borderBottom;
        }
        // not become a horizontal line?
        if (borderTop !== borderBottom) {
          left = borderLeft;
          right = borderRight;
        }
      }

      ctx.beginPath();
      ctx.fillStyle = vm.backgroundColor;
      ctx.strokeStyle = vm.borderColor;
      ctx.lineWidth = borderWidth;

      // Corner points, from bottom-left to bottom-right clockwise
      // | 1 2 |
      // | 0 3 |
      let corners = [
        [left, bottom],
        [left, top],
        [right, top],
        [right, bottom]
      ];

      // Find first (starting) corner with fallback to 'bottom'
      let borders = ['bottom', 'left', 'top', 'right'];
      let startCorner = borders.indexOf(borderSkipped, 0);
      if (startCorner === -1) {
        startCorner = 0;
      }

      function cornerAt(index) {
        return corners[(startCorner + index) % 4];
      }

      // Draw rectangle from 'startCorner'
      let corner = cornerAt(0);
      ctx.moveTo(corner[0], corner[1]);

      for (let i = 1; i < 4; i++) {
        corner = cornerAt(i);
        nextCornerId = i + 1;
        if (nextCornerId == 4) {
          nextCornerId = 0
        }

        nextCorner = cornerAt(nextCornerId);

        width = corners[2][0] - corners[1][0];
        height = corners[0][1] - corners[1][1];
        let x = corners[1][0];
        let y = corners[1][1];

        let radius = cornerRadius;

        // Fix radius being too large
        if (radius > height / 2) {
          radius = height / 2;
        }
        if (radius > width / 2) {
          radius = width / 2;
        }

        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
      }

      ctx.fill();
      if (borderWidth) {
        ctx.stroke();
      }
    };
  }
}

export interface Color {
  backgroundColor?: string | string[];
  borderWidth?: number | number[];
  borderColor?: string | string[];
  borderCapStyle?: string;
  borderDash?: number[];
  borderDashOffset?: number;
  borderJoinStyle?: string;

  pointBorderColor?: string | string[];
  pointBackgroundColor?: string | string[];
  pointBorderWidth?: number | number[];

  pointRadius?: number | number[];
  pointHoverRadius?: number | number[];
  pointHitRadius?: number | number[];

  pointHoverBackgroundColor?: string | string[];
  pointHoverBorderColor?: string | string[];
  pointHoverBorderWidth?: number | number[];
  pointStyle?: string | string[];

  hoverBackgroundColor?: string | string[];
  hoverBorderColor?: string | string[];
  hoverBorderWidth?: number;
}

// pie | doughnut
export interface Colors extends Color {
  data?: number[];
  label?: string;
}

function rgba(colour: Array<number>, alpha: number): string {
  return 'rgba(' + colour.concat(alpha).join(',') + ')';
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor(): number[] {
  return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
}

function generateColor(index: number): number[] {
  return BaseChartDirective.defaultColors[index] || getRandomColor();
}

function generateColors(count: number) {
  let colorArray: Array<number[]> = new Array(count);

  for (let i = 0; i < count; i++) {
    colorArray[i] = BaseChartDirective.defaultColors[i] || getRandomColor();
  }
  return colorArray;
}

function formatPieColors(colors: Array<number[]>): Colors {
  return {
    backgroundColor: colors.map((color: number[]) => rgba(color, 0.6)),
    borderColor: colors.map(() => '#fff'),
    pointBackgroundColor: colors.map((color: number[]) => rgba(color, 1)),
    pointBorderColor: colors.map(() => '#fff'),
    pointHoverBackgroundColor: colors.map((color: number[]) => rgba(color, 1)),
    pointHoverBorderColor: colors.map((color: number[]) => rgba(color, 1))
  };
}

function formatPolarAreaColors(colors: Array<number[]>): Color {
  return {
    backgroundColor: colors.map((color: number[]) => rgba(color, 0.6)),
    borderColor: colors.map((color: number[]) => rgba(color, 1)),
    hoverBackgroundColor: colors.map((color: number[]) => rgba(color, 0.8)),
    hoverBorderColor: colors.map((color: number[]) => rgba(color, 1))
  }
}

function formatLineColor(colors: Array<number>): Color {
  return {
    backgroundColor: rgba(colors, 0.4),
    borderColor: rgba(colors, 1),
    pointBackgroundColor: rgba(colors, 1),
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: rgba(colors, 0.8)
  };
}

function formatBarColor(colors: Array<number>): Color {
  return {
    backgroundColor: rgba(colors, 0.6),
    borderColor: rgba(colors, 1),
    hoverBackgroundColor: rgba(colors, 0.8),
    hoverBorderColor: rgba(colors, 1)
  };
}

function getColors(chartType: string, index: number, count: number): Color {
  if (chartType === 'pie' || chartType === 'doughnut') {
    return formatPieColors(generateColors(count));
  }

  if (chartType === 'polarArea') {
    return formatPolarAreaColors(generateColors(count));
  }

  if (chartType === 'line' || chartType === 'radar') {
    return formatLineColor(generateColor(index));
  }

  if (chartType === 'bar' || chartType === 'horizontalBar') {
    return formatBarColor(generateColor(index));
  }
  return generateColor(index);
}
