import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { filter } from 'rxjs/operators';
import { Extensions } from '../../../../shared/extensions';
import { SettingsComponent } from '../../settings/settings.component';
import { OverlayService } from '../../../../core/services/overlay.service';
import { HeaderUserMenuOverlayComponent } from '../header-user-menu-overlay/header-user-menu-overlay.component';
import { HeaderUserItem } from './header-user-item';
import { ModalUserAgreementComponent } from '../../../smart/modal-user-agreement/modal-user-agreement.component';
import { UserProfileService } from '../../../../stores/user-profile/user-profile.service';
import { SitesService } from '../../../../stores/sites/sites.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderUserComponent implements OnInit, OnDestroy {
  public isOpen = false;

  public userName = '';

  public get items(): HeaderUserItem[] {
    return [
      {
        icon: 'account_circle',
        label: 'SIDEBAR.PROFILE_SETTINGS_TEXT',
        click: this.settings.bind(this)
      },
      {
        icon: '',
        label: 'SIDEBAR.SENSITIVE_DATA_DIALOG',
        click: this.openUserAgreementModal.bind(this)
      },
      {
        icon: 'exit_to_app',
        label: 'SIDEBAR.LOGOUT_TEXT',
        click: this.logout.bind(this)
      }
    ];
  }

  private userMenuOverlayRef: OverlayRef;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: MsalService,
    private userProfileService: UserProfileService,
    private sitesService: SitesService,
    private dialog: MatDialog,
    private overlayService: OverlayService
  ) {}

  public ngOnInit() {
    this.setupMenuOverlay();
    this.onUserStateChangeHandler();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public logout() {
    localStorage.removeItem('lastSiteModelSelected');
    this.sitesService.clearSitesStore();
    this.authService.logoutRedirect();
  }

  public openMenuOverlay(target) {
    this.overlayService.open<HeaderUserMenuOverlayComponent>(
      this.userMenuOverlayRef,
      target,
      HeaderUserMenuOverlayComponent,
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 56,
        offsetX: 1
      },
      {
        items: this.items
      }
    );
  }

  public settings() {
    this.dialog.open(SettingsComponent, {
      disableClose: true,
      width: Extensions.isMobile.any() ? '100%' : '50%'
    });
  }

  private onUserStateChangeHandler() {
    this.userProfileService.userProfile$
      .pipe(filter(userProfile => !!userProfile))
      .subscribe(userProfile => {
        this.userName = userProfile.userName;
      });
  }

  private setupMenuOverlay() {
    this.userMenuOverlayRef = this.overlayService.create();
  }

  private openUserAgreementModal(): void {
    this.dialog.open(ModalUserAgreementComponent, {
      panelClass: 'modal-user-agreement'
    });
  }
}
