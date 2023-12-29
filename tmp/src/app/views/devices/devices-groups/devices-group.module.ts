import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevicesGroupsComponent } from './devices-groups.component';

const routes: Routes = [{ path: '', component: DevicesGroupsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicesGroupsRoutingModule {}
