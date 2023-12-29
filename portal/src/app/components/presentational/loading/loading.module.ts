import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { LoadingComponent } from './loading.component';
import { LoadingDirective } from './loading.directive';
import { LoadingService } from './loading.service';

@NgModule({
  imports: [SharedModule, CommonModule],
  exports: [LoadingComponent, LoadingDirective],
  declarations: [LoadingComponent, LoadingDirective],
  providers: [LoadingService]
})
export class LoadingModule {}
