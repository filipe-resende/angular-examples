import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';
import { HeaderItem } from '../../../../shared/models/header-item';
import { UserProfileService } from '../../../../stores/user-profile/user-profile.service';
import { MatDialog } from '@angular/material/dialog';
import { SideNavUsageMetricsComponent } from '../../sidenav-usage-metrics/sidenav-usage-metrics';
import { USAGE_METRICS_ROUTE } from '../../../../core/constants/usage-metrics-rout.const';

@Component({
  selector: 'app-header-menu-overlay',
  templateUrl: 'header-menu-overlay.component.html',
  styleUrls: ['header-menu-overlay.component.scss']
})
export class HeaderMenuOverlayComponent implements OnInit {
  @Input()
  public items: HeaderItem[];

  @Input()
  public overlayRef;

  private userRoles: string[];

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userProfileService.userProfile$
      .pipe(filter(userProfile => !!userProfile))
      .subscribe(userProfile => {
        this.userRoles = userProfile.roles;
      });

    this.items = this.mapAuthorizedItemsToDisplayOrHide(this.items);
  }

  public onItemClick(route: string): void {
    if (route === USAGE_METRICS_ROUTE) {
      this.openSideNavUsageMetrics();
    } else {
      this.navigateTo(route);
    }

    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  private navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  private mapAuthorizedItemsToDisplayOrHide(items: HeaderItem[]) {
    return items.map(item => {
      const isAllowed = item.roles.some(role => this.userRoles.includes(role));

      return { ...item, show: isAllowed } as HeaderItem;
    });
  }

  private openSideNavUsageMetrics(): void {
    this.dialog.open(SideNavUsageMetricsComponent, {});
  }
}
