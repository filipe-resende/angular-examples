/* eslint-disable import/no-extraneous-dependencies */

import { OverlayModule } from '@angular/cdk/overlay';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEn from '@angular/common/locales/en-US-POSIX';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import {
  MsalBroadcastService,
  MsalInterceptor,
  MsalRedirectComponent,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';
import { NgxMaskModule } from 'ngx-mask';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { DialogModule } from './components/presentational/dialog/dialog.module';
import { LoadingModule } from './components/presentational/loading/loading.module';
import { MainModule } from './components/presentational/main/main.module';
import { NotificaitonModule } from './components/presentational/notification/index';
import { SettingsComponent } from './components/presentational/settings/settings.component';
import { MapModule } from './components/smart/map/map.module';
import { CoreModule } from './core/core.module';
import { ExcelService } from './core/services/excel-service/excel.service';
import { StartupService } from './core/services/load-app.service';
import { ForbiddenPage } from './pages/forbidden/forbidden.page';
import { SharedModule } from './shared/shared.module';
import { BreadcrumbState } from './stores/breadcrumb/breadcrumb.state';
import { DetectorsState } from './stores/detectors/detectors.state';
import { DevicesState } from './stores/devices/devices.state';
import { FeatureFlagsState } from './stores/feature-flags/feature-flags.state';
import { FlightsState } from './stores/flights/flights.state';
import { GeofencesState } from './stores/geofences/geofences.state';
import { HeaderState } from './stores/header/header.state';
import { NotificationsState } from './stores/notifications/notifications.state';
import { PanicAlertState } from './stores/panic-alert/panic-alert.state';
import { PerimetersState } from './stores/perimeters/perimeters.state';
import { PoisState } from './stores/pois/pois.state';
import { RealTimeSelectorState } from './stores/real-time-events-selector/real-time-events-selector.state';
import { SitesState } from './stores/sites/sites.state';
import { ThingsState } from './stores/things/things.state';
import { TransportsState } from './stores/transports/transports.state';
import { UserAgreementState } from './stores/user-agreement/user-agreement.state';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory
} from './core/middleware/msal.config-factory';
import { UserProfileState } from './stores/user-profile/user-profile.state';
import { RoleGuard } from './core/role.guard';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

registerLocaleData(localePt);
registerLocaleData(localeEn);

@NgModule({
  declarations: [AppComponent, SettingsComponent, ForbiddenPage],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LoadingModule,
    MainModule,
    ComponentsModule,
    OverlayModule,
    CoreModule,
    SharedModule,
    MapModule,
    DialogModule,
    NotificaitonModule.forRoot(),
    AppRoutingModule,
    PerfectScrollbarModule,
    ToastrModule.forRoot(),
    NgxsModule.forRoot([
      HeaderState,
      BreadcrumbState,
      SitesState,
      ThingsState,
      NotificationsState,
      GeofencesState,
      PoisState,
      UserProfileState,
      TransportsState,
      PerimetersState,
      DevicesState,
      PanicAlertState,
      FlightsState,
      UserAgreementState,
      DetectorsState,
      FeatureFlagsState,
      RealTimeSelectorState
    ]),
    NgxsDispatchPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [
    StartupService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    RoleGuard,
    MsalBroadcastService,
    ExcelService,
    DatePipe
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {}
