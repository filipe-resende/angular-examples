/* eslint-disable camelcase */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { NgxMaskModule } from 'ngx-mask';
import { MaterialComponentsModule } from 'src/app/shared/material.module';
import { DeviceResumeComponent } from './device-resume/device-resume.component';
import { DevicesAssociationSummaryComponent } from './devices-association-summary/devices-association-summary.component';
import { DeviceHistoryComponent } from './device-history/device-history.component';
import { DeviceBatteryComponent } from './device-battery/device-battery.component';
import { DeviceFormComponent } from './device-form/device-form.component';
import { DeviceMovementHistoryComponent } from './device-movement-history/device-movement-history.component';

@NgModule({
  declarations: [
    DeviceResumeComponent,
    DevicesAssociationSummaryComponent,
    DeviceHistoryComponent,
    DeviceMovementHistoryComponent,
    DeviceBatteryComponent,
    DeviceFormComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    NgxPaginationModule,
    SharedModule,
    FormsModule,
    NgxMaskModule,
    MaterialComponentsModule,
  ],
  exports: [
    DeviceResumeComponent,
    DevicesAssociationSummaryComponent,
    DeviceHistoryComponent,
    DeviceBatteryComponent,
    DeviceMovementHistoryComponent,
    DeviceFormComponent,
  ],
  providers: [],
})
export class DH_ComponentsModule {}
