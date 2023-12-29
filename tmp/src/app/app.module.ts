import { DatePipe, registerLocaleData } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { OAuthModule } from 'angular-oauth2-oidc';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMaskModule } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent,
  MsalService,
} from '@azure/msal-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AuthService } from './services/auth/auth.service';
import { ApplicationsEffectsService } from './stores/applications/applications.effects';
import { ApplicationsState } from './stores/applications/applications.state';
import { DeviceStatusState } from './stores/device-status/device-status.state';
import { FeatureFlagsState } from './stores/feature-flags/feature-flags.state';
import { ThingsEffectService } from './stores/things/things.effects';
import { ThingsState } from './stores/things/things.state';
import { UserAgreementState } from './stores/user-agreement/user-agreement.state';
import { UserState } from './stores/user/user.state';
import { AccessDeniedPageComponent } from './views/access-denied-page/access-denied-page.component';
import { BypassLoginModule } from './views/bypass-login/bypass-login.module';
import { DetectorsListComponent } from './views/detectors/components/detectors-list/detectors-list.component';
import { DropdownPerimeterComponent } from './views/detectors/components/dropdown-perimeter/dropdown-perimeter.component';
import { ItemDetectorComponent } from './views/detectors/components/item-detector/item-detector.component';
import { TypeEquipmentsComponent } from './views/detectors/components/type-equipments/type-equipments.component';
import { DetectorsComponent } from './views/detectors/detectors.component';
import { MainComponent } from './views/main/main.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from './core/middleware/msal.config-factory';
import { RoleGuard } from './core/role.guard';
import { UserProfileState } from './stores/user-profile/user-profile.state';

registerLocaleData(ptBr);

// TODO: Pode ser uma classe
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NotFoundComponent,
    DetectorsComponent,
    ItemDetectorComponent,
    DetectorsListComponent,
    TypeEquipmentsComponent,
    DropdownPerimeterComponent,
    AccessDeniedPageComponent,
  ],
  imports: [
    BrowserModule,
    UiSwitchModule,
    ComponentsModule,
    AppRoutingModule,
    MsalModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgxMaskModule.forRoot(),
    ModalModule.forRoot(),
    // TODO: modulos forRoot podem ter seus próprios modulos
    BsDatepickerModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgxsModule.forRoot(
      [
        UserProfileState,
        ApplicationsState,
        ApplicationsEffectsService,
        ThingsState,
        ThingsEffectService,
        UserAgreementState,
        UserState,
        DeviceStatusState,
        FeatureFlagsState,
      ],
      { developmentMode: !environment.production },
    ),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsDispatchPluginModule.forRoot(),
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.thingsManagementBffUrl],
        sendAccessToken: true,
      },
    }),
    MatTooltipModule,
    BypassLoginModule,
    MatPaginatorModule,
    MatSortModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    DatePipe,
    AuthService,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    RoleGuard,
    MsalBroadcastService,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: Window, useValue: window },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  exports: [TranslateModule],
})
export class AppModule {}
