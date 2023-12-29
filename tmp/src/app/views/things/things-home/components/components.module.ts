import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ThingsListComponent } from './things-list/things-list.component';
import { ItemThingComponent } from './item-thing/item-thing.component';
import { TypeThingComponent } from './type-thing/type-thing.component';

@NgModule({
  declarations: [ThingsListComponent, ItemThingComponent, TypeThingComponent],
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule,
    NgxPaginationModule,
    SharedModule,
  ],
  exports: [ThingsListComponent, ItemThingComponent, TypeThingComponent],
  providers: [],
})
export class ThingsHomeComponentsModule {}
