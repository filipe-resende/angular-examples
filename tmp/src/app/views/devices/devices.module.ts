import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxMaskModule } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComponentsModule } from '../../components/components.module';
import { DeviceCreateModule } from './device-create/device-create.module';
import { DevicesGroupsComponent } from './devices-groups/devices-groups.component';
import { DevicesHomeModule } from './devices-home/devices-home.module';
import { DevicesRoutingModule } from './devices-routing.module';

@NgModule({
  declarations: [DevicesGroupsComponent],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    ComponentsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    DevicesHomeModule,
    SharedComponentsModule,
    NgxMaskModule.forRoot(),
    DeviceCreateModule,
    UiSwitchModule,
    MatProgressSpinnerModule,
  ],
  providers: [BsModalRef],
})
export class DevicesModule {}
