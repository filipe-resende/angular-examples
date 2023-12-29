import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LoadingModule } from '../components/presentational/loading/loading.module';
import { MaterialComponentsModule } from '../shared/material.module';
import { EnumKeysToArrayPipe } from './pipes/enum-values-to-array.pipe';
import { ClickElsewhereDirective } from './directives/click-elsewhere.directive';
import { RoleGuard } from './role.guard';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    MaterialComponentsModule,
    LoadingModule,
  ],
  exports: [EnumKeysToArrayPipe, ClickElsewhereDirective],
  providers: [RoleGuard],
  declarations: [EnumKeysToArrayPipe, ClickElsewhereDirective],
})
export class CoreModule {}
