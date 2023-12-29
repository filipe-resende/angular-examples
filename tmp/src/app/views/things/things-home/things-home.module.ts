import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { ThingsRoutingModule } from '../things-routing.module';
import { ThingsHomeComponentsModule } from './components/components.module';
import { ThingsHomeComponent } from './things-home.component';

@NgModule({
  declarations: [ThingsHomeComponent],
  imports: [
    CommonModule,
    ThingsRoutingModule,
    ComponentsModule,
    SharedModule,
    NgxMaskModule,
    NgxPaginationModule,
    ThingsHomeComponentsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ThingsHomeComponent],
  providers: [],
})
export class ThingsHomeModule {}
