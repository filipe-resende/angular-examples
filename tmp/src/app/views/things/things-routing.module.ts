import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThingsHomeComponent } from './things-home/things-home.component';
import { ThingCreateComponent } from './thing-create/thing-create.component';
import { ThingUpdateComponent } from './thing-update/thing-update.component';

const routes: Routes = [
  { path: '', component: ThingsHomeComponent },
  { path: 'create', component: ThingCreateComponent },
  { path: 'update/:id', component: ThingUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThingsRoutingModule {}
