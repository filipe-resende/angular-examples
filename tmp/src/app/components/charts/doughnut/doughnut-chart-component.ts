import { Component, Input, OnInit } from '@angular/core';
import Chart, {
  ChartConfiguration,
  ChartItem,
  ChartOptions,
  ChartType,
} from 'chart.js/auto';
import { ChartModel } from 'src/app/model/charts/chart-model-interface';
import { DatasetModel } from 'src/app/model/charts/chart-dataset-model-interface';
import { ChartLegendModel } from 'src/app/model/charts/chart-legend-model-interface';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart-component.html',
  styleUrls: ['./doughnut-chart-component.scss'],
})
export class DoughnutChartComponent implements OnInit {
  @Input()
  sapPlantData: ChartModel[] = [];

  @Input()
  selectedApplication = '';

  @Input()
  yesterday = '';

  public type: ChartType = 'doughnut';

  public chart: ChartItem;

  public labels: string[] = [];

  public datasets: DatasetModel[] = [];

  public elementsCount: number[] = [];

  public options: ChartOptions;

  public config: ChartConfiguration;

  public chartLegend: ChartLegendModel[] = [];

  public chartColors: string[] = [
    '#077e7a',
    '#ecb11f',
    '#e37222',
    '#0abb98',
    '#ffdd99',
    '#778699',
  ];

  ngOnInit(): void {
    this.prepareData();
  }

  public createChart(): void {
    this.chart = new Chart('MyChart', {
      type: this.config.type,
      data: this.config.data,
      options: this.options,
    });
  }

  public creatingLabels(): void {
    this.sapPlantData.forEach(element => {
      this.labels.push(element.label);
    });
  }

  public creatingDataSets(): void {
    this.datasets.push({
      data: this.elementsCount,
      backgroundColor: this.chartColors,
    });
  }

  public getTotalCount(): void {
    this.sapPlantData.forEach(element => {
      this.elementsCount.push(element.count);
    });
  }

  public prepareData(): void {
    this.getTotalCount();
    this.creatingLabels();
    this.creatingDataSets();
    this.createOptions();
    this.createLegendList();

    this.config = {
      type: this.type,
      data: { labels: this.labels, datasets: this.datasets },
    };

    this.createChart();
  }

  public getFormatedLabel(name: string): string {
    const item = this.sapPlantData.find(sap => sap.label === name);
    return ` ${item.count} (${item.percentage})`;
  }

  public createLegendList(): void {
    for (let i = 0; i < this.sapPlantData.length; i += 1) {
      this.chartLegend.push({
        color: this.chartColors[i],
        label: this.sapPlantData[i].label,
        count: this.sapPlantData[i].count,
      });
    }
  }

  public createOptions(): void {
    this.options = {
      aspectRatio: 1.5,
      responsive: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => {
              return this.getFormatedLabel(context.label);
            },
          },
        },
        legend: {
          display: false,
        },
      },
    };
  }
}
