import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationHomeComponent } from './application-home/application-home.component';
import { ApplicationCreateComponent } from './application-create/application-create.component';
import { ApplicationUpdateComponent } from './application-update/application-update.component';

const routes: Routes = [
  { path: '', component: ApplicationHomeComponent },
  { path: 'create', component: ApplicationCreateComponent },
  { path: 'update/:id', component: ApplicationUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
