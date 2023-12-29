import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateAdapter } from '@angular/material/core';
import { AutofocusFixModule } from 'ngx-autofocus-fix';
import { ColorPickerModule } from 'ngx-color-picker';
import { CardComponent } from './presentational/card/card.component';
import { MaterialComponentsModule } from '../shared/material.module';
import { InputComponent } from './presentational/input/input.component';
import { HeaderUserComponent } from './presentational/header/header-user/header-user.component';
import { HeaderComponent } from './presentational/header/header.component';
import { ButtonComponent } from './presentational/button/button.component';
import { PaginatorComponent } from './presentational/paginator/paginator.component';
import { SelectComponent } from './presentational/select/select.component';
import { DatepickerComponent } from './presentational/datepicker/datepicker.component';
import { DatepickerFromToComponent } from './presentational/datepicker-from-to/datepicker-from-to.component';
import { HourpickerFromToComponent } from './presentational/hourpicker-from-to/hourpicker-from-to.component';
import { CustomDateAdapter } from '../shared/utils/customDateAdapter';
import { HeaderMenuOverlayComponent } from './presentational/header/header-menu-overlay/header-menu-overlay.component';
import { HeaderNotificationBellComponent } from './presentational/header/header-notification-bell/header-notification-bell.component';
import { CheckboxComponent } from './presentational/checkbox/checkbox.component';
import { Legend } from './smart/legend/legend.component';
import { ToggleComponent } from './presentational/toggle/toggle.component';
import { OverlayInfoComponent } from './presentational/overlay-info/overlay-info.component';
import { HeaderUserMenuOverlayComponent } from './presentational/header/header-user-menu-overlay/header-user-menu-overlay.component';
import { SharedModule } from '../shared/shared.module';
import { SelectBigComponent } from './presentational/select-big/select-big.component';
import { MessageComponent } from './presentational/message/message.component';
import { AuthComponent } from './smart/auth/auth.component';
import { SiteSelectorDeprecatedComponent } from './presentational/site-selector-deprecated/site-selector.component';
import { SiteSelectorOverlayComponent } from './smart/site-selector/site-selector-overlay/site-selector-overlay.component';
import { SiteSelectorComponent } from './smart/site-selector/site-selector.component';
import { AnimatedOverlayComponent } from './templates/animated-overlay/animated-overlay.template';
import { PanicAlertComponent } from './smart/panic-alert/panic-alert.component';
import { ModalModule } from './presentational/modal';
import { PanicAlertOverlayComponent } from './smart/panic-alert/panic-alert-overlay/panic-alert-overlay.component';
import { PanicAlertSubItemComponent } from './smart/panic-alert/panic-alert-subitem/panic-alert-subitem.component';
import { FixedNotificationComponent } from './presentational/fixed-notification/fixed-notification.component';
import { PanicAlertAnswerCallOverlay } from './smart/panic-alert/panic-alert-answer-call-overlay/panic-alert-answer-call-overlay.component';
import { PanicAlertAttendanceDetailsOverlay } from './smart/panic-alert/panic-alert-attendance-details-overlay/panic-alert-attendance-details-overlay.component';
import { PanicAlertConfirmFalsyUpdateCallOverlay } from './smart/panic-alert/panic-alert-confirm-falsy-alert-update-overlay/panic-alert-confirm-falsy-alert-update-overlay.component';
import { OverlayExporterComponent } from './presentational/overlay-exporter/overlay-exporter.component';
import { LabelComponent } from './presentational/label/label.component';
import { HourpickerComponent } from './presentational/hourpicker/hourpicker.component';
import { CommentsSectionComponent } from './presentational/comments-section/comments-section.component';
import { PanicAlertConfirmTruthyUpdateCallOverlay } from './smart/panic-alert/panic-alert-confirm-truthy-alert-update-overlay/panic-alert-confirm-truthy-alert-update-overlay.component';
import { FencesInstructionsOverlayComponent } from './templates/fences-instructions-overlay/fences-instructions-overlay.component';
import { NotificationSettingsOverlayComponent } from './smart/notification-settings-overlay/notification-settings-overlay.component';
import { DevicesSelectorComponent } from './smart/devices-selector/devices-selector.component';
import { MapTwoComponent } from './smart/map-two/map-two.component';
import { ModalUserAgreementComponent } from './smart/modal-user-agreement/modal-user-agreement.component';
import { ModalUserAgreementAcceptedComponent } from './presentational/modal-user-agreement-accepted/modal-user-agreement-accepted.component';
import { ValeColorSelectorComponent } from './smart/vale-color-selector/vale-color-selector.component';
import { CoreModule } from '../core/core.module';
import { MapPolygonCoordinatesComponent } from './smart/map-polygon-coordinates/map-polygon-coordinates.component';
import { MultiSelectAutocompleteComponent } from './presentational/multi-select-autocomplete/multi-select-autocomplete.component';
import { ModalStatusComponent } from './presentational/modal-status/modal-status.component';
import { AlertComponent } from './presentational/alert/alert.component';
import { AzureMapComponent } from './smart/azure-map/azure-map.component';
import { MiniMapComponent } from './smart/mini-map/mini-map.component';
import { RealTimeEventsSelectorComponent } from './smart/real-time-events-selector/real-time-events-selector.component';
import { ModalConfirmationComponent } from './smart/modal-confirmation/modal-confirmation.component';
import { ModalAgreementComponent } from './smart/modal-agreement/modal-agreement.component';
import { BusPlatesSearchSelectorComponent } from './smart/bus-plates-search-selector/bus-plates-search-selector.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ColorPickerModule,
    ReactiveFormsModule,
    NgSelectModule,
    ModalModule,
    MaterialComponentsModule,
    SharedModule,
    AutofocusFixModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    CardComponent,
    CommentsSectionComponent,
    AuthComponent,
    LabelComponent,
    CheckboxComponent,
    Legend,
    InputComponent,
    HeaderComponent,
    HeaderMenuOverlayComponent,
    HeaderUserMenuOverlayComponent,
    SelectComponent,
    SelectBigComponent,
    HeaderComponent,
    ToggleComponent,
    MessageComponent,
    HeaderUserComponent,
    HeaderNotificationBellComponent,
    OverlayInfoComponent,
    ButtonComponent,
    DatepickerComponent,
    HourpickerComponent,
    HourpickerFromToComponent,
    DatepickerFromToComponent,
    PaginatorComponent,
    PanicAlertComponent,
    PanicAlertOverlayComponent,
    PanicAlertSubItemComponent,
    PanicAlertAnswerCallOverlay,
    PanicAlertAttendanceDetailsOverlay,
    PanicAlertConfirmFalsyUpdateCallOverlay,
    PanicAlertConfirmTruthyUpdateCallOverlay,
    SiteSelectorDeprecatedComponent,
    SiteSelectorOverlayComponent,
    SiteSelectorComponent,
    AnimatedOverlayComponent,
    FixedNotificationComponent,
    OverlayExporterComponent,
    NotificationSettingsOverlayComponent,
    FencesInstructionsOverlayComponent,
    DevicesSelectorComponent,
    MapTwoComponent,
    ModalUserAgreementComponent,
    ModalUserAgreementAcceptedComponent,
    ValeColorSelectorComponent,
    MapPolygonCoordinatesComponent,
    MultiSelectAutocompleteComponent,
    ModalStatusComponent,
    AlertComponent,
    AzureMapComponent,
    MiniMapComponent,
    RealTimeEventsSelectorComponent,
    ModalConfirmationComponent,
    ModalAgreementComponent,
    BusPlatesSearchSelectorComponent
  ],
  exports: [
    CardComponent,
    CommentsSectionComponent,
    CheckboxComponent,
    Legend,
    AuthComponent,
    LabelComponent,
    DatepickerComponent,
    HourpickerComponent,
    HourpickerFromToComponent,
    DatepickerFromToComponent,
    ToggleComponent,
    TranslateModule,
    MaterialComponentsModule,
    InputComponent,
    MessageComponent,
    HeaderComponent,
    HeaderMenuOverlayComponent,
    HeaderUserMenuOverlayComponent,
    HeaderUserComponent,
    HeaderNotificationBellComponent,
    OverlayInfoComponent,
    ButtonComponent,
    SelectComponent,
    SelectBigComponent,
    PaginatorComponent,
    PanicAlertComponent,
    PanicAlertOverlayComponent,
    PanicAlertSubItemComponent,
    PanicAlertAnswerCallOverlay,
    PanicAlertAttendanceDetailsOverlay,
    PanicAlertConfirmFalsyUpdateCallOverlay,
    PanicAlertConfirmTruthyUpdateCallOverlay,
    SiteSelectorDeprecatedComponent,
    SiteSelectorOverlayComponent,
    SiteSelectorComponent,
    AnimatedOverlayComponent,
    FixedNotificationComponent,
    OverlayExporterComponent,
    NotificationSettingsOverlayComponent,
    FencesInstructionsOverlayComponent,
    DevicesSelectorComponent,
    MapTwoComponent,
    ModalUserAgreementComponent,
    ModalUserAgreementAcceptedComponent,
    ValeColorSelectorComponent,
    MapPolygonCoordinatesComponent,
    MultiSelectAutocompleteComponent,
    ModalStatusComponent,
    AlertComponent,
    MiniMapComponent,
    AzureMapComponent,
    RealTimeEventsSelectorComponent,
    BusPlatesSearchSelectorComponent
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter
    }
  ]
})
export class ComponentsModule {}
