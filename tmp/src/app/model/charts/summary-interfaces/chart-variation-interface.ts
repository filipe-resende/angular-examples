import { ChartModel } from '../chart-model-interface';

export interface ChartsVariation {
  charts: ChartModel;
  variation: string;
  isNegativeVariation: boolean;
  disableVariation: boolean;
}
