import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaskModule } from 'ngx-mask';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialComponentsModule } from 'src/app/shared/material.module';
import { ThingsRoutingModule } from '../../things-routing.module';
import { ThingHistoryComponent } from './thing-history/thing-history.component';

import { ThingsUpdateFormComponent } from './thing-update-form/tu-form.component';

@NgModule({
  declarations: [ThingsUpdateFormComponent, ThingHistoryComponent],
  imports: [
    CommonModule,
    ThingsRoutingModule,
    ComponentsModule,
    FormsModule,
    SharedModule,
    NgxMaskModule,
    MatRadioModule,
    MatButtonModule,
    MatTooltipModule,
    MaterialComponentsModule,
  ],
  exports: [ThingsUpdateFormComponent, ThingHistoryComponent],
  providers: [DatePipe],
})
export class ThingUpdateComponentsModule {}
