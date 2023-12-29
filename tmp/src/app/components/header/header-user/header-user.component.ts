import { OverlayRef } from '@angular/cdk/overlay';
import { Component, ElementRef, OnInit } from '@angular/core';
import moment from 'moment';
import { filter, take } from 'rxjs/operators';
import { AppInsightsService } from 'src/app/services/infra/app-insights/app-insights.service';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { IUserInfoWithRole } from 'src/app/shared/interfaces/iam.interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { HeaderUserMenuOverlayComponent } from '../header-user-menu-overlay/header-user-menu-overlay.component';

export interface ClickableItem {
  icon: string;
  label: string;
  click?: () => void;
}
interface IHeaderUserInfo extends IUserInfoWithRole {
  lastLoginTime: string;
}
@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss'],
})
export class HeaderUserComponent implements OnInit {
  userInfo: IHeaderUserInfo = {
    cn: '',
    groupMembership: [],
    mail: '',
    UserFullName: '',
    lastLoginTime: '',
    FirstName: '',
    role: null,
  };

  private userMenuOverlayRef: OverlayRef;

  constructor(
    private overlayService: OverlayService,
    private appInsightsService: AppInsightsService,
    private authService: AuthService,
  ) {}

  public ngOnInit(): void {
    this.authService.userInfo$
      .pipe(filter(userInfo => !!userInfo))
      .subscribe(userInfo => {
        this.userInfo = userInfo as IHeaderUserInfo;
        this.getLastLogin();
        this.userMenuOverlayRef = this.overlayService.create();
      });
  }

  public openUserMenuOverlay(target: ElementRef): void {
    this.overlayService.open<HeaderUserMenuOverlayComponent>(
      this.userMenuOverlayRef,
      target,
      HeaderUserMenuOverlayComponent,
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 64,
        offsetX: 1,
      },
    );
  }

  public getLastLogin(): void {
    this.appInsightsService
      .getLastTwoLoginEvents()
      .pipe(take(1))
      .subscribe(logObject => {
        const lastLoginTimestamp = logObject?.value[0]?.timestamp;
        this.userInfo.lastLoginTime = moment(lastLoginTimestamp).format(
          'DD/MM/YY HH:mm',
        );
      });
  }
}
