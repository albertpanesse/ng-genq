import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'echart-comp',
  template: `<div class="chart-container" #chartContainer></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `],
  standalone: true,
})
export class EchartComponent implements OnInit, OnDestroy {
  @Input() options: echarts.EChartsOption = {};
  @Input() width: string = '100%';
  @Input() height: string = '400px';

  private chartInstance: echarts.ECharts | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }

  private initChart(): void {
    const container = this.el.nativeElement.querySelector('.chart-container');
    container.style.width = this.width;
    container.style.height = this.height;

    this.chartInstance = echarts.init(container);
    if (this.options) {
      this.chartInstance.setOption(this.options);
    }
  }

  public updateOptions(options: echarts.EChartsOption): void {
    if (this.chartInstance) {
      this.chartInstance.setOption(options, true);
    }
  }
}
