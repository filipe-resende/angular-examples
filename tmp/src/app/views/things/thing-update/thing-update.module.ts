import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaskModule } from 'ngx-mask';

import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ThingsRoutingModule } from '../things-routing.module';
import { ThingUpdateComponentsModule } from './components/components.module';

import { ThingUpdateComponent } from './thing-update.component';

@NgModule({
  declarations: [ThingUpdateComponent],
  imports: [
    CommonModule,
    ThingsRoutingModule,
    FormsModule,
    SharedModule,
    ComponentsModule,
    NgxMaskModule,
    BsDatepickerModule,
    ThingUpdateComponentsModule,
    MatTooltipModule,
  ],
  providers: [],
  exports: [ThingUpdateComponent],
})
export class ThingUpdateModule {}
