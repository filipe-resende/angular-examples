import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';

import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialComponentsModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ThingsRoutingModule } from '../things-routing.module';

import { ThingCreateFormComponent } from './thing-create-form/tc-form.component';
import { ThingCreateComponent } from './thing-create.component';

@NgModule({
  declarations: [ThingCreateComponent, ThingCreateFormComponent],
  imports: [
    CommonModule,
    ThingsRoutingModule,
    ComponentsModule,
    FormsModule,
    SharedModule,
    NgxMaskModule,
    MatTooltipModule,
    MaterialComponentsModule,
    MatRadioModule,
    MatButtonModule,
  ],
  exports: [],
  providers: [],
})
export class ThingCreateModule {}
