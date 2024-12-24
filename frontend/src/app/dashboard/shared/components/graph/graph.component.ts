import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';


@Component({
    selector: 'graph',
    standalone: true,
    imports: [
        CommonModule, ChartModule
    ],
    templateUrl: './graph.component.html',
    styleUrl: './graph.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent {

    @Input() chartTitle: string;
    @Input() categories: string[];
    @Input() data: number[];
    @Input() transacciones_pagadas: number;
    @Input() transacciones_no_pagadas: number;
    @Input() chartType: string;
  
    public chart: Chart;
    ngOnInit() {

      const seriesData =  [
        {
          name: 'No Pagadas',
          y: this.transacciones_no_pagadas,
          color: '#ff3333'
        },
        {
          name: 'Pagadas',
          y: this.transacciones_pagadas,
          color: '#0ca86b'
        }
      ]
      
      
      if (this.categories && this.data && this.chartType) {
        this.chart = new Chart({
          chart: {
            type: this.chartType,
          },
          title: {
            text: this.chartTitle,
          },
          xAxis: {
            categories: this.categories,
            title: {
              text: 'Transacciones',
            },
          },
          yAxis: {
            title: {
              text: 'N° Registros',
            },
          },
          credits: {
            enabled: false,
          },
          series: [
            {
              name: 'Data',
              data: seriesData,
            } as SeriesOptionsType,
          ],
        });
      }
    }
 }
