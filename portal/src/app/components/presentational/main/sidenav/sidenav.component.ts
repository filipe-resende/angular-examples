import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidenavItem } from './item/item.model';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() public theme = {
    header: 'default-white',
    aside: 'default-default',
    logo: 'default-green'
  };

  public items: SidenavItem[] = [];

  public profiles: SidenavItem[] = [];

  private itemsSubscription: Subscription;

  private routerEventsSubscription: Subscription;

  constructor(private service: SidenavService, private router: Router) {
    this.service.languageChange.subscribe(res => {
      this.itemsSubscription.unsubscribe();

      this.refreshSideNav();
    });
  }

  public ngOnInit() {
    this.refreshSideNav();

    this.routerEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.service.nextCurrentlyOpenByRoute(event.url);
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 400);
      }
    });
  }

  public ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
    this.routerEventsSubscription.unsubscribe();
  }

  private refreshSideNav() {
    this.itemsSubscription = this.service.items$.subscribe(
      (items: SidenavItem[]) => {
        this.items = this.sortRecursive(items, 'position');
      }
    );

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 400);
    // this.profiles = this.service.profileItems;
  }

  private sortRecursive(array: SidenavItem[], propertyName: string) {
    return array;
  }
}
