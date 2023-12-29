import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { MapSetup } from './map.setup';
import { ComponentsModule } from '../../components.module';
import { InfoWindowFactory } from './info-window.factory';

@NgModule({
  imports: [CommonModule, ComponentsModule],
  declarations: [MapComponent],
  exports: [MapComponent],
  providers: [MapSetup, InfoWindowFactory]
})
export class MapModule {}
