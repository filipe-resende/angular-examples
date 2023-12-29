import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryLoadComponent } from './history-load.component';

const routes: Routes = [{ path: '', component: HistoryLoadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryLoadRoutingModule {}
