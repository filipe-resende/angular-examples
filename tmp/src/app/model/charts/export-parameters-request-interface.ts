import { ChartsFilterRequest } from './charts-filter-request-interface';
import { GraphicsSelectedForExport } from './graphics-selected-for-export-interface';

export interface ExportParametersRequest {
  managerName?: string;
  emailUser: string;
  chartsFilter: ChartsFilterRequest;
  graphicsSelected: GraphicsSelectedForExport;
}
