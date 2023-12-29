import { ChartsVariation } from './chart-variation-interface';

export interface ChartSummary {
  overall: ChartsVariation;
  active: ChartsVariation;
  associates: ChartsVariation;
  transmitting: ChartsVariation;
  inUse: ChartsVariation;
}
