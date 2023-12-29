/* eslint-disable camelcase */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMaskModule } from 'ngx-mask';
import { MatTabsModule } from '@angular/material/tabs';
import { DevicesRoutingModule } from '../devices-routing.module';
import { DH_ComponentsModule } from './components/components.module';

import { DevicesHomeComponent } from './devices-home.component';

@NgModule({
  declarations: [DevicesHomeComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    ComponentsModule,
    DevicesRoutingModule,
    FormsModule,
    DH_ComponentsModule,
    SharedComponentsModule,
    NgxPaginationModule,
    NgxMaskModule,
    MatTabsModule,
  ],
  exports: [DevicesHomeComponent],
  providers: [],
})
export class DevicesHomeModule {}
