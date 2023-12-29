import { Component, Input } from '@angular/core';
import { VariationCharts } from 'src/app/core/constants/Charts/variation-charts';
import { ChartsVariation } from 'src/app/model/charts/summary-interfaces/chart-variation-interface';

@Component({
  selector: 'app-summary-section',
  templateUrl: './summary-section.component.html',
  styleUrls: ['./summary-section.component.scss'],
})
export class SummarySectionComponent {
  @Input()
  dataSection: ChartsVariation;

  @Input()
  isOverallChart = false;

  variationResume = VariationCharts;
}
