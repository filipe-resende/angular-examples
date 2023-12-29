import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialComponentsModule } from '../shared/material.module';

import { ActionButtonComponent } from './action-button/action-button.component';
import { ActionButtonOutlineComponent } from './action-button-outline/action-button-outline.component';
import { ArrowButtonComponent } from './arrow-button/arrow-button.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { AnimatedOverlayComponent } from './templates/animated-overlay/animated-overlay.component';
import { ItemDeviceComponent } from './item-device/item-device.component';
import { HeaderComponent } from './header/header.component';
import { HeaderUserMenuOverlayComponent } from './header/header-user-menu-overlay/header-user-menu-overlay.component';
import { HeaderUserComponent } from './header/header-user/header-user.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainTitleComponent } from './main-title/main-title.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { UserAgreementModalComponent } from './smart/user-agreement-modal/user-agreement-modal.component';
import { ModalUserAgreementAcceptedComponent } from './modal-user-agreement-accepted/modal-user-agreement-accepted.component';
import { ThingsModalComponent } from './things-modal/things-modal.component';
import { CustomPaginationComponent } from './custom-pagination/custom-pagination.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { AssociateButtonComponent } from './associate-button/associate-button.component';
import { DisassociateButtonComponent } from './disassociate-button/disassociate-button.component';
import { ApplicationDropdownComponent } from './application-dropdown/application-dropdown.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { DisassociateModalComponent } from './disassociate-modal/disassociate-modal.component';
import { ExportationRecipientModalComponent } from './exportation-recipient-modal/exportation-recipient-modal.component';
import { ExportationDoneModalComponent } from './exportation-done-modal/exportation-done-modal.component';

import { AlertComponent } from './alert/alert.component';
import { SidebarMenuOverlayComponent } from './sidebar/sidebar-menu-overlay/sidebar-menu-overlay.component';
import { ReactivateSubscriptionModalComponent } from './reactivate-subscription-modal/reactivate-subscription-modal.component';
import { ThingGroupAssociationComponent } from '../views/devices/devices-groups/devices-edit-group/thing-group-association/thing-group-association.component';
import { ConfirmationRemoveMemberModalComponent } from './confirmation-remove-member-modal/confirmation-remove-member-modal-component';
import { WantCreateModalComponent } from './want-create-modal/want-create-modal.component';
import { ExportListDashComponent } from './export-list-dash/export-list-dash.component';
import { SapPlantComponent } from './sap-plant/sap-plant.component';
import { ManagementComponent } from './management/management.component';
import { EditGroupNameComponent } from '../views/devices/devices-groups/devices-edit-group/edit-group-name/edit-group-name.component';
import { ModalAgreementComponent } from './modal-agreement/modal-agreement.component';

@NgModule({
  declarations: [
    ActionButtonComponent,
    ActionButtonOutlineComponent,
    ArrowButtonComponent,
    ArrowButtonComponent,
    AlertModalComponent,
    AnimatedOverlayComponent,
    ActionButtonComponent,
    ItemDeviceComponent,
    HeaderComponent,
    HeaderUserMenuOverlayComponent,
    HeaderUserComponent,
    MainTitleComponent,
    PaginationComponent,
    SidebarComponent,
    SidebarMenuOverlayComponent,
    SettingsModalComponent,
    UserAgreementModalComponent,
    ModalUserAgreementAcceptedComponent,
    ThingsModalComponent,
    ThingGroupAssociationComponent,
    CustomPaginationComponent,
    DisassociateModalComponent,
    AssociateButtonComponent,
    DisassociateButtonComponent,
    DatePickerComponent,
    InfoCardsComponent,
    ApplicationDropdownComponent,
    ExportationRecipientModalComponent,
    ExportationDoneModalComponent,
    AlertComponent,
    ReactivateSubscriptionModalComponent,
    ConfirmationRemoveMemberModalComponent,
    WantCreateModalComponent,
    ExportListDashComponent,
    SapPlantComponent,
    ManagementComponent,
    EditGroupNameComponent,
    ModalAgreementComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    TranslateModule,
    MaterialComponentsModule,
    NgSelectModule,
    PipesModule,
    NgxMaskModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    ActionButtonComponent,
    ActionButtonOutlineComponent,
    ArrowButtonComponent,
    ArrowButtonComponent,
    AlertModalComponent,
    AnimatedOverlayComponent,
    ActionButtonComponent,
    ItemDeviceComponent,
    HeaderComponent,
    HeaderUserMenuOverlayComponent,
    HeaderUserComponent,
    MainTitleComponent,
    PaginationComponent,
    SidebarComponent,
    SidebarMenuOverlayComponent,
    SettingsModalComponent,
    ModalUserAgreementAcceptedComponent,
    UserAgreementModalComponent,
    ThingsModalComponent,
    CustomPaginationComponent,
    DisassociateModalComponent,
    AssociateButtonComponent,
    DisassociateButtonComponent,
    DatePickerComponent,
    InfoCardsComponent,
    ApplicationDropdownComponent,
    ExportationRecipientModalComponent,
    ExportationDoneModalComponent,
    AlertComponent,
    ReactivateSubscriptionModalComponent,
    SapPlantComponent,
    ManagementComponent,
  ],
})
export class ComponentsModule {}
