/* eslint-disable camelcase */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicationsRoutingModule } from '../../applications/applications-routing.module';
import { DC_FormComponent } from './device-create-form/dc-form.component';
import { DeviceCreateComponent } from './device-create.component';

@NgModule({
  declarations: [DeviceCreateComponent, DC_FormComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    TranslateModule,
    ApplicationsRoutingModule,
    SharedModule,
  ],
  exports: [DeviceCreateComponent, DC_FormComponent],
})
export class DeviceCreateModule {}
