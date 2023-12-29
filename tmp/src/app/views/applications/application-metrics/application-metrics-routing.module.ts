import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationMetricsComponent } from './application-metrics.component';

const routes: Routes = [{ path: '', component: ApplicationMetricsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationMetricsRoutingModule {}
