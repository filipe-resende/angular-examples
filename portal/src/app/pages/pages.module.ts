import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HelpComponent } from './help/help.component';
import { PagesRoutingModule } from './pages.routing';

import { MaterialComponentsModule } from '../shared/material.module';
import { ListPage } from './list/list.page';
import { PlaceholderComponent } from './placeholder/placeholder.component';

import { DialogModule } from '../components/presentational/dialog/dialog.module';
import { MapModule } from '../components/smart/map/map.module';
import { SearchPipe } from '../core/pipes/search.pipes';
import { DashboardPage } from './dashboard/dashboard.page';
import { FencesPage } from './fences/fences.page';
import { PerimetersPage } from './perimeters/perimeters.page';
import { PerimetersAccordionComponent } from './perimeters/perimeters-accordion/perimeters-accordion.component';
import { HistoricPage } from './historic/historic.page';
import { PoiComponent } from './poi/poi.component';
import { ComponentsModule } from '../components/components.module';
import { DisplacementPage } from './displacement/displacement.page';
import { NotificationsPage } from './notifications/notifications.page';
import { FencesAccordionComponent } from './fences/fences-accordion/fences-accordion.component';
import { FencesCreateComponent } from './fences/fences-create/fences-create.component';
import { FocalComponent } from './focal/focal.component';
import { DisplacementExportOverlayComponent } from './displacement/displacement-export-overlay/displacement-export-overlay.component';
import { OverlayService } from '../core/services/overlay.service';
import { PoiCreateComponent } from './poi/poi-create/poi-create.component';
import { PoiAccordionComponent } from './poi/poi-accordion/poi-accordion.component';
import { HistoricListComponent } from './historic/historic-list/historic-list.component';
import { DisplacementOldPage } from './displacement-old/displacement-old.page';
import { PerimetersEditCreateComponent } from './perimeters/perimeters-edit-create/perimeters-edit-create.component';
import { DevicesPage } from './devices/devices.page';
import { DeletePerimeterConfimationDialogComponent } from './perimeters/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FlightsCounterComponent } from './flights-and-gates/flights-counter/flights-counter.component';
import { FlightsAndGatesPage } from './flights-and-gates/flights-and-gates.page';
import { FlightsAndGatesPeoplePage } from './flights-and-gates-people/flights-and-gates-people.page';
import { LowBatteryNotificationsComponent } from './notifications/low-battery-notifications/low-battery-notifications.component';
import { PanicButtonNotificationsComponent } from './notifications/panic-button-notifications/panic-button-notifications.component';
import { DisplacementMapComponent } from './displacement-map/displacement-map.component';
import { DisplacementPeopleOverlayComponent } from './displacement/displacement-people-overlay/displacement-people-overlay.component';
import { GeofencesPage } from './geofences/geofences.page';
import { ExpirationNotificationsComponent } from './notifications/expiration-notifications/expiration-notifications.component';
import { FencesDeleteModalComponent } from './fences/fences-delete-modal/fences-delete-modal.component';
import { HistoricGeofencesSelectorComponent } from './historic/historic-geofences-selector/historic-geofences-selector.component';
import { HistoricEventsListComponent } from './historic/historic-events-list/historic-events-list.component';
import { ExportationDoneModalComponent } from '../components/presentational/exportation-done-modal/exportation-done-modal.component';
import { ActionButtonComponent } from '../components/presentational/action-button/action-button.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ComponentsModule,
    PagesRoutingModule,
    MaterialComponentsModule,
    MapModule,
    ColorPickerModule,
    DialogModule,
    ScrollingModule,
    NgSelectModule
  ],
  declarations: [
    PlaceholderComponent,
    HelpComponent,
    DashboardPage,
    DevicesPage,
    NotificationsPage,
    LowBatteryNotificationsComponent,
    PanicButtonNotificationsComponent,
    HistoricPage,
    HistoricListComponent,
    SearchPipe,
    FencesPage,
    FencesAccordionComponent,
    ExportationDoneModalComponent,
    ActionButtonComponent,
    FencesCreateComponent,
    PerimetersPage,
    PerimetersEditCreateComponent,
    PerimetersAccordionComponent,
    PoiComponent,
    PoiCreateComponent,
    PoiAccordionComponent,
    FocalComponent,
    ListPage,
    DisplacementPage,
    DisplacementOldPage,
    DisplacementExportOverlayComponent,
    DeletePerimeterConfimationDialogComponent,
    FlightsAndGatesPage,
    FlightsCounterComponent,
    FlightsAndGatesPeoplePage,
    DisplacementMapComponent,
    DisplacementPeopleOverlayComponent,
    GeofencesPage,
    ExpirationNotificationsComponent,
    FencesDeleteModalComponent,
    HistoricGeofencesSelectorComponent,
    HistoricEventsListComponent
  ],
  providers: [OverlayService]
})
export class PagesModule {}
