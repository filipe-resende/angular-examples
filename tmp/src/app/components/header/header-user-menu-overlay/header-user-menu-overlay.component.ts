import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Extensions } from 'src/app/shared/extensions';
import { AuthService } from '../../../services/auth/auth.service';
import { SettingsModalComponent } from '../../settings-modal/settings-modal.component';
import { UserAgreementModalComponent } from '../../smart/user-agreement-modal/user-agreement-modal.component';
import { ClickableItem } from '../header-user/header-user.component';

@Component({
  selector: 'app-header-user-menu-overlay',
  templateUrl: 'header-user-menu-overlay.component.html',
  styleUrls: ['./header-user-menu-overlay.component.scss'],
})
export class HeaderUserMenuOverlayComponent {
  @Input()
  public overlayRef: OverlayRef;

  @Input()
  public target: HTMLElement;

  public menuWidth = 300;

  public get items(): ClickableItem[] {
    return [
      {
        icon: 'account_circle',
        label: 'HEADER.SIDEBAR.PROFILE_SETTINGS_TEXT',
        click: this.settings.bind(this),
      },
      {
        icon: null,
        label: 'HEADER.SIDEBAR.PERSONAL_DATA',
        click: this.openUserAgreementOverlay.bind(this),
      },
      {
        icon: 'exit_to_app',
        label: 'HEADER.SIDEBAR.LOGOUT_TEXT',
        click: this.logout.bind(this),
      },
    ];
  }

  constructor(private dialog: MatDialog, private authService: AuthService) {}

  public onClick(item: ClickableItem): void {
    if (_.isFunction(item.click)) {
      item.click();
    }

    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  public logout(): void {
    this.authService.logout();
  }

  private settings(): void {
    this.dialog.open(SettingsModalComponent, {
      width: Extensions.isMobile.any() ? '100%' : '50%',
    });
  }

  private openUserAgreementOverlay(): void {
    this.dialog.open(UserAgreementModalComponent, {
      panelClass: 'modal-user-agreement',
    });
  }
}
