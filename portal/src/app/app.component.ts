import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus
} from '@azure/msal-browser';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { filter, skip, takeUntil } from 'rxjs/operators';
import { ModalUserAgreementComponent } from './components/smart/modal-user-agreement/modal-user-agreement.component';
import { FeatureFlags } from './core/constants/feature-flags.const';
import { FeatureFlagsService } from './core/services/feature-flags/feature-flags.service';
import { Role } from './shared/enums/role';
import { IFeatureFlag } from './shared/interfaces/feature-flag.interface';
import { ArrayHelper } from './shared/utils/array-helper/array-helper';
import { FeatureFlagsStateService } from './stores/feature-flags/feature-flags-state.service';
import { PanicAlertService } from './stores/panic-alert/panic-alert.service';
import { UserAgreementService } from './stores/user-agreement/user-agreement.service';
import { UserProfileService } from './stores/user-profile/user-profile.service';
import { StartupService } from './core/services/load-app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly destroying$ = new Subject<void>();

  public isAuthenticated: boolean;

  public validCultures: string[] = ['en-US', 'pt-BR'];

  public isSignalRConnected$: Observable<boolean>;

  constructor(
    translate: TranslateService,
    private panicAlertService: PanicAlertService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private userAgreementService: UserAgreementService,
    private featureFlagService: FeatureFlagsService,
    private userProfileService: UserProfileService,
    private dialog: MatDialog,
    private featureFlagsStateService: FeatureFlagsStateService,
    private msalBroadcastService: MsalBroadcastService,
    private authService: MsalService,
    private router: Router,
    private startupService: StartupService
  ) {
    let language = localStorage.getItem('_culture');

    if (_.isEmpty(language)) {
      if (this.validCultures.indexOf(navigator.language) > -1) {
        language = navigator.language;
      } else {
        language = 'en-US';
      }

      localStorage.setItem('_culture', language);
    }

    translate.setDefaultLang(language);

    translate.use(language);

    this.setCustomIcons();
  }

  public ngOnInit(): void {
    this.setupUserProfile();
    this.isSignalRConnected$ = this.panicAlertService.isSignalRConnected$;
  }

  ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }

  private setupUserProfile() {
    this.authService.instance.enableAccountStorageEvents();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          this.router.navigate(['/']);
        } else {
          const payload = result.payload as AuthenticationResult;

          this.authService.instance.setActiveAccount(payload.account);
          this.checkAndSetActiveAccount();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }

  private checkAndSetActiveAccount() {
    const allAccounts = this.authService.instance.getAllAccounts();
    const activeAccount =
      this.authService.instance.getActiveAccount() ?? allAccounts[0];

    if (activeAccount) {
      this.userProfileService.setUserProfile(activeAccount);
      this.getFeatureFlags();
      this.setupUser();
      this.startupService.preloadAllStores();
    } else {
      this.router.navigate(['/']);
    }
  }

  private setupUser() {
    if (this.userProfileService.getUserProfile()) {
      this.setupUserAgreementDocument();
    }
  }

  private async getFeatureFlags() {
    const featureFlags = await this.featureFlagService.getFeatureFlags();
    this.activateDeviceGroupFlag(
      featureFlags,
      FeatureFlags.DeviceGroupDisclaimer
    );
    this.activateDeviceGroupFlag(
      featureFlags,
      FeatureFlags.DeviceGroupFiltering
    );
  }

  private async activateDeviceGroupFlag(
    featureFlags: IFeatureFlag[],
    featureFlagName: string
  ) {
    const { roles } = this.userProfileService.getUserProfile();

    if (roles && roles.length > 0) {
      const deviceGroupFilteringFlag = featureFlags.find(
        featureFlag => featureFlag.name === featureFlagName
      );

      deviceGroupFilteringFlag.activeForUser =
        deviceGroupFilteringFlag.value &&
        ArrayHelper.includesMany(roles, [
          Role.OperationalAnalyst,
          Role.Consult
        ]);

      this.featureFlagsStateService.set(featureFlags);
    }
  }

  private setupUserAgreementDocument(): void {
    this.userAgreementService.updateCurrentAgreementDocument();

    this.userAgreementService.document$.subscribe(document => {
      if (document) {
        this.setupUserAgreementAcceptance();
      }
    });
  }

  private setupUserAgreementAcceptance() {
    this.userAgreementService.updateLastUserAcceptance();

    this.userAgreementService.userAgreement$
      .pipe(skip(1))
      .subscribe(userAgreement => {
        if (!userAgreement) {
          this.openUserAgreementModal();
        }
      });
  }

  private openUserAgreementModal() {
    this.dialog.open(ModalUserAgreementComponent, {
      disableClose: true,
      panelClass: 'modal-user-agreement',
      backdropClass: 'modal-user-agreement-backdrop'
    });
  }

  private setCustomIcons() {
    this.matIconRegistry
      .addSvgIcon(
        'clear_filter',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/clearfilter.svg'
        )
      )
      .addSvgIcon(
        'clear_filter_blue',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/clearfilterBlue.svg'
        )
      )
      .addSvgIcon(
        'person-moving-green',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/personMovingGreen.svg'
        )
      )
      .addSvgIcon(
        'person-moving-grey',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/personMovingGrey.svg'
        )
      )
      .addSvgIcon(
        'battery-low',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/Battery_Low.svg'
        )
      )
      .addSvgIcon(
        'battery-medium',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/Battery_Medium.svg'
        )
      )
      .addSvgIcon(
        'trash',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/trash.svg'
        )
      )
      .addSvgIcon(
        'trash-grey',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/trash-grey.svg'
        )
      )
      .addSvgIcon(
        'warning-exclamation',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/exclamation.svg'
        )
      );
  }
}
