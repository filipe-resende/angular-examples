import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchLoadComponent } from './batch-load.component';

const routes: Routes = [{ path: '', component: BatchLoadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchLoadRoutingModule {}
