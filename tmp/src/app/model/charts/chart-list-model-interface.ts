import { ChartModel } from './chart-model-interface';

export interface ChartsListModel {
  chartsActualMonth: ChartModel[];
  chartsMonthAgo: ChartModel[];
  chartsTwoMonthsAgo: ChartModel[];
}
