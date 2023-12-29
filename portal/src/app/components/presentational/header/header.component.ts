import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OverlayRef } from '@angular/cdk/overlay';
import { filter } from 'rxjs/operators';
import { HeaderService } from '../../../stores/header/header.service';
import { HeaderSearchbar } from '../../../stores/header/header.state';
import { HeaderMenuOverlayComponent } from './header-menu-overlay/header-menu-overlay.component';
import { OverlayService } from '../../../core/services/overlay.service';
import { Role } from '../../../shared/enums/role';
import { HeaderDropdown } from '../../../shared/models/header-dropdown';
import { environment } from '../../../../environments/environment';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';
import { FeatureFlags } from '../../../core/constants/feature-flags.const';
import { FeatureFlagsStateService } from '../../../stores/feature-flags/feature-flags-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public readonly thingsManagementUrl = environment.thingsManagementPortalUrl;

  public Role = Role;

  public searchbar: HeaderSearchbar;

  public userRoles: string[] = [];

  public items: HeaderDropdown[] = [
    {
      label: 'SIDEBAR.DASHBOARD_TEXT',
      route: '/dashboard',
      roles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities
      ]
    },
    {
      label: 'SIDEBAR.DISPLACEMENTS_TEXT',
      route: '/displacement',
      roles: [
        Role.BusinessSecurityAnalyst,
        Role.ControlCenter,
        Role.Transport,
        Role.Paebm,
        Role.Facilities
      ],
      subMenus: [
        {
          label: 'DISPLACEMENTS.BUS',
          route: '/displacement-new',
          roles: [
            Role.BusinessSecurityAnalyst,
            Role.ControlCenter,
            Role.Transport,
            Role.Paebm,
            Role.Facilities
          ]
        },
        {
          label: 'SIDEBAR.FLIGHTS_AND_GATES',
          route: '/flights-and-gates',
          roles: [
            Role.BusinessSecurityAnalyst,
            Role.ControlCenter,
            Role.Transport,
            Role.Paebm,
            Role.Facilities
          ]
        }
      ]
    },
    {
      label: 'SIDEBAR.LIST_TEXT',
      route: '/list',
      roles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities
      ]
    },
    {
      label: 'SIDEBAR.SEARCH_TEXT',
      route: '/historic',
      roles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities
      ]
    },
    {
      label: 'SIDEBAR.DEVICES',
      route: '/devices',
      roles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities
      ]
    },
    {
      label: 'SIDEBAR.ADM_TEXT',
      route: '/adm',
      roles: [
        Role.BusinessSecurityAnalyst,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities
      ],
      subMenus: [
        {
          label: 'SIDEBAR.GEOFENCES_TEXT',
          route: '/fence',
          roles: [
            Role.BusinessSecurityAnalyst,
            Role.ControlCenter,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities
          ]
        },
        {
          label: 'SIDEBAR.USAGE_METRICS_TEXT',
          route: 'usageMetrics',
          roles: [Role.BusinessSecurityAnalyst]
        }
      ]
    }
  ];

  private subscriptions: Subscription[] = [];

  private menusOverlayRef: OverlayRef;

  private notificationOverlayRef: OverlayRef;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private overlayService: OverlayService,
    private userProfileService: UserProfileService,
    private featureFlagsService: FeatureFlagsStateService
  ) {}

  public ngOnInit(): void {
    this.setupNotificationOverlay();
    this.setupMenuOverlay();
    this.setupSearchbar();
    this.onUserStateChangeHandler();
    this.setMenuItems();
  }

  private setMenuItems() {
    const featureflagsSubscription$ =
      this.featureFlagsService.activeFeatureFlags$.subscribe(featureFlags => {
        const deviceGroupFilteringFlag = featureFlags.find(
          featureFlag => featureFlag.name === FeatureFlags.DeviceGroupFiltering
        );

        if (
          this.userRoles.includes(Role.Consult) &&
          !deviceGroupFilteringFlag.value
        ) {
          this.items
            .find(x => x.route === '/displacement')
            .roles.push(Role.Consult);
          this.items
            .find(x => x.route === '/displacement-new')
            .roles.push(Role.Consult);
          this.items
            .find(x => x.route === '/flights-and-gates')
            .roles.push(Role.Consult);
        }
      });
    this.subscriptions.push(featureflagsSubscription$);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public isActiveTab(route: string): boolean {
    const [filteredItem] = this.items.filter(item => item.route === route);
    const itemContainsSubMenus =
      filteredItem.subMenus && filteredItem.subMenus.length > 0;

    if (itemContainsSubMenus) {
      let anySubmenuRouteMatchesWithPathname = false;

      filteredItem.subMenus.forEach(item => {
        if (document.location.pathname.includes(item.route)) {
          anySubmenuRouteMatchesWithPathname = true;
        }
      });

      return anySubmenuRouteMatchesWithPathname;
    }
    return document.location.pathname.includes(route);
  }

  public isUserAuthorizedToSeeHeaderItem(userRoles: Role[]): boolean {
    let authorized = false;

    userRoles.forEach(role => {
      if (this.userRoles.includes(role)) {
        authorized = true;
      }
    });

    return authorized;
  }

  public updateSearchbarValue(typedValue): void {
    this.headerService.updateSearchbar({ text: typedValue });
  }

  public onSearchbarIconClick(): void {
    this.headerService.onSearchbarIconClick();
  }

  public onMenuItemClick(elementRef, route, subMenus): void {
    if (subMenus) {
      this.openMenuOverlay(elementRef, subMenus);
    } else if (route) {
      this.navigateTo(route);
    }
  }

  public onNotificationBellClick(): void {
    this.router.navigateByUrl('/notifications');
  }

  private onUserStateChangeHandler() {
    this.subscriptions.push(
      this.userProfileService.userProfile$
        .pipe(filter(x => !!x))
        .subscribe(userProfile => {
          this.userRoles = userProfile.roles;
        })
    );
  }

  private setupNotificationOverlay() {
    this.notificationOverlayRef = this.overlayService.create();
  }

  private setupMenuOverlay() {
    this.menusOverlayRef = this.overlayService.create();
  }

  private setupSearchbar() {
    const searchbar$ = this.headerService.searchbar$.subscribe(searchbar => {
      this.searchbar = searchbar;
    });

    this.subscriptions.push(searchbar$);
  }

  private openMenuOverlay(target, subMenus) {
    this.overlayService.open<HeaderMenuOverlayComponent>(
      this.menusOverlayRef,
      target,
      HeaderMenuOverlayComponent,
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 56,
        offsetX: 8
      },
      {
        items: subMenus
      }
    );
  }

  private navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
