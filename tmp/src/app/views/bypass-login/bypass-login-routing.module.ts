import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BypassLoginComponent } from './bypass-login.component';
import { BypassLoginGuard } from './bypass-login.guard';

const routes: Routes = [
  {
    path: '',
    component: BypassLoginComponent,
    canActivate: [BypassLoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BypassLoginRoutingModule {}
