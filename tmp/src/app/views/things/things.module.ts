import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';

import { NgxMaskModule } from 'ngx-mask';
import { ThingsRoutingModule } from './things-routing.module';
import { ThingUpdateModule } from './thing-update/thing-update.module';
import { ThingCreateModule } from './thing-create/thing-create.module';
import { ThingsHomeModule } from './things-home/things-home.module';
@NgModule({
  declarations: [],
  imports: [
    ThingsRoutingModule,
    NgxMaskModule.forRoot(),
    ThingUpdateModule,
    ThingCreateModule,
    ThingsHomeModule,
  ],
  providers: [BsModalRef],
})
export class ThingsModule {}
