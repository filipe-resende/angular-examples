import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevicesHomeComponent } from './devices-home/devices-home.component';
import { DeviceCreateComponent } from './device-create/device-create.component';

const routes: Routes = [
  { path: '', component: DevicesHomeComponent },
  { path: 'create', component: DeviceCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesRoutingModule {}
