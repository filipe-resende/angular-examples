import { DeviceStatusChartComponent } from 'src/app/components/charts/device-status-chart/device-status-chart.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DoughnutChartComponent } from 'src/app/components/charts/doughnut/doughnut-chart-component';
import { ListChartComponent } from 'src/app/components/charts/list/list-chart-component';
import { BarChartComponent } from 'src/app/components/charts/bar/bar-chart-component';
import { ListTwoCaptionsComponent } from 'src/app/components/charts/list-two-captions/list-two-captions.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SummaryComponent } from 'src/app/components/charts/summary/summary.component';
import { MaterialComponentsModule } from 'src/app/shared/material.module';
import { SummarySectionComponent } from 'src/app/components/charts/summary/summary-section/summary-section.component';
import { LineComponent } from 'src/app/components/charts/line/line.component';
import { ThingCompanyComponent } from 'src/app/components/thing-company/thing-company.component';
import { ThingEmailComponent } from 'src/app/components/thing-email/thing-email.component';
import { TableEffectivenessComponent } from 'src/app/components/effectiveness/table-effectiveness/table-effectiveness.component';
import { InputAutoCompleteComponent } from 'src/app/components/input-autocomplete/input-autocomplete.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { UseEffectivenessDashboardComponent } from './use-effectiveness-dashboard/use-effectiveness-dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DoughnutChartComponent,
    ListChartComponent,
    BarChartComponent,
    ListTwoCaptionsComponent,
    DeviceStatusChartComponent,
    SummaryComponent,
    SummarySectionComponent,
    LineComponent,
    ThingCompanyComponent,
    ThingEmailComponent,
    ManagementDashboardComponent,
    UseEffectivenessDashboardComponent,
    TableEffectivenessComponent,
    InputAutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslateModule,
    FormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MaterialComponentsModule,
  ],
})
export class DashboardModule {}
