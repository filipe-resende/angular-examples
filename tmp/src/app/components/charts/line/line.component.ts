import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Chart, ChartItem } from 'chart.js';
import { OptionsChartScales } from 'src/app/core/constants/Charts/options-chart';
import { ChartsListModel } from 'src/app/model/charts/chart-list-model-interface';
import { ChartModel } from 'src/app/model/charts/chart-model-interface';
import { Labels } from 'src/app/core/constants/Charts/date-label-charts';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnInit, AfterViewInit {
  @Input()
  evolutionData: ChartsListModel;

  public legend: any = [];

  public chart: ChartItem;

  public data: any = {};

  public chartName = 'Evolution Charts';

  private chartColors = ['#2626D1', '#0ABB98', '#FCB400', '#AAF55D', '#FF6700'];

  private legendLabels = [
    'Total',
    'Ativos',
    'Associados',
    'Transmitindo Localização',
    'Associados e Transmitindo (Em Uso)',
  ];

  private positionIndex = [0, 1, 2];

  private labels = Labels();

  private lineChartDataConstructor() {
    this.data = {
      labels: this.labels,
      datasets: [
        {
          label: this.evolutionData.chartsActualMonth[0].label,
          backgroundColor: this.chartColors[0],
          borderColor: this.chartColors[0],
          data: [
            this.evolutionData.chartsTwoMonthsAgo[0].count,
            this.evolutionData.chartsMonthAgo[0].count,
            this.evolutionData.chartsActualMonth[0].count,
          ],
        },
        {
          label: this.evolutionData.chartsActualMonth[1].label,
          backgroundColor: this.chartColors[1],
          borderColor: this.chartColors[1],
          data: [
            this.evolutionData.chartsTwoMonthsAgo[1].count,
            this.evolutionData.chartsMonthAgo[1].count,
            this.evolutionData.chartsActualMonth[1].count,
          ],
        },
        {
          label: this.evolutionData.chartsActualMonth[2].label,
          backgroundColor: this.chartColors[2],
          borderColor: this.chartColors[2],
          data: [
            this.evolutionData.chartsTwoMonthsAgo[2].count,
            this.evolutionData.chartsMonthAgo[2].count,
            this.evolutionData.chartsActualMonth[2].count,
          ],
        },
        {
          label: this.evolutionData.chartsActualMonth[3].label,
          backgroundColor: this.chartColors[3],
          borderColor: this.chartColors[3],
          data: [
            this.evolutionData.chartsTwoMonthsAgo[3].count,
            this.evolutionData.chartsMonthAgo[3].count,
            this.evolutionData.chartsActualMonth[3].count,
          ],
        },
        {
          label: this.evolutionData.chartsActualMonth[4].label,
          backgroundColor: this.chartColors[4],
          borderColor: this.chartColors[4],
          data: [
            this.evolutionData.chartsTwoMonthsAgo[4].count,
            this.evolutionData.chartsMonthAgo[4].count,
            this.evolutionData.chartsActualMonth[4].count,
          ],
        },
      ],
    };
  }

  ngOnInit(): void {
    this.lineChartDataConstructor();
    this.createLegendModel();
  }

  ngAfterViewInit(): void {
    this.createLineChart();
  }

  public createLineChart(): void {
    this.chart = new Chart(this.chartName, {
      type: 'line',
      data: this.data,
      options: {
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        scales: OptionsChartScales,
        plugins: {
          tooltip: {
            intersect: false,
            displayColors: false,
            titleColor: '#fff',
            callbacks: {
              label: context => {
                return this.getFormattedLabel(
                  context.dataset,
                  context.dataIndex,
                );
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    });
  }

  public getFormattedLabel(dataSet: any, dataIndex: number): string {
    let dataSelect: ChartModel;

    switch (dataIndex) {
      case this.positionIndex[0]: {
        dataSelect = this.evolutionData.chartsTwoMonthsAgo.find(
          x => x.label === dataSet.label,
        );
        return this.createTooltip(dataSelect);
      }

      case this.positionIndex[1]: {
        dataSelect = this.evolutionData.chartsMonthAgo.find(
          x => x.label === dataSet.label,
        );
        return this.createTooltip(dataSelect);
      }

      case this.positionIndex[2]: {
        dataSelect = this.evolutionData.chartsActualMonth.find(
          x => x.label === dataSet.label,
        );
        return this.createTooltip(dataSelect);
      }

      default: {
        return null;
      }
    }
  }

  private createTooltip(dataSelect: ChartModel): string {
    return `${dataSelect.count} | ${dataSelect.percentage}`;
  }

  public createLegendModel(): void {
    for (let i = 0; i < this.legendLabels.length; i += 1) {
      this.legend.push({
        color: this.chartColors[i],
        label: this.legendLabels[i],
      });
    }
  }
}
