import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { filter, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { ITabItem } from 'src/app/model/Itab-item';
import { SidebarMenuOverlayComponent } from './sidebar-menu-overlay/sidebar-menu-overlay.component';

enum Tabs {
  Applications = 1,
  ApplicationsList,
  MonthlyMetrics,
  Devices,
  Search,
  Groups,
  Batchload,
  Runload,
  HistoryLoad,
  Things,
  Equipments,
  Dashboard,
}
const ALLOWED_ROLES_APPLICATION_PAGE = [
  Roles.Administrador,
  Roles.AnalistaSegurancaEmpresarial,
];
const ALLOWED_ROLES_EQUIPMENTS_PAGE = [
  Roles.Administrador,
  Roles.AnalistaSegurancaEmpresarial,
];
const ALLOWED_ROLES_DASHBOARD_PAGE = [
  Roles.Administrador,
  Roles.AnalistaSegurancaEmpresarial,
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  private text: any = {};

  public tabs: ITabItem[] = [];

  private userMenuOverlayRef: OverlayRef;

  constructor(
    private overlayService: OverlayService,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
  ) {
    this.translate
      .get('HOME.APPLICATION_BUTTON')
      .pipe(take(1))
      .subscribe(ab => {
        this.text.applicationButton = ab;
      });
    this.translate
      .get('HOME.DEVICE_BUTTON')
      .pipe(take(1))
      .subscribe(db => {
        this.text.deviceButton = db;
      });
    this.translate
      .get('HOME.THINGS_BUTTON')
      .pipe(take(1))
      .subscribe(tb => {
        this.text.thingsButton = tb;
      });
    this.translate
      .get('HOME.DETECTORS_BUTTON')
      .pipe(take(1))
      .subscribe(dtb => {
        this.text.detectorsButton = dtb;
      });
    this.translate
      .get('HOME.SUB_MENUS.SEARCH')
      .pipe(take(1))
      .subscribe(s => {
        this.text.search = s;
      });
    this.translate
      .get('HOME.SUB_MENUS.BATCH_LOAD')
      .pipe(take(1))
      .subscribe(bl => {
        this.text.batchLoad = bl;
      });
    this.translate
      .get('HOME.SUB_MENUS.RUN_LOAD')
      .pipe(take(1))
      .subscribe(rl => {
        this.text.runLoad = rl;
      });
    this.translate
      .get('HOME.SUB_MENUS.HISTORY_LOAD')
      .pipe(take(1))
      .subscribe(hl => {
        this.text.historyLoad = hl;
      });
    this.translate
      .get('HOME.DASHBOARD_BUTTON')
      .pipe(take(1))
      .subscribe(dsb => {
        this.text.dashboardButton = dsb;
      });
    this.translate
      .get('HOME.SUB_MENUS.APPLICATION_LIST')
      .pipe(take(1))
      .subscribe(al => {
        this.text.applicationList = al;
      });
    this.translate
      .get('HOME.SUB_MENUS.MONTHLY_METRICS')
      .pipe(take(1))
      .subscribe(mm => {
        this.text.monthlyMetrics = mm;
      });
    this.translate
      .get('HOME.SUB_MENUS.GROUPS')
      .pipe(take(1))
      .subscribe(g => {
        this.text.groups = g;
      });

    this.tabs = [
      {
        id: Tabs.Applications,
        name: this.text.applicationButton,
        route: 'applications',
        menus: [
          {
            id: Tabs.ApplicationsList,
            name: this.text.applicationList,
            route: 'applications',
            roles: [Roles.Administrador, Roles.AnalistaSegurancaEmpresarial],
          },
          {
            id: Tabs.MonthlyMetrics,
            name: this.text.monthlyMetrics,
            route: 'metrics',
            roles: [Roles.Administrador, Roles.AnalistaSegurancaEmpresarial],
          },
        ],
        submenu: [],
      },
      {
        id: Tabs.Devices,
        name: this.text.deviceButton,
        route: 'devices',
        menus: [
          {
            id: Tabs.Search,
            name: this.text.search,
            route: 'devices',
            roles: [
              Roles.Administrador,
              Roles.Euc,
              Roles.Paebm,
              Roles.AnalistaSegurancaEmpresarial,
              Roles.AnalistaOperacional,
            ],
          },
          {
            id: Tabs.Groups,
            name: this.text.groups,
            route: 'groups',
            roles: [
              Roles.Administrador,
              Roles.Paebm,
              Roles.AnalistaSegurancaEmpresarial,
              Roles.AnalistaOperacional,
              Roles.Euc,
            ],
          },
          {
            id: Tabs.Batchload,
            name: this.text.batchLoad,
            roles: [
              Roles.Administrador,
              Roles.Euc,
              Roles.AnalistaSegurancaEmpresarial,
            ],
          },
        ],

        submenu: [
          {
            id: Tabs.Runload,
            name: this.text.runLoad,
            route: 'runload',
          },
          {
            id: Tabs.HistoryLoad,
            name: this.text.historyLoad,
            route: 'history-load',
          },
        ],
      },
      {
        id: Tabs.Things,
        name: this.text.thingsButton,
        route: 'things',
      },
      {
        id: Tabs.Equipments,
        name: this.text.detectorsButton,
        route: 'equipments',
      },
      {
        id: Tabs.Dashboard,
        name: this.text.dashboardButton,
        route: 'dashboard',
      },
    ];
  }

  ngOnInit(): void {
    this.authService.userInfo$.pipe(filter(x => !!x)).subscribe(userInfo => {
      if (!ALLOWED_ROLES_APPLICATION_PAGE.includes(userInfo.role)) {
        this.tabs = this.tabs.filter(tab => tab.id !== Tabs.Applications);
      }

      if (!ALLOWED_ROLES_DASHBOARD_PAGE.includes(userInfo.role)) {
        this.tabs = this.tabs.filter(tab => tab.id !== Tabs.Dashboard);
      }

      if (!ALLOWED_ROLES_EQUIPMENTS_PAGE.includes(userInfo.role)) {
        this.tabs = this.tabs.filter(tab => tab.id !== Tabs.Equipments);
      }
      this.userMenuOverlayRef = this.overlayService.create();
    });
  }

  public onMenuItemClick(elementRef, route, menus, submenu): void {
    if (menus) {
      this.openMenuOverlay(elementRef, menus, submenu);
    } else if (route) {
      this.navigateTo(route);
    }
  }

  public isActiveRoute(route: string): boolean {
    const filteredItem = this.tabs.find(item => item.route === route);

    if (!filteredItem) {
      return false;
    }

    if (filteredItem.menus && filteredItem.menus.length > 0) {
      if (this.analyzeRoutes(filteredItem.menus)) {
        return true;
      }
    }

    if (filteredItem.submenu && filteredItem.submenu.length > 0) {
      if (this.analyzeRoutes(filteredItem.submenu)) {
        return true;
      }
    }
    return document.location.pathname.includes(route);
  }

  private analyzeRoutes(items: any[]) {
    const match = items.find(item =>
      document.location.pathname.includes(item.route),
    );

    if (match) {
      return true;
    }
    return false;
  }

  private openMenuOverlay(target, menus, submenu) {
    this.overlayService.open<SidebarMenuOverlayComponent>(
      this.userMenuOverlayRef,
      target,
      SidebarMenuOverlayComponent,
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 56,
        offsetX: 8,
      },
      {
        items: menus,
        itemMenu: submenu,
      },
    );
  }

  private navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
