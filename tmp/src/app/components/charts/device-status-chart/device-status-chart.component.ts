import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ChartItem, Chart } from 'chart.js';
import { Labels } from 'src/app/core/constants/Charts/date-label-charts';
import { OptionsChartScales } from 'src/app/core/constants/Charts/options-chart';
import { ApplicationId } from 'src/app/core/constants/applicationsId.const';
import { DeviceStatus } from 'src/app/core/constants/device-status.const';
import { ChartsListModel } from 'src/app/model/charts/chart-list-model-interface';
import { ChartModel } from 'src/app/model/charts/chart-model-interface';

@Component({
  selector: 'app-device-status-chart',
  templateUrl: './device-status-chart.component.html',
  styleUrls: ['./device-status-chart.component.scss'],
})
export class DeviceStatusChartComponent implements OnInit, AfterViewInit {
  @Input()
  deviceStatusData: ChartsListModel;

  @Input()
  selectedApplication = '';

  @Input()
  typeDevice: string;

  public legend: any = [];

  public chart: ChartItem;

  public dataCharts: any = {};

  public chartName = 'Device Status';

  private chartColors = ['#9DE4D6', '#7895A4', '#C7BA91'];

  private legendLabels = [];

  private labels = Labels();

  private smartbagdeStatus = [
    DeviceStatus.ACTIVE,
    DeviceStatus.INACTIVE_LOSS,
    DeviceStatus.INACTIVE_RETURNED,
    DeviceStatus.INACTIVE_SUBSTITUTED,
    DeviceStatus.SUSPENDED_TECHNICAL_ASSISTANCE,
    DeviceStatus.TEST_TI,
  ];

  private spotStatus = [
    DeviceStatus.ACTIVE,
    DeviceStatus.INACTIVE_LOSS,
    DeviceStatus.IN_STOCK,
    DeviceStatus.INACTIVE_DISCARED,
    DeviceStatus.TEST_TI,
  ];

  private dataSheetsController = [];

  ngOnInit(): void {
    this.selectedLegendLabels();

    this.createObjectByGraph();

    this.createLegendModel();
    this.dataCharts = {
      labels: this.legendLabels,
      datasets: this.dataSheetsController,
    };
  }

  ngAfterViewInit(): void {
    this.selectedLegendLabels();

    if (
      this.deviceStatusData.chartsActualMonth.length ||
      this.deviceStatusData.chartsMonthAgo.length ||
      this.deviceStatusData.chartsTwoMonthsAgo.length
    ) {
      this.createChart();
    }
  }

  private selectedLegendLabels(): void {
    this.legendLabels = [];

    if (this.typeDevice === ApplicationId.SPOT) {
      this.legendLabels = this.spotStatus;
    } else {
      this.legendLabels = this.smartbagdeStatus;
    }
  }

  private createObjectByGraph(): void {
    if (this.deviceStatusData.chartsTwoMonthsAgo) {
      const twoMonthAgoDataCharts = this.deviceStatusData.chartsTwoMonthsAgo.map(
        twoMonthAgo => twoMonthAgo.count,
      );
      this.dataSheetsController.push({
        label: this.labels[0],
        backgroundColor: this.chartColors[0],
        data: twoMonthAgoDataCharts,
      });
    }

    if (this.deviceStatusData.chartsMonthAgo) {
      const monthAgoDataCharts = this.deviceStatusData.chartsMonthAgo.map(
        monthAgo => monthAgo.count,
      );
      this.dataSheetsController.push({
        label: this.labels[1],
        backgroundColor: this.chartColors[1],
        data: monthAgoDataCharts,
      });
    }

    if (this.deviceStatusData.chartsActualMonth) {
      const actualMonthDataCharts = this.deviceStatusData.chartsActualMonth.map(
        actualMonth => actualMonth.count,
      );
      this.dataSheetsController.push({
        label: this.labels[2],
        backgroundColor: this.chartColors[2],
        data: actualMonthDataCharts,
      });
    }
  }

  public createChart(): void {
    this.chart = new Chart(this.chartName, {
      type: 'bar',
      data: this.dataCharts,
      options: {
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        responsive: false,
        scales: OptionsChartScales,
        plugins: {
          tooltip: {
            displayColors: false,
            titleColor: '#fff',
            callbacks: {
              label: context => {
                return this.getFormattedLabel(context.label, context.dataset);
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

  public getFormattedLabel(name: string, dataset: any): string {
    let legendCharts: ChartModel;

    switch (dataset.label) {
      case this.labels[2]: {
        legendCharts = this.deviceStatusData.chartsActualMonth.find(
          x => x.label === name,
        );
        return `${legendCharts.count} | ${legendCharts.percentage}`;
      }

      case this.labels[1]: {
        legendCharts = this.deviceStatusData.chartsMonthAgo.find(
          x => x.label === name,
        );
        return `${legendCharts.count} | ${legendCharts.percentage}`;
      }

      case this.labels[0]: {
        legendCharts = this.deviceStatusData.chartsTwoMonthsAgo.find(
          x => x.label === name,
        );
        return `${legendCharts.count} | ${legendCharts.percentage}`;
      }

      default: {
        return null;
      }
    }
  }

  public createLegendModel(): void {
    for (let i = 0; i < this.labels.length; i += 1) {
      this.legend.push({
        color: this.chartColors[i],
        label: this.labels[i],
      });
    }
  }
}
