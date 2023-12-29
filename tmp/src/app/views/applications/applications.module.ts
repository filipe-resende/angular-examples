import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ApplicationsRoutingModule } from './applications-routing.module';

import { ApplicationHomeComponent } from './application-home/application-home.component';
import { ApplicationListComponent } from './application-home/application-list/application-list.component';
import { ApplicationItemComponent } from './application-home/application-item/application-item.component';
import { ApplicationCreateComponent } from './application-create/application-create.component';
import { ApplicationUpdateComponent } from './application-update/application-update.component';
import { ApplicationMetricsComponent } from './application-metrics/application-metrics.component';

@NgModule({
  declarations: [
    ApplicationHomeComponent,
    ApplicationListComponent,
    ApplicationItemComponent,
    ApplicationCreateComponent,
    ApplicationUpdateComponent,
    ApplicationMetricsComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ApplicationsRoutingModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  providers: [],
})
export class ApplicationsModule {}
